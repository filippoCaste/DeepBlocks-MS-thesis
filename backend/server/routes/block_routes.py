# routes/block_routes.py

from flask import Blueprint, jsonify

from controllers.block_controller import post_all_blocks, post_input_files

block_routes = Blueprint('block_routes', __name__)

@block_routes.route('/api/blocks', methods=['POST'])
def api_post_all_blocks():
    response = post_all_blocks()
    print(response)
    if response.status == '200':
        return jsonify({'status': 'OK'})
    else:
        return jsonify({'status': 'KO'})

@block_routes.route('/api/blocks/input', methods=['POST'])
def api_post_input_files():
    response = post_input_files()
    print(response)
    return response
