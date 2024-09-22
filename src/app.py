import os
from flask import Flask, request, jsonify
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from api.utils import APIException, generate_sitemap
from api.models import db, User
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_cors import CORS

app = Flask(__name__)
app.url_map.strict_slashes = False

# Add this line to enable CORS for all routes
CORS(app, resources={r"/*": {"origins": "*"}})

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:////tmp/test.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["JWT_SECRET_KEY"] = os.getenv('FLASK_APP_KEY', 'super-secret-key')

db.init_app(app)
Migrate(app, db)
jwt = JWTManager(app)

# New Test Route
@app.route('/api/test', methods=['GET'])
def test_route():
    return jsonify({"message": "hello there 123"}), 200

@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Hello, this is your Flask backend!"}), 200

# Error handling
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# User Signup Route
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')

    if User.query.filter_by(email=email).first() is not None:
        return jsonify({"message": "Email already registered"}), 400
    if User.query.filter_by(username=username).first() is not None:
        return jsonify({"message": "Username already taken"}), 400

    user = User(email=email, username=username)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User created successfully"}), 201

# User Login Route => move all routes to routes.py
@app.route('/api/token', methods=['POST'])
def create_token():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if user is None or not user.check_password(password):
        return jsonify({"message": "Invalid credentials"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({"token": access_token}), 200




# secured login
@app.route('/api/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    return jsonify({"id": user.id, "username": user.username}), 200

# Blueprints
app.register_blueprint(api, url_prefix='/api')
setup_admin(app)
setup_commands(app)

# Sitemap
@app.route('/')
def sitemap():
    return generate_sitemap(app)


if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
