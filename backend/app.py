from flask import Flask, request, jsonify
from flask_cors import CORS
from UserDB import UserDatabase

app = Flask(__name__)
CORS(app)

# Database connection
db = UserDatabase('localhost', 'Xcript', 'postgres', 'cocopop', 10203)

@app.route('/login', methods=['POST'])
def login():
    email = request.json.get('email')
    password = request.json.get('password')

    user = db.validate_user(email, password)
    if user:
        return jsonify({
            "message": "Login successful!",
            "redirect": "/user_stats",
            "user": {
                "user_id": user['id'],
                "username": user['username'],
                "email": user['email']
            }
        }), 200
    else:
        return jsonify({"message": "Invalid credentials!"}), 401


@app.route('/signup', methods=['POST'])
def signup():
    username = request.json.get('username')
    password = request.json.get('password')
    email = request.json.get('email')

    # Check if user already exists
    user = db.validate_user(email, password)
    if user:
        return jsonify({"message": "User already exists!"}), 400

    # Create new user
    user_id = db.create_user(username, password, email)
    if user_id:
        return jsonify({
            "message": "Signup successful!",
            "user_id": user_id
        }), 201
    else:
        return jsonify({"message": "Signup failed!"}), 500

@app.route('/user_stats', methods=['POST'])
def user_stats():
    user_id = request.json.get('user_id')
    name = request.json.get('name')
    age = request.json.get('age')
    sex = request.json.get('sex')
    height = request.json.get('height')
    weight = request.json.get('weight')
    illnesses = request.json.get('illnesses')
    background = request.json.get('background')

    try:
        db.add_user_stats(user_id, name, age, sex, height, weight, illnesses, background)
        return jsonify({"message": "User stats added successfully!"}), 201
    except Exception as e:
        return jsonify({"message": f"Error: {e}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
