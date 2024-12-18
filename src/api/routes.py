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

        data = {
            "email":data_form.get("email", None) ,
            "name": data_form.get("name", None), 
            "password": data_form.get("password", None),
            "avatar": data_files.get("avatar", None)

        }

        # Validar campos requeridos 
        required_fields = {"email", "name", "password"} 
        missing_fields = {field for field in required_fields if not data.get(field)} 
        
        if missing_fields: 
            return jsonify(f"Campos requeridos: {', '.join(missing_fields)}"), 400
        
       
        # Verificar si el usuario ya existe 
        user_exist = User.query.filter_by(email=data.get("email")).one_or_none() 

        if user_exist: 
            return jsonify("User exists"), 400 
        
        
        if data["avatar"] is not None:
            avatar = uploader.upload(data.get("avatar"))
            data["avatar"]  = avatar["secure_url"]
        print(data)     
        # Crear nuevo usuario 
        salt = b64encode(os.urandom(32)).decode("utf-8")
        hashed_password = hash_password(password=data.get("password"), salt=salt)
         
        new_user = User(
            name=data.get("name"), 
            email=data.get("email"), 
            password=hashed_password, 
            salt=salt,
            avatar=data["avatar"]) 
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

        required_fields = {"email", "password"}
        missing_fields = {field for field in required_fields if not body.get(field)}

        if missing_fields:
            return jsonify(f"Campos requeridos: {', '.join(missing_fields)}"), 400

        else:
            user = User.query.filter_by(email=email).one_or_none()
            if user is None:
                return jsonify({"message":"Bad credentials"}), 400
            else:
                if check_password(user.password, password, user.salt):
                    # le pasasmos un diccionario con lo necesario
                    token = create_access_token(identity=str(user.id))
                    return jsonify({
                        "token":token,
                        "user":user.serialize()
                        }), 200
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