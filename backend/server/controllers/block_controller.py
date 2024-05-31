# controllers/block_controller.py

from flask import request, jsonify
from services.block_service import train_network as train_network_service, export_network as export_network_service
from USERS_SET import USERS_SET
import os

def post_all_blocks():
    data = request.get_json()
    # print(data)
    params = data.get('network').get('params')
    blocks = data.get('network').get('blocks')
    edges = data.get('network').get('edges')
    session_id = int(data.get('sessionId'))

    global USERS_SET
    if session_id not in USERS_SET:
        return jsonify({'message': 'No session found'}), 403

    transformed_blocks = transform_blocks(blocks)
    transformed_edges = transform_edges(edges)
    transformed_params = transform_params(params)

    response = train_network_service(transformed_blocks, transformed_edges, transformed_params, session_id)

    return response

def post_input_files():
    session_id = int(request.form.get('sessionId'))
    
    global USERS_SET
    if session_id not in USERS_SET:
        return jsonify({'message': 'No session found'}), 403
        
    files = request.files.getlist('files')
    for file in files:
        filename = os.path.join('uploads/' + str(session_id), file.filename)
        file.save(filename)

    return jsonify({'message': 'Files uploaded successfully'}), 201

def export_blocks():
    data = request.get_json()
    params = data.get('network').get('params')
    blocks = data.get('network').get('blocks')
    edges = data.get('network').get('edges')
    session_id = data.get('sessionId')

    app_name = data.get('appName')
    file_type = data.get('type')
    file_name = app_name.replace(" ", "-") + '.' + file_type
    transformed_blocks = transform_blocks(blocks)
    transformed_edges = transform_edges(edges)
    transformed_params = transform_params(params)

    ret_file = export_network_service(transformed_blocks, transformed_edges, transformed_params, file_name, session_id)
    
    return ret_file


#######################################################################################
#                                      UTILITIES
#######################################################################################
def transform_blocks(blocks):
    """
    Transforms a list of blocks into a list of dictionaries, where each dictionary represents a block and has the following keys:
    - 'id': the id of the block (according to the proto file)
    - 'function': the function of the block (according to the proto file)
    - 'parameters': a list of dictionaries, where each dictionary represents a parameter and has the following keys:
        - 'key': the name of the parameter (according to the proto file)
        - 'value': the value of the parameter as a string
    
    :param blocks: A list of dictionaries, where each dictionary represents a block and has the following keys:
        - 'type': the type of the block
        - 'id': the id of the block
        - 'fn': the function of the block
        - 'children': (optional) a list of child blocks (only for superBlockNode type)
        - 'parameters': (optional) a list of dictionaries, where each dictionary represents a parameter and has the following keys:
            - 'name': the name of the parameter
            - 'value': the value of the parameter
    :return: A list of dictionaries, where each dictionary represents a block and has the following keys:
        - 'id': the id of the block (according to the proto file)
        - 'function': the function of the block (according to the proto file)
        - 'parameters': a list of dictionaries, where each dictionary represents a parameter and has the following keys:
            - 'key': the name of the parameter (according to the proto file)
            - 'value': the value of the parameter as a string
    """

    # TLDR: change blocks so that it has: id, function (according to proto file)
    transformed_blocks = []
    for block in blocks:
        if block.get('type') == 'superBlockNode':
            transformed_blocks.append({
                'id': block.get('id'),
                'function': block.get('fn'),
                'parameters': [{'key': 'childId', 'value': child} for child in block.get('children', [])]
            })
        else:
            transformed_blocks.append({
                'id': block.get('id'),
                'function': block.get('fn'),
                'parameters': [{'key': param.get('name'), 'value': str(param.get('value'))} for param in block.get('parameters', [])]
            })

    return transformed_blocks

def transform_edges(edges):
    """
    Transforms a list of edges into a list of dictionaries, where each dictionary represents an edge and has the following keys:
    - 'source': the source node of the edge (according to the proto file)
    - 'target': the target node of the edge (according to the proto file)
    
    :param edges: A list of dictionaries, where each dictionary represents an edge and has the following keys:
        - 'source': the source node of the edge
        - 'target': the target node of the edge
    :return: A list of dictionaries, where each dictionary represents an edge and has the following keys:
        - 'source': the source node of the edge (according to the proto file)
        - 'target': the target node of the edge (according to the proto file)
    """
    # TLDR: chande edges so that it has: source, target (according to proto file)
    transformed_edges = []
    for edge in edges:
        transformed_edges.append({
            'source': edge.get('source'), 
            'target': edge.get('target')  
        })

    return transformed_edges

def transform_params(params):
    """
    Transforms a list of parameters into a list of dictionaries, where each dictionary represents a parameter and has the following keys:
    - 'key': the name of the parameter (according to the proto file)
    - 'value': the value of the parameter as a string
    
    :param params: A list of dictionaries, where each dictionary represents a parameter and has the following keys:
        - 'key': the name of the parameter
        - 'value': the value of the parameter
    :return: A list of dictionaries, where each dictionary represents a parameter and has the following keys:
        - 'key': the name of the parameter (according to the proto file)
        - 'value': the value of the parameter as a string
    """
    # TLDR: change params so that it has: key, value (according to proto file)
    transformed_params = []
    for param in params:
        transformed_params.append({
            'key': param.get('key'),
            'value': str(param.get('value'))
        })

    return transformed_params
