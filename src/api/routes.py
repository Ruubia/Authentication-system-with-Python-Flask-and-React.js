"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import User, db
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/user', methods=['GET'])
def get_user():
    users = User.query.all()
    resultados = list(map(lambda item: item.serialize(), users))
    
    if not users:
        return jsonify(message="No se han encontrado usuarios"), 404

    return jsonify(resultados), 200


######## LOGIN ########

@api.route("/login", methods=["POST"])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    user = User.query.filter_by(email=email).first()

    if user == None:
        return jsonify({"msg" : "Incorrect email "}), 401
    if user.password != password:
        return jsonify({"msg": "Incorrect password"}), 401

    access_token = create_access_token(identity=email)
    return jsonify(access_token=access_token)

######## SIGNUP ########
@api.route('/signup', methods=['POST'])
def signup():
    body = request.get_json()
    user = User.query.filter_by(email=body["email"]).first()

    if user is None:
        user = User(email=body["email"], password=body["password"], is_active=True)
        db.session.add(user)
        db.session.commit()
        response_body = {
            "msg": "Usuario creado correctamente"
        }
        return jsonify(response_body), 200
    else:
        return jsonify({"msg": "El correo electrónico ya está registrado"}), 400


@api.route('/user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)  # Busca al usuario por su ID

    if not user:
        return jsonify(message="Usuario no encontrado"), 404  # Si no encuentra el usuario, retorna un error 404

    try:
        db.session.delete(user)  # Elimina el usuario de la sesión
        db.session.commit()      # Confirma la eliminación
        return jsonify(message="Usuario eliminado con éxito"), 200  # Respuesta de éxito
    except Exception as e:
        db.session.rollback()  # En caso de error, revertir los cambios
        return jsonify(message="Error al eliminar el usuario", error=str(e)), 500  # Respuesta de error

@api.route("/paginaprivada", methods=["GET"])
@jwt_required()
def protected():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200


if __name__ == "__main__":
    api.run()
