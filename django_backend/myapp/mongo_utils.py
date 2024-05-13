from pymongo import MongoClient
from django.conf import settings

def get_mongo_connection():
    db_config = settings.MONGODB_DATABASE
    client = MongoClient(
        host=db_config['host'],
        port=db_config['port'],


    )
    db = client[db_config['database']]
    # collection = db[db_config['product_collection']]  # 'product_collection' key to access the collection name
    # return collection
    return db
