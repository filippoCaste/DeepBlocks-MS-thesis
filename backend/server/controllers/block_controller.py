from flask import request, jsonify
from services.block_service import train_network as train_network_service
import pandas as pd

def post_all_blocks():
    data = request.get_json()
    # print(data)
    params = data.get('params')
    blocks = data.get('blocks')
    edges = data.get('edges')

    # change blocks so that it has: id, function
    transformed_blocks = []
    for block in blocks:
        transformed_blocks.append({
            'id': block.get('id'),
            'function': block.get('fn'),
            'parameters': [{'key': param.get('name'), 'value': param.get('value')} for param in block.get('parameters', [])]
        })

    # chande edges so that it has: source, target
    transformed_edges = []
    for edge in edges:
        transformed_edges.append({
            'source': edge.get('source'), 
            'target': edge.get('target')  
        })

    # change params so that it has: key, value
    transformed_params = []
    for param in params:
        transformed_params.append({
            'key': param.get('key'),
            'value': param.get('value')
        })

    response = train_network_service(transformed_blocks, transformed_edges, transformed_params)

    return response

def post_input_files():
    files = request.files.getlist('files')
    for file in files:
        filename = file.filename
        if filename.endswith('.csv'):
            # Elabora il file CSV
            df = pd.read_csv(file)
            # Fai qualcosa con il DataFrame
            print(df)
        elif filename.endswith('.xlsx'):
            # Elabora il file Excel
            df = pd.read_excel(file)
            # Fai qualcosa con il DataFrame
            print(df)
        elif filename.endswith('.txt'):
            # Elabora il file di testo
            content = file.read().decode('utf-8')
            # Fai qualcosa con il contenuto del file
            print(content)
        else:
            # Gestisci altri formati di file se necessario
            pass

    return jsonify({'message': 'Files uploaded successfully'})
