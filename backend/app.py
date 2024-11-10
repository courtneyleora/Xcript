from flask import Flask, request, jsonify
# Import UserDatabase from UserDB
from UserDB import UserDatabase
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
# Initialize the database connection (you can adjust these parameters as needed)
db = UserDatabase('localhost', 'user', 'postgres', 'cocopop', 10203)

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    user = db.validate_user(email, password)
    
    if user:
        return jsonify({"message": "Login successful", "username": user['username']}), 200
    else:
        return jsonify({"message": "Invalid email or password"}), 401
    
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    # Check if user already exists
    user = db.validate_user(email, password)
    if user:
        return jsonify({"message": "User already exists"}), 400
    
    # Create a new user
    new_user_id = db.generate_new_user_id()  # Add a method in UserDatabase to generate a unique ID
    db.create_user(new_user_id, password, email)
    return jsonify({"message": "User created successfully"}), 201

if __name__ == '__main__':
    app.run(debug=True)
