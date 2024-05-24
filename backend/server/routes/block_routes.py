# routes/block_routes.py

from flask import Blueprint, jsonify

from controllers.block_controller import post_all_blocks

block_routes = Blueprint('block_routes', __name__)

@block_routes.route('/api/blocks', methods=['POST'])
def api_post_all_blocks():
    response = post_all_blocks()
    print(response)
    if response.status == '200':
        return jsonify({'status': 'OK'})
    else:
        return jsonify({'status': 'KO'})
