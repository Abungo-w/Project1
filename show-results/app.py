from flask import Flask, jsonify, request
from pymongo import MongoClient
import requests

app = Flask(__name__)

client = MongoClient("mongodb://mongo-db:27017/")
db = client.analytics_db
collection = db.analytics

@app.route("/results")
def show_results():
    user = request.args.get("user", "test")
    auth_res = requests.post("http://auth-service:4000/auth", json={"user": user})
    if not auth_res.json().get("valid"):
        return "Unauthorized", 401

    results = list(collection.find({}, {"_id": 0}))
    return jsonify(results)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
