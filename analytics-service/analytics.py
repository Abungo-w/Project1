import pymysql
from pymongo import MongoClient
import time

mysql_conn = pymysql.connect(
    host='mysql-db',
    user='root',
    password='password',
    database='data_db'
)

mongo_client = MongoClient("mongodb://mongo-db:27017/")
mongo_db = mongo_client.analytics_db
collection = mongo_db.analytics

def compute_analytics():
    with mysql_conn.cursor() as cursor:
        cursor.execute("SELECT value FROM data_table")
        values = [row[0] for row in cursor.fetchall()]

    if values:
        analytics = {
            "max": max(values),
            "min": min(values),
            "avg": sum(values)/len(values)
        }
        collection.insert_one(analytics)

if __name__ == "__main__":
    while True:
        compute_analytics()
        time.sleep(10)  # recalc every 10s
