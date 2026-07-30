import os
import datetime
from functools import wraps
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import jwt

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin requests from React

app.config['SECRET_KEY'] = 'smart_campus_secret_key_123'

# MongoDB Connection (Local or Atlas)
client = MongoClient("mongodb://localhost:27017/")
db = client['smart_campus_db']

# Collections
users_col = db['teachers']
messages_col = db['office_messages']
requests_col = db['admin_requests']
updates_col = db['campus_updates']

# Token Decorator for Protected Routes
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            token = token.split(" ")[1]  # Remove "Bearer " prefix
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = users_col.find_one({'email': data['email']})
        except Exception:
            return jsonify({'message': 'Token is invalid or expired!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

# Initial Seed: Create default teacher if none exists
@app.before_request
def seed_default_teacher():
    #users_col.drop()
    if users_col.count_documents({}) == 0:

     users_col.insert_many([{
            "user_id": "123",
                "name": "Md. Ashraful Amin",
                "password": "pass123",
                "department": "Computer Science & Engineering"
        },
        {
            "user_id": "456",
                "name": "Md. Fahad Monir",
                "password": "pass456",
                "department": "Computer Science & Engineering"

        },
        {"user_id": "789",
                "name": "Md. Asif Mahmood",
                "password": "pass789",
                "department":  "Computer Science & Engineering" }

   ])

# --- AUTH ROUTES ---
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user_id = data.get('user_id')  # Updated from email
    password = data.get('password')

    user = users_col.find_one({'user_id': user_id, 'password': password})
    if not user:
        return jsonify({'message': 'Invalid User ID or Password!'}), 401

    token = jwt.encode({
        'user_id': user['user_id'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, app.config['SECRET_KEY'], algorithm="HS256")

    return jsonify({
        'token': token,
        'user': {'name': user['name'], 'user_id': user['user_id'], 'department': user['department']}
    })

# --- TEACHER DASHBOARD FEATURES ---

# 1. Communications with University Offices
@app.route('/api/messages', methods=['GET', 'POST'])
@token_required
def handle_messages(current_user):
    if request.method == 'POST':
        data = request.get_json()
        doc = {
            'teacher_email': current_user['email'],
            'office': data.get('office'),  # e.g., 'Registrar', 'IT Support'
            'message': data.get('message'),
            'timestamp': datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M")
        }
        messages_col.insert_one(doc)
        return jsonify({'message': 'Message sent successfully!'}), 201

    messages = list(messages_col.find({'teacher_email': current_user['email']}, {'_id': 0}))
    return jsonify(messages)

# 2. Administrative Requests
@app.route('/api/requests', methods=['GET', 'POST'])
@token_required
def handle_requests(current_user):
    if request.method == 'POST':
        data = request.get_json()
        doc = {
            'teacher_email': current_user['email'],
            'title': data.get('title'),
            'category': data.get('category'),  # e.g., 'Classroom Booking', 'Lab Maintenance'
            'status': 'Pending',
            'submitted_at': datetime.datetime.utcnow().strftime("%Y-%m-%d")
        }
        requests_col.insert_one(doc)
        return jsonify({'message': 'Request submitted!'}), 201

    requests_list = list(requests_col.find({'teacher_email': current_user['email']}, {'_id': 0}))
    return jsonify(requests_list)

# 3. Important Updates (Announcements)
@app.route('/api/updates', methods=['GET'])
@token_required
def get_updates(current_user):
    updates = list(updates_col.find({}, {'_id': 0}))
    # Seed dummy update if empty
    if not updates:
        sample_update = {
            'title': 'New Campus Navigation Map Updated',
            'content': 'Building B navigation coordinates have been updated in the system.',
            'date': datetime.datetime.utcnow().strftime("%Y-%m-%d")
        }
        updates_col.insert_one(sample_update)
        updates = [sample_update]
    return jsonify(updates)

if __name__ == '__main__':
    app.run(debug=True, port=5000)