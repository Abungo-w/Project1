from flask import Flask, request, jsonify
from pymongo import MongoClient
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

mongo_client = MongoClient('mongodb://mongo-db:27017/')
mongo_db = mongo_client['analyticsdb']
mongo_col = mongo_db['results']

AUTH_URL = "http://auth-service:4000/login"

@app.post("/results")
def get_results():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    
    # Authenticate
    auth_res = requests.post(AUTH_URL, json={"username": username, "password": password})
    if auth_res.status_code != 200:
        return jsonify({"success": False, "message": "Unauthorized"}), 401

    # Get analytics from MongoDB
    stats = mongo_col.find_one({})
    return jsonify(stats)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

