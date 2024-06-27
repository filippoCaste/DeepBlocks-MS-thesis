# network_generation/model.py

import numpy as np
import torch, os, packaging, inspect
import torch.nn as nn
import torch.optim as optim
import torch.nn.functional as F
from datasets import load_dataset, Audio, Image, load_from_disk
from transformers import AutoModelForSequenceClassification, AutoTokenizer, BertTokenizer, ViTForImageClassification, ViTImageProcessor
from transformers import Trainer, TrainingArguments, get_scheduler
from torch.utils.data import DataLoader, default_collate
import evaluate
from torchvision import transforms
from PIL import Image
from captum.attr import IntegratedGradients

from network_generation.pytorch_functions import valid_pytorch_functions, function_params
UPLOAD_DIRECTORY = "uploads"

############################################################################################################
#                                                 TRAINING                                                 #
############################################################################################################
def resize_images(ds_batch):
    ds_batch["pixel_values"] = [image.convert("RGB").resize((100,100)) for image in ds_batch["image"]]
    return ds_batch

def train_model(nodes, edges, params, user_id, uploads):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    ds_config = None
    for node in nodes:
        if(node.parameters[0].key == 'input_dataset'):
            ds_name = node.parameters[0].value
            ds_type = node.parameters[1].value
            ds_config = node.parameters[2].value
            break

    if ds_name is None or ds_type is None:
        raise ValueError("Input dataset informations are not correct")

    try: 
        if not os.path.exists(os.path.join(UPLOAD_DIRECTORY, ds_name)):
            if ds_config == 'None':
                dataset = load_dataset(ds_name, trust_remote_code=True)
            else: 
                dataset = load_dataset(ds_name, ds_config, trust_remote_code=True)
            
            dataset.save_to_disk(os.path.join(UPLOAD_DIRECTORY, ds_name))

        else:
            dataset = load_from_disk(os.path.join(UPLOAD_DIRECTORY, ds_name))
    
    except Exception as e:
        raise Exception(e)

    if dataset is None:
        raise Exception("Dataset not found")

    if ds_type == "text":
        auto_tokenizer = AutoTokenizer.from_pretrained("google-bert/bert-base-cased")
        
        def preprocess_function(examples):
            encoding = auto_tokenizer(examples["text"], padding="max_length", truncation=True)
            return encoding

        encoded_dataset = dataset.map(preprocess_function, batched=True)
        encoded_dataset = encoded_dataset.remove_columns(["text"])
        encoded_dataset = encoded_dataset.rename_column("label", "labels")
        encoded_dataset.set_format(type='torch')
    
    elif ds_type == "image":
        encoded_dataset = dataset.map(resize_images, remove_columns=["image"], batch_size=64, batched=True)
        encoded_dataset = encoded_dataset.rename_column("label", "labels")

        feature_extractor = ViTImageProcessor.from_pretrained("google/vit-base-patch16-224")
        auto_tokenizer = feature_extractor
    else:
        raise Exception("Unsupported dataset type")

    first_batch = next(iter(encoded_dataset['train']))

    if ds_type == "text":
        input_size = first_batch['input_ids'].shape[-1]
        labels = first_batch['labels']
    elif ds_type == "image":
        input_size = 100 * 100 * 3
        labels = first_batch['labels']
        
    model, msg = create_model(nodes, edges, input_size)
    
    if model is None:
        raise Exception("Model creation failed")
    
    model.to(device)

    try:
        n_epochs, lr, batch_size, loss_fn, optimizer = set_parameters(params, model.parameters())
    except Exception as e:
        raise ValueError(f"Model or parameters are not correct. Be sure to provide a valid model and parameters. {msg}")

    accuracy_metric = evaluate.load("accuracy")
    precision_metric = evaluate.load("precision")
    recall_metric = evaluate.load("recall")
    f1_metric = evaluate.load("f1")

    metrics = {
        "loss": [],
        "accuracy": [],
        "precision": [],
        "recall": [],
        "f1_score": []
    }    

    small_train_dataset = encoded_dataset["train"].shuffle(seed=42).select(range(900))
    small_eval_dataset = encoded_dataset["test"].shuffle(seed=42).select(range(900))

    if ds_type == 'text':
        train_dataloader = DataLoader(small_train_dataset, shuffle=True, batch_size=batch_size)
        eval_dataloader = DataLoader(small_eval_dataset, batch_size=batch_size)

    elif ds_type == 'image':
        train_dataloader = DataLoader(small_train_dataset, shuffle=True, batch_size=batch_size, collate_fn=collate_fn)
        eval_dataloader = DataLoader(small_eval_dataset, batch_size=batch_size, collate_fn=collate_fn)


    num_training_steps = n_epochs * len(train_dataloader)

    lr_scheduler = get_scheduler(
        name="linear", optimizer=optimizer, num_warmup_steps=0, num_training_steps=num_training_steps
    )

    # Train and evaluate the model
    try:
        model.train()
        total_loss = 0

        for epoch in range(n_epochs):
            for batch in train_dataloader:
                batch = {k: v.to(device) for k, v in batch.items()}
                labels = batch.pop('labels')

                if ds_type == 'text':
                    inputs = batch['input_ids'].to(device).float()
                    labels = labels

                elif ds_type == 'image':
                    image_batch = batch["pixel_values"]
                    inputs = image_batch.to(device).float()

                outputs = model(inputs)
                if outputs.shape[0] != labels.shape[0]:
                    raise Exception(f"Shapes of outputs {outputs.shape[0]} and labels {labels.shape[0]} do not match during training.")

                loss = loss_fn(outputs, labels)
                total_loss += loss.item()
                loss.backward()
                optimizer.step()
                lr_scheduler.step()
                optimizer.zero_grad()

            model.eval()
            for batch in eval_dataloader:
                if len(batch) == 0:
                    continue 
                batch = {k: v.to(device) for k, v in batch.items()}
                labels_batch = batch.pop('labels')

                if ds_type == 'text':
                    inputs = batch['input_ids'].to(device).float()
                    labels_batch = labels_batch
                elif ds_type == 'image':
                    image_batch = batch["pixel_values"]
                    inputs = image_batch.to(device).float()
                
                with torch.no_grad():
                    outputs = model(inputs)
                logits = outputs
                predictions = torch.argmax(logits, dim=-1)

                if predictions.dim() != labels_batch.dim():
                    raise Exception(f"Shapes of outputs {predictions.shape} and labels {labels_batch.shape} do not match during evaluation.")

                accuracy_metric.add_batch(predictions=predictions.cpu().numpy(), references=labels_batch.cpu().numpy())
                precision_metric.add_batch(predictions=predictions.cpu().numpy(), references=labels_batch.cpu().numpy())
                recall_metric.add_batch(predictions=predictions.cpu().numpy(), references=labels_batch.cpu().numpy())
                f1_metric.add_batch(predictions=predictions.cpu().numpy(), references=labels_batch.cpu().numpy())

            # Epoch evaluation
            accuracy = accuracy_metric.compute()
            precision = precision_metric.compute(average='weighted', zero_division=1)
            recall = recall_metric.compute(average='weighted', zero_division=1)
            f1 = f1_metric.compute(average='weighted')
            
            metrics["loss"].append(total_loss / len(train_dataloader))
            metrics["accuracy"].append(accuracy["accuracy"])
            metrics["precision"].append(precision["precision"])
            metrics["recall"].append(recall["recall"])
            metrics["f1_score"].append(f1["f1"])

    except Exception as e:
        print(f"Error during training: {e}")
        raise Exception(f"Error during training: {e}")
    
