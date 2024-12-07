"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route("/user/<string:username>", methods=["POST"])
def create_user(username=None):
     
    if not username or len(username) < 3: 
        return jsonify({"error": "El nombre de usuario debe tener al menos 3 caracteres"}), 400 
    
    user_1 = User.query.filter_by(name=username).one_or_none() 
    if user_1 is not None: 
        return jsonify({"error": "El usuario ya existe"}), 400 
    user = User(name=username) 
    db.session.add(user) 
    
    try: 
        db.session.commit() 
        return jsonify({ "id": user.id, "name": user.name, }), 201 
    except Exception as err: 
        db.session.rollback() 
        return jsonify({"error": str(err)}), 500


#@api.route('/hello', methods=['POST', 'GET'])


"""

from flask import Flask, jsonify, request, abort
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False, unique=True)
    email = db.Column(db.String(80), nullable=False, unique=True)
    password = db.Column(db.String(180), nullable=False)
    salt = db.Column(db.String(180), nullable=False)
    avatar = db.Column(db.String(180))
    created_at = db.Column(db.DateTime(timezone=True), server_default=db.func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=db.func.now(), default=db.func.now())

    @classmethod
    def create_user(cls, username, email, password, salt, avatar=None):
        user = cls.query.filter_by(name=username).one_or_none()
        if user is not None:
            raise ValueError("El usuario ya existe")
        
        new_user = cls(name=username, email=email, password=password, salt=salt, avatar=avatar)
        db.session.add(new_user)
        db.session.commit()
        return new_user

@app.route("/user", methods=["POST"])
def create_user_endpoint():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    salt = data.get('salt')
    avatar = data.get('avatar')

    if not username or not email or not password or not salt:
        return jsonify({"error": "Faltan datos obligatorios"}), 400

    try:
        new_user = User.create_user(username, email, password, salt, avatar)
        return jsonify({
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "avatar": new_user.avatar,
            "created_at": new_user.created_at,
            "updated_at": new_user.updated_at
        }), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)

"""