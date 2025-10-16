import pymysql
from pymongo import MongoClient

# MySQL connection
conn = pymysql.connect(
    host='mysql-db',
    user='user',
    password='password',
    database='projectdb'
)

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