########################################################################################################################################################################
########################################### other measures #########################################################################################
########################################################################################################################################################################

    # # Integrated gradients
    # print("Integrated gradients")
    # ig = IntegratedGradients(auto_model)

    # # Choose a batch for IG explanation
    # batch = next(iter(data_loader))

    # if ds_type == 'text':
    #     text_batch = batch["text"]
    #     encoded_input = auto_tokenizer(text_batch, padding=True, truncation=True, return_tensors='pt')
    #     input_ids = encoded_input['input_ids'].to(device)
    #     attention_mask = encoded_input['attention_mask'].to(device)
    #     input_tuple = (input_ids.long(), attention_mask)
    #     attr, delta = ig.attribute(inputs=input_tuple, target=0, return_convergence_delta=True)
    # elif ds_type == 'image':
    #     image_batch = batch["pixel_values"]
    #     inputs = feature_extractor(images=image_batch, return_tensors="pt")
    #     input_ids = inputs['pixel_values'].to(device)
    #     attr, delta = ig.attribute(inputs=input_ids, target=0, return_convergence_delta=True)

    # attr = attr.detach().cpu().numpy()
    # print(attr)

########################################################################################################################################################################
########################################################################################################################################################################
########################################################################################################################################################################    
    print("Finished")
    return metrics, msg

def collate_fn(batch):
    resize_transform = transforms.Compose([
        # transforms.Resize((256, 256)),
        transforms.ToTensor()
    ])

    for sample in batch:
        if 'pixel_values' in sample:
            sample['pixel_values'] = resize_transform(sample['pixel_values'])
    return default_collate(batch)

