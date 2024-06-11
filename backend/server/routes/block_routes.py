# routes/block_routes.py

from flask import Blueprint, jsonify, send_file, request
import os
from controllers.block_controller import post_all_blocks, post_input_files, export_blocks

block_routes = Blueprint('block_routes', __name__)

@block_routes.route('/api/blocks', methods=['POST'])
def api_post_all_blocks():
    response = post_all_blocks()
    return response

@block_routes.route('/api/blocks/input', methods=['POST'])
def api_post_input_files():
    response = post_input_files()
    return response

@block_routes.route('/api/blocks/export', methods=['POST'])
def api_export_blocks():
    response = export_blocks()
    session_id = int(request.get_json().get('sessionId'))
    file_path = os.path.join('converted', str(session_id), response.file_name)
    if not os.path.exists(file_path):
        abort(404, description="Resource not found")

    try:
        return send_file(file_path, as_attachment=True, mimetype='application/octet-stream')
    except Exception as e:
        return jsonify(message=str(e)), 500
