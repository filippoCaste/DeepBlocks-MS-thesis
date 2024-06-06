# network_generation/model.py

import numpy as np
import torch, os, packaging
import torch.nn as nn
import torch.optim as optim
import torch.nn.functional as F
from datasets import load_dataset, Audio, Image
from transformers import AutoModelForSequenceClassification, AutoTokenizer, BertTokenizer, ViTForImageClassification, ViTImageProcessor
from torch.utils.data import DataLoader, default_collate
import evaluate
from torchvision import transforms
from PIL import Image

from network_generation.pytorch_functions import valid_pytorch_functions

############################################################################################################
#                                                 TRAINING                                                 #
############################################################################################################
def resize_images(ds_batch):
    ds_batch["pixel_values"] = [image.convert("RGB").resize((100,100)) for image in ds_batch["image"]]
    return ds_batch

def train_model(nodes, edges, params, user_id, uploads):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    for node in nodes:
        if(node.parameters[0].key == 'input_dataset'):
            ds_info = node.parameters[0].value
            # ds = ds_info.split(",")[0]
            # ds_specific = ds_info.split(",")[1]
            break

    ds_type = "text"

    # print("hello",ds, ds_info, ds_specific)

    # if ds is None:
    #     raise ValueError("Input dataset not specified in nodes")

    model = create_model(nodes, edges)

    n_epochs, lr, batch_size, loss_fn, optimizer = set_parameters(params, model.parameters())
    # print(n_epochs, lr, batch_size, loss_fn, optimizer)

    # if ds_specific is not None:
    #     dataset = load_dataset(ds, ds_specific, split='test')
    # else: 
    #     dataset = load_dataset(ds, split='test')
    dataset = load_dataset(ds_info, split='test')
    print(dataset)

    if ds_type == "text":
        auto_model = AutoModelForSequenceClassification.from_pretrained("bert-base-uncased")
        auto_tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
    elif ds_type == "image":
        dataset = dataset.map(resize_images, remove_columns=["image"], batch_size=batch_size, batched=True)
        auto_model = ViTForImageClassification.from_pretrained("google/vit-base-patch16-224")
        feature_extractor = ViTImageProcessor.from_pretrained("google/vit-base-patch16-224")

    # print(auto_model.config, feature_extractor.config)
    auto_model.classifier = model
    auto_model.to(device)

    data_loader = DataLoader(dataset, batch_size=batch_size, shuffle=True, collate_fn=collate_fn)

    # accuracy = evaluate.load("accuracy")

    for epoch in range(n_epochs):
        auto_model.train()
        total_loss = 0
        for batch in data_loader:
            # print(f"Batch type: {type(batch)}")
            print("batch in execution")           
            
            
            labels_batch = batch["label"]

            if ds_type == 'text':
                text_batch = batch["text"]
                encoded_input = auto_tokenizer(text_batch, padding=True, truncation=True, return_tensors='pt')
                input_ids = encoded_input['input_ids'].to(device)
                attention_mask = encoded_input['attention_mask'].to(device)
            elif ds_type == 'image':
                image_batch = batch["pixel_values"]
                inputs = feature_extractor(images=image_batch, return_tensors="pt")
                input_ids = inputs['pixel_values'].to(device)
                # attention_mask = inputs['pixel_values'].to(device)

            #######################################################################################################
            optimizer.zero_grad()

            # FORWARD PASS
            if ds_type == 'text':
                outputs = auto_model(input_ids, attention_mask)
            elif ds_type == 'image':
                outputs = auto_model(input_ids)
            loss = loss_fn(outputs.logits, labels_batch.to(device))
            total_loss += loss.item()

            # BACKWARD PASS
            loss.backward()
            optimizer.step()

        print(f"Epoch {epoch+1}, Loss: {total_loss / len(data_loader)}")
        evaluate_model(auto_model, data_loader, device, loss_fn, metric)

    # Final evaluation
    print("Final Evaluation")
    # evaluate_model(auto_model, data_loader, device, loss_fn, metric)

def collate_fn(batch):
    resize_transform = transforms.Compose([
        # transforms.Resize((256, 256)),
        transforms.ToTensor()
    ])

    for sample in batch:
        if 'pixel_values' in sample:
            sample['pixel_values'] = resize_transform(sample['pixel_values'])
    return default_collate(batch)

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

        elif param.key == "optimizer":
            # can be Adam or SGD
            if param.value == "Adam":
                optimizer = optim.Adam(model_parameters, lr=lr)
            elif param.value == "SGD":
                optimizer = optim.SGD(model_parameters, lr=lr)

    return n_epochs, lr, batch_size, loss, optimizer

def order_nodes(nodes, edges):
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
                print(super_node_id)
                for e in edges:
                    if e.source == super_node_id:
                        res = e.target
                        break

            elif 's' in edge.target:
                # super_node_id, = edge.target.split('s')
                super_node_id = edge.target
                for e in edges:
                    if e.source == super_node_id + 'i':
                        res = e.target
                        # nodes_list.append(res)
                        break

            else:
                res = edge.target
                # nodes_list.append(edge.target)
    
            nodes_list.append(res)
            cpy_edges = [e for e in edges if e is not None and e.source != src_node and e.target != edge.target]
            recursive(cpy_edges, res, nodes_list)

def create_model(nodes, edges):

    # list of list of nodes
    nodes_list = order_nodes(nodes, edges)

    print(nodes_list)

    # transform string into modules
    modules = []
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
                        modules.append(conv(int(params.get('input_tensor')), int(params.get('output_tensor')), int(params.get('kernel_size'))))
                    elif get_layer_type(node) == "fc":
                        lin = getattr(torch.nn, "Linear")
                        modules.append(lin(int(params.get('input_tensor')), int(params.get('output_tensor'))))
                    
                    modules.append(module_class())

                else:
                    print("module not found ", fn)

        except Exception as e:
            print("ERROR IN LAYER --> ", node.function)
            print(e)

    print(modules)
    # create the corresponding model
    model = nn.Sequential(*modules)
    
    print("Model created --> ",model)
    
    return model

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
def export_to_onnx(nodes, edges, params, file_name, uid):

    model = create_model(nodes, edges, params)

    try:
        onnx_file = torch.onnx.export(model, torch.randn(1, 1, 32, 32), os.path.join(f'converted/{uid}',file_name), verbose=True)
        return True
    except Exception as e:
        raise Exception("Error while converting the model to onnx")

def export_to_pth(nodes, edges, params, file_name, uid):

    model = create_model(nodes, edges, params)

    try:
        torch.save(model.state_dict(), os.path.join(f'converted/{uid}',file_name))
        return True
    except Exception as e:
        print(e)
        raise Exception("Error while converting the model to pth")
