"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException, check_password, hash_password
from flask_cors import CORS


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)



@api.route('/register', methods=['POST']) 
def add_new_user(): 
    try: 
        body = request.json

        # Validar campos requeridos 
        required_fields = {"email", "name", "password"} 
        missing_fields = required_fields - body.keys() 
        
        if missing_fields: 
            return jsonify(f"Missing fields: {', '.join(missing_fields)}"), 400 
        
        email = body["email"] 
        name = body["name"] 
        password = body["password"]

        # Verificar si el usuario ya existe 
        user_exist = User.query.filter_by(email=email).one_or_none() 

        if user_exist: 
            return jsonify("User exists"), 400 
        
        # Crear nuevo usuario 
        salt = 1
        hashed_password = hash_password(password=password, salt=salt)
         
        new_user = User(
            name=name, 
            email=email, 
            password=hashed_password, 
            salt=salt) 
        db.session.add(new_user) 

        # Confirmar cambios en la base de datos 
        db.session.commit() 
        return jsonify("User created successfully"), 201 
    
    except Exception as err: 
        return jsonify(f"Error: {err}"), 500
    


@api.route("/login", methods=["POST"])
def get_login():
    try:
        return jsonify("trabajando por usted"), 201
    except Exception as err:
        return jsonify(f"Error: {err}"), 500