# controllers/block_controller.py

from flask import request, jsonify
from services.block_service import train_network as train_network_service
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

    # change blocks so that it has: id, function (according to proto file)
    transformed_blocks = []
    for block in blocks:
        transformed_blocks.append({
            'id': block.get('id'),
            'function': block.get('fn'),
            'parameters': [{'key': param.get('name'), 'value': str(param.get('value'))} for param in block.get('parameters', [])]
        })

    # chande edges so that it has: source, target (according to proto file)
    transformed_edges = []
    for edge in edges:
        transformed_edges.append({
            'source': edge.get('source'), 
            'target': edge.get('target')  
        })

    # change params so that it has: key, value (according to proto file)
    transformed_params = []
    for param in params:
        transformed_params.append({
            'key': param.get('key'),
            'value': str(param.get('value'))
        })

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

    return jsonify({'message': 'Files uploaded successfully'})
