# routes/session_routes.py

from flask import Blueprint
from controllers.session_controller import get_session, delete_session

session_routes = Blueprint('session_routes', __name__)


@session_routes.route('/api/session', methods=['GET'])
def api_get_session():
    return get_session()

@session_routes.route('/api/session', methods=['DELETE'])
def api_delete_session():
    return delete_session()
