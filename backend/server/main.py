from flask import Flask
from flask_cors import CORS

from routes.block_routes import block_routes

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})


app.register_blueprint(block_routes)

if __name__ == "__main__":
    app.run()
