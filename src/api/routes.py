"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User,Todos
from api.utils import generate_sitemap, APIException, check_password, hash_password
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from base64 import b64encode
import os
import cloudinary.uploader as uploader


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)



@api.route('/register', methods=['POST']) 
def add_new_user(): 
    try: 
        # body = request.json
        data_files = request.files
        data_form = request.form

        # Validar campos requeridos 
        # required_fields = {"email", "name", "password"} 
        # missing_fields = required_fields - body.keys() 
        
        # # if missing_fields: 
        # #     return jsonify(f"Missing fields: {', '.join(missing_fields)}"), 400 
        
        email = data_form["email"] 
        name = data_form["name"] 
        password = data_form["password"]
        avatar = data_files["avatar"]

        # # Verificar si el usuario ya existe 
        # # user_exist = User.query.filter_by(email=email).one_or_none() 

        # # if user_exist: 
        # #     return jsonify("User exists"), 400 
        
        avatar = uploader.upload(avatar)
        # Crear nuevo usuario 
        salt = b64encode(os.urandom(32)).decode("utf-8")
        hashed_password = hash_password(password=password, salt=salt)
         
        new_user = User(
            name=name, 
            email=email, 
            password=hashed_password, 
            salt=salt,
            avatar=avatar["secure_url"]) 
        db.session.add(new_user) 

        # Confirmar cambios en la base de datos 
        db.session.commit() 
        return jsonify("User created successfully"), 201 
    
    except Exception as err: 
        print(err.args)
        return jsonify(f"Error: {err}"), 500
    

@api.route("/login", methods=["POST"])
def get_login(): 
    try:
        body = request.json
        email = body.get("email")
        password = body.get("password")

        if email is None or password is None:
            return jsonify({"message":"You need email and password"}), 400
        else:
            user = User.query.filter_by(email=email).one_or_none()
            if user is None:
                return jsonify({"message":"Bad credentials"}), 400
            else:
                if check_password(user.password, password, user.salt):
                    # le pasasmos un diccionario con lo necesario
                    # OJO no se puede pasar informacion sencible por seguridad
                    token = create_access_token(identity=user.id)
                    return jsonify({"token":token}), 200
                else:
                    return jsonify({"message":"Bad credentials"}), 400
    except Exception as err:
        return jsonify(f"Error: {err}"), 500
    

@api.route("/todos", methods=["POST"])
@jwt_required()
def add_one_todo(username=None):
    try: 
        body = request.json 
        # Validar campos requeridos 
        if body.get("label") is None: 
            return jsonify("debes enviarme un label"), 400 
        
        if body.get("is_done") is None: 
            return jsonify("debes enviarme un is_done"), 400 
        
        # Obtener user_id del token 
        user_id = get_jwt_identity() 
        # Crear nueva tarea 
        todos = Todos( 
            label=body["label"], 
            is_done=body["is_done"], 
            user_id=user_id ) 
        
        db.session.add(todos)  
        try: 
            db.session.commit() 
            return jsonify("tarea guardada exitosamente"), 201 
        except Exception as err: 
            db.session.rollback() 
            return jsonify(err.args), 500 
    except Exception as err: 
        return jsonify(err.args), 500


@api.route("/todos", methods=["GET"])
@jwt_required()
def get_all_todos():
    user_id = get_jwt_identity()

    print(user_id)
    return jsonify(user_id), 200