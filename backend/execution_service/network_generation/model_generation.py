# network_generation/model.py

import numpy as np
import torch, os, packaging
import torch.nn as nn
import torch.optim as optim
from datasets import load_dataset, Audio, Image

from network_generation.pytorch_functions import valid_pytorch_functions

############################################################################################################
#                                                 TRAINING                                                 #
############################################################################################################

def train_model(nodes, edges, params, user_id, file_names):
    model = create_model(nodes, edges)

    n_epochs, lr, batch_size, loss, optimizer = set_parameters(params, model.parameters())

    print(n_epochs, lr, batch_size, loss, optimizer)

    # dataset = np.loadtxt(os.path.join(f'./uploads/{user_id}/{file_names[0]}'))
    dataset = np.genfromtxt(os.path.join(f'./uploads/{user_id}/{file_names[0]}'), delimiter=None)
    num_columns = dataset.shape[1]

    X = dataset[:,0:num_columns-1] 
    y = dataset[:,num_columns-1]

    X = torch.tensor(X, dtype=torch.float32)
    y = torch.tensor(y, dtype=torch.float32).reshape(-1,1)

    for epoch in range(n_epochs):
        for i in range(0, len(X), batch_size):
            Xbatch = X[i:i+batch_size]
            ybatch = y[i:i+batch_size]

            optimizer.zero_grad()
            y_pred = model(Xbatch)
            ybatch = ybatch.expand_as(y_pred)

            loss = loss_fn(y_pred, ybatch)
            loss.backward()
            optimizer.step()

        print(f'Finished epoch {epoch}, latest loss {loss}')
    
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
            if param.key == "input_file":
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
                        modules.append(conv(params.get('input_tensor'), params.get('output_tensor'), params.get('kernel_size')))
                    elif get_layer_type(node) == "fc":
                        lin = getattr(torch.nn, "Linear")
                        modules.append(lin(params.get('input_tensor'), params.get('output_tensor')))
                    modules.append(module_class())
                else:
                    print("module not found ", fn)

        except Exception as e:
            print("Not found ", node.function)
            print(e)

    # create the corresponding model
    model = nn.Sequential(*modules)

    return model

def get_layer_type(node):
    for param in node.parameters:
        if param.key == "layer_type":
            return param.value
    return None

def get_params_values(node):
    params = {}
    for param in node.parameters:
        params[param.get('key')] = param.get('value')
    return params

############################################################################################################
#                                                   EXPORT                                                 #
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
