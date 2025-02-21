from connect import connect_to_client_db
from models.mongo_models import Person, Band, Company
from dotenv import load_dotenv
# load environment variables
load_dotenv()

# Connect to the database
connect_to_client_db()

def main():
    # get a person ("Julian Casablancas")
    people = Person.objects.all()
    directory = "data/obsidian"

    for person in people:
        if not person.has_md(directory):
            # create the markdown file
            person.create_md(directory)


if __name__ == "__main__":
    main()