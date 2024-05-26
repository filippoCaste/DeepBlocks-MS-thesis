import os
from flask import Flask
from flask_cors import CORS

from routes.block_routes import block_routes
from routes.session_routes import session_routes

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

UPLOAD_DIRECTORY = 'uploads'
if not os.path.exists(UPLOAD_DIRECTORY):
    os.makedirs(UPLOAD_DIRECTORY)

app.register_blueprint(block_routes)
app.register_blueprint(session_routes)

# delete upload directory on exit
import atexit, shutil
atexit.register(lambda: shutil.rmtree(f"./{UPLOAD_DIRECTORY}"))
#############################################################

if __name__ == "__main__":
    app.run(debug=True)
