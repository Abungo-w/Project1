import pymysql
from pymongo import MongoClient
import time

def connect_with_retry(max_retries=5, delay=2):
    """Connect to MySQL with retry logic"""
    for attempt in range(max_retries):
        try:
            conn = pymysql.connect(
                host='mysql-db',
                user='user',
                password='password',
                database='projectdb'
            )
            print("Connected to MySQL successfully")
            return conn
        except pymysql.err.OperationalError as e:
            if attempt < max_retries - 1:
                print(f"Connection attempt {attempt + 1} failed. Retrying in {delay}s...")
                time.sleep(delay)
            else:
                raise e

# MySQL connection with retry
conn = connect_with_retry()
cursor = conn.cursor()

# MongoDB connection
mongo_client = MongoClient('mongodb://mongo-db:27017/')
mongo_db = mongo_client['analyticsdb']
mongo_col = mongo_db['results']

# Fetch data from MySQL
cursor.execute("SELECT value FROM data_table")
values = [row[0] for row in cursor.fetchall()]

if values:
    stats = {
        "max": max(values),
        "min": min(values),
        "avg": sum(values)/len(values)
    }
    mongo_col.replace_one({}, stats, upsert=True)
    print("Analytics updated:", stats)
else:
    print("No data to analyze.")

