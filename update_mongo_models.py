# import the connect function from the connect.py file
from connect import connect_to_client_db
from models.mongo_models import Person, Band, Company
from dotenv import load_dotenv
from data.utils import load_csv

# load environment variables
load_dotenv()

# Connect to the database
connect_to_client_db()

from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")  # Update if needed
db = client["your_database_name"]  # Replace with your actual database name
bands_collection = db["bands"]
people_collection = db["people"]

# get all bands
bands = Band.objects.all()

# Update each band with its members
for band in bands:
    band_id = band.id
    
    # Find all people who have this band_id in their "bands" array
    people = Person.objects(bands=band_id)

    # if the band has no members, skip
    if not people:
        continue

    # Update the band's members
    band.members = people
    band.save()

