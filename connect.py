import os
from urllib.parse import quote_plus
from mongoengine import connect, disconnect

def disconnect_db():
    disconnect()

def connect_to_client_db():
    username = os.getenv("MONGO_USER")
    password = os.getenv("MONGO_PASSWORD")
    db_name = os.getenv("MONGO_DB_NAME")
    mongo_host = os.getenv("MONGO_HOST")
    app_name = os.getenv("APP_NAME")

    print(f"CONNECTING TO DATABASE: {db_name}")

    # Construct the proper MongoDB URI
    parsed_uri = f"mongodb+srv://{username}:{password}@{mongo_host}/{db_name}?retryWrites=true&w=majority&appName={app_name}"

    # Connect using MongoEngine
    connect(db=db_name, host=parsed_uri)

    return db_name  # Returning the name for reference (optional)


# def connect_to_client_db():
#     username = os.getenv("MONGO_USER")
#     password = os.getenv("MONGO_PASSWORD")
#     db_name = os.getenv("MONGO_DB_NAME")
#     mongo_host = os.getenv("MONGO_HOST")
#     app_name = os.getenv("APP_NAME")
 
#     print(f"CONNECTING TO DATABASE: {db_name}")

#      # Construct the proper MongoDB URI
#     parsed_uri = f"mongodb+srv://{username}:{password}@{mongo_host}/?retryWrites=true&w=majority&appName={app_name}"

#     client = connect(host=parsed_uri)

#     db = client[db_name]

#     return db
