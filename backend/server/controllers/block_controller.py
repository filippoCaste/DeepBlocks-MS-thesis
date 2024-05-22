
from flask import request

def post_all_blocks():
    data = request.get_json()
    print(data)
    parameters = data.get('parameters')
    nodes = data.get('nodes')
    edges = data.get('edges')

    print(nodes, parameters , edges)
    return True
