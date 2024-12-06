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
        user_id = user['id']
        if db.user_stats_exist(user_id):
            redirect_url = "/landing"
        else:
            redirect_url = "/user-stats"
        return jsonify({
            "message": "Login successful!",
            "redirect": redirect_url,
            "user": {
                "user_id": user_id,
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
        return jsonify({"message": "Failed to create user!"}), 500


@app.route('/user_stats', methods=['POST'])
def user_stats():
    user_id = request.json.get('user_id')
    height = request.json.get('height')
    weight = request.json.get('weight')
    age = request.json.get('age')
    illnesses = request.json.get('illnesses')
    background = request.json.get('background')
    sex = request.json.get('sex')

    try:
        db.add_user_stats(user_id, height, weight, age, illnesses, background, sex)
        return jsonify({"message": "User stats added successfully!"}), 201
    except Exception as e:
        return jsonify({"message": f"Error: {e}"}), 500


@app.route('/reminders', methods=['POST'])
def add_reminder():
    data = request.get_json()
    prescription_id = data.get('prescription_id')
    reminder_time = data.get('reminder_time')

    try:
        db.add_reminder(prescription_id, reminder_time)
        return jsonify({"message": "Reminder added successfully!"}), 201
    except Exception as e:
        return jsonify({"message": f"Error: {e}"}), 500


@app.route('/medication-history/<int:user_id>', methods=['GET'])
def get_medication_history(user_id):
    try:
        history = db.get_medication_history(user_id)
        return jsonify(history), 200
    except Exception as e:
        return jsonify({"message": f"Error: {e}"}), 500


@app.route('/medications', methods=['GET'])
def get_medications():
    try:
        medications = db.get_all_medications()
        return jsonify(medications), 200
    except Exception as e:
        return jsonify({"message": f"Error: {e}"}), 500


if __name__ == '__main__':
    app.run(debug=True)