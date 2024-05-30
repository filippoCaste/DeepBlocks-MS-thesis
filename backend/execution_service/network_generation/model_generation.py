# network_creation/model.py

import numpy as np
import torch, os, packaging
import torch.nn as nn
import torch.optim as optim

def create_model(nodes, edges, params):

    # list of list of nodes
    nodes_list = order_nodes(nodes, edges)

    print(nodes_list)

    # transfor string into modules
    modules = [eval(node.function) () for node in nodes_list if node.function]

    # for node in nodes_list:
    #     if node.get('function') != 'None':
    #         modules = eval(node.get('function'))
    
    # create the corresponding model
    model = nn.Sequential(*modules)

    return model


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



############################################################################################################
#                                                   EXPORT                                                 #
############################################################################################################
def export_to_onnx(nodes, edges, params, file_name, uid):

    model = create_model(nodes, edges, params)

    try:
        onnx_file = torch.onnx.export(model, torch.randn(1, 1, 32, 32), os.path.join(f'converted/{uid}',file_name), verbose=True)
        return True
    except Exception as e:
        print(e)
        return False

def export_to_pth(nodes, edges, params, file_name, uid):

    model = create_model(nodes, edges, params)

    try:
        torch.save(model.state_dict(), os.path.join(f'converted/{uid}',file_name))
        return True
    except Exception as e:
        print(e)
        return False