def forward_model(nodes, edges, params, user_id):
    pass


############################################################################################################
#                                                  UTILS                                                   #
############################################################################################################

def set_parameters(params, model_parameters):
    n_epochs = 0
    lr = 0
    batch_size = 0
    loss = None
    optimizer = None

    for param in params:
        if param.key == "epochs":
            n_epochs = int(param.value)
        elif param.key == "learningRate":
            lr = float(param.value)
        elif param.key == "batchSize":
            batch_size = int(param.value)
        elif param.key == "loss":
            # can be CE or MSE
            if param.value == "CE":
                loss = nn.CrossEntropyLoss()
            elif param.value == "MSE":
                loss = nn.MSELoss()
            elif param.value == "BCE":
                loss = nn.BCELoss()

        elif param.key == "optimizer":
            # can be Adam or SGD
            if param.value == "Adam":
                optimizer = optim.Adam(model_parameters, lr=lr)
            elif param.value == "SGD":
                optimizer = optim.SGD(model_parameters, lr=lr)

    return n_epochs, lr, batch_size, loss, optimizer

def order_nodes(nodes, edges):
    """
    Orders the given nodes based on their input parameters.

    Args:
        nodes (list): A list of nodes to be ordered.
        edges (list): A list of edges connecting the nodes.

    Returns:
        list: A list of nodes in the order determined by their input parameters.
    """
    input_nodes = []
    for node in nodes:
        for param in node.parameters:
            if param.key == "input_file" or param.key == "input_dataset":
                input_nodes.append(node)
                break

    nodes_list = []
    for node in input_nodes:
        nodes_list.append(node.id)
        recursive(edges=edges, src_node=node.id, nodes_list=nodes_list)

    ordered_nodes = []
    for id in nodes_list:
        for n in nodes:
            if n.id == id:
                ordered_nodes.append(n)
                break

    return ordered_nodes

def recursive(edges, src_node, nodes_list):
    """
    Recursively traverses a directed graph represented by a list of edges.

    Args:
        edges (List[Edge]): A list of Edge objects representing the edges of the graph.
        src_node (Node): The starting node for the traversal.
        nodes_list (List[Node]): A list to store the visited nodes.

    Returns:
        None

    The function performs a depth-first search on the graph starting from the given source node.
    It traverses the graph by following the edges and appending the target node to the `nodes_list`.
    If the target node is a supernode, the function recursively calls itself with the updated
    `edges` and `src_node` to continue the traversal.

    Note:
    - The function assumes that the `edges` list contains valid `Edge` objects.
    - The function modifies the `nodes_list` in-place.
    """

    print(nodes_list)

    # exit conditions
    if src_node is None or len(edges) == 0:
        return
    
    # recursive call
    for edge in edges:
        if edge.source == src_node:

            res = None

            if 'so' in edge.target:
                super_node_id = edge.target.split('o')[0]
                for e in edges:
                    if e.source == super_node_id:
                        # add special case in which two supernodes are connected
                        if 's' in e.target:
                            res = recursive_find_next_node(edges, e)
                        else:
                            res = e.target
                        break

            elif 's' in edge.target:
                super_node_id = edge.target
                for e in edges:
                    if e.source == super_node_id + 'i':
                        if 's' in e.target:
                            res = recursive_find_next_node(edges, e)
                        else:
                            res = e.target
                        break

            else:
                res = edge.target
    
            nodes_list.append(res)
            cpy_edges = [e for e in edges if e is not None and e.source != src_node and e.target != edge.target]
            recursive(cpy_edges, res, nodes_list)

def recursive_find_next_node(edges, src_node):
    for ee in edges:
        if ee.source == src_node.target + 'i':
            if 's' in ee.target:
                res = recursive_find_next_node(edges, ee)
            else:
                res = ee.target
                return res

