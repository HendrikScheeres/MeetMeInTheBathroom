# import the connect function from the connect.py file
from connect import connect_to_client_db
from models.mongo_models import Person, Band, Company
from dotenv import load_dotenv
from data.utils import load_csv

# load environment variables
load_dotenv()

# Connect to the database
connect_to_client_db()

# local csv
file_path = "data/sheets/castofcharacters.csv"
df = load_csv(file_path)

# load in the data
for index, row in df.iterrows():

    # turn the roles into a list
    roles = row["Role(s)"].split(",") if row["Role(s)"] else []

    bands = []
    companies = []
    if row["Band(s)"]:
        band_names = row["Band(s)"].split(", ")
        # check if the band already exists
        for band_name in band_names:
            band = Band.objects(name=band_name).first()
            if not band:
                band = Band(name=band_name)
                band.save()
            # add the band to the row
            bands.append(band)
    
    if row["Companies"]:
        company_names = row["Companies"].split(", ")
        # check if the company already exists
        for company_name in company_names:
            company = Company.objects(name=company_name).first()
            if not company:
                company = Company(name=company_name)
                company.save()
            # add the company to the row
            companies.append(company)

    # check if the person already exists
    person = Person.objects(name=row["Name"]).first()
    if not person:
        person = Person(name=row["Name"], roles=roles, bands=bands, companies=companies)
        person.save()
    else:
        person.update(roles=roles, bands=bands, companies=companies)