def create_model(nodes, edges, input_shape):

    msg = ""

    # list of list of nodes
    nodes_list = order_nodes(nodes, edges)

    # transform string into modules
    modules = []
    current_shape = input_shape

    def filter_params(params, fn):
        expected_params = function_params.get(fn, {})

        converted_params = {}
        for k, v in params.items():
            if k in expected_params and v != 'None':
                param_type = expected_params[k]
                try:
                    if param_type is bool:
                        converted_params[k] = v in ["True", "true", True]
                    elif param_type is int:
                        converted_params[k] = int(v)
                    elif param_type is float:
                        converted_params[k] = float(v)
                    elif param_type is tuple:
                        converted_params[k] = tuple(map(int, v.strip('()').split(',')))
                    else:
                        converted_params[k] = v
                except (ValueError, TypeError):
                    print(f"Error converting parameter {k}: {v}")
                    # converted_params[k] = v

        return converted_params

    for node in nodes_list:
        try:
            fn_name = node.function.split(".")[-1]
            fn =  valid_pytorch_functions.get(fn_name)

            if fn is not None:
                if hasattr(torch.nn, fn_name):
                    module_class = getattr(torch.nn, fn_name)
                    params = get_params_values(node)

                    if get_layer_type(node) == "2dconv":
                        conv = getattr(torch.nn, "Conv2d")
                        in_channels = current_shape
                        out_channels = int(params.get('output_tensor'))
                        kernel_size = int(params.get('kernel_size'))
                        modules.append(conv(in_channels, out_channels, kernel_size))
                        current_shape = out_channels
                        norm_params = filter_params(params, fn)
                        modules.append(module_class(**norm_params))

                    elif get_layer_type(node) == "fc":
                        lin = getattr(torch.nn, "Linear")
                        input_dim = current_shape
                        input_size = int(params.get('input_tensor'))
                        output_size = int(params.get('output_tensor'))
                        modules.append(lin(input_dim, input_size))
                        current_shape = output_size
                        norm_params = filter_params(params, fn)
                        modules.append(module_class(**norm_params))
                        modules.append(lin(input_size, output_size))

                    else:
                        general_params = filter_params(params, fn)
                        modules.append(module_class(**general_params))

                else:
                    print("module not found ", fn)
            else:
                print("function not allowed for node ", node)

        except Exception as e:
            print("ERROR IN LAYER --> ", node.function)
            msg += f" {e} "
            print(e)

    for i, m in enumerate(modules):
        if isinstance(m, torch.nn.Linear):
            modules.insert(0, torch.nn.Flatten())
            break
        else:
            break

    # create the corresponding model
    # class CustomModel(nn.Module):
    #     def __init__(self, model):
    #         super(CustomModel, self).__init__()
    #         self.model = model

    #     def forward(self, x):
    #         for layer in self.model:
    #             if isinstance(layer, (torch.nn.RNN, torch.nn.LSTM, torch.nn.GRU)):
    #                 x, _ = layer(x)
    #                 try:
    #                     x = x[:, -1, :]
    #                 except:
    #                     x = x[-1]
    #             else:
    #                 x = layer(x)
    #         return x

    model = nn.Sequential(*modules)
    # model = CustomModel(model)
    
    print("Model created --> ",model)
    
    return model, msg

def get_layer_type(node):
    for param in node.parameters:
        if param.key == "layer_type":
            return param.value
    return None

def get_params_values(node):
    params = {}
    for param in node.parameters:
        params[param.key] = param.value
    return params

############################################################################################################
#                                                  EXPORT                                                  #
############################################################################################################
def export_to_onnx(nodes, edges, file_name, uid):
    """
    Export a PyTorch model to an ONNX file.

    Args:
        nodes (list): A list of nodes representing the layers of the model.
        edges (list): A list of edges representing the connections between layers.
        file_name (str): The name of the ONNX file to export the model to.
        uid (str): A unique identifier for the request.

    Returns:
        bool: True if the model was successfully exported to an ONNX file, False otherwise.

    Raises:
        Exception: If there was an error while converting the model to an ONNX file.

    You can visualize an ONNX file using: Netron (https://netron.app/)

    """

    model, msg = create_model(nodes, edges, 1024)

    try:
        onnx_file = torch.onnx.export(model, torch.randn(1, 1, 32, 32), os.path.join(f'converted/{uid}',file_name), verbose=True)
        return True
    except Exception as e:
        try:
            input_tensor = torch.randn(1, 100, 32)
            onnx_file = torch.onnx.export(model, input_tensor, os.path.join(f'converted/{uid}',file_name), verbose=True)
            return True
        except Exception as e:
            print(e)
            raise Exception("Error while converting the model to onnx")

def export_to_pth(nodes, edges, file_name, uid):
    """
    Export a PyTorch model to a .pth file.

    Args:
        nodes (list): A list of nodes representing the layers of the model.
        edges (list): A list of edges representing the connections between layers.
        file_name (str): The name of the .pth file to export the model to.
        uid (str): A unique identifier for the request.

    Returns:
        bool: True if the model was successfully exported to a .pth file, False otherwise.

    Raises:
        Exception: If there was an error while converting the model to a .pth file.

    """

    model, msg = create_model(nodes, edges, 1024)

    try:
        torch.save(model.state_dict(), os.path.join(f'converted/{uid}',file_name))
        return True
    except Exception as e:
        print(e)
        raise Exception("Error while converting the model to pth")
