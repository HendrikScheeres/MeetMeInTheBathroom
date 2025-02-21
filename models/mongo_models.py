from mongoengine import Document, StringField, ListField, ReferenceField
from mdutils import MdUtils

class Band(Document):
    name = StringField(required=True, unique=True)
    meta = { "collection": "bands"}

    def create_md(self, directory):
        file_path = f"{directory}/{
            self.name}.md"
        mdFile = MdUtils(file_name=file_path)
        mdFile.new_header(level=1, title="Band")
        mdFile.new_line(self.name)
        mdFile.create_md_file()

    def has_md(self, directory):
            file_path = f"{directory}/{
                self.name}.md"
            try:    
                with open(file_path, "r") as file:
                    return True
            except FileNotFoundError:
                return False

class Company(Document):
    name = StringField(required=True, unique=True)
    meta = { "collection": "companies"}

    def create_md(self, directory):
        file_path = f"{directory}/{
            self.name}.md"
        mdFile = MdUtils(file_name=file_path)
        mdFile.new_header(level=1, title="Company")
        mdFile.new_line(self.name)
        mdFile.create_md_file()


    def has_md(self, directory):
        file_path = f"{directory}/{
            self.name}.md"
        try:
            with open(file_path, "r") as file:
                return True
        except FileNotFoundError:
            return False

class Person(Document):
    name = StringField(required=True, unique=True)
    roles = ListField(StringField())
    bands = ListField(ReferenceField(Band), required=False)
    companies = ListField(ReferenceField(Company), required=False)

    meta = { "collection": "people"}

    def create_md(self, directory):
        file_path = f"{directory}/{self.name}.md"       
        mdFile = MdUtils(file_name=file_path)

        # add tags
        mdFile.new_header(level=1, title="Roles")
        for role in self.roles:
            # add a tag sign to the role
            role_text = f"#{role}".replace(" ", "_")
            mdFile.new_line(role_text)

        # list the bands
        mdFile.new_header(level=1, title="Bands")
        for band in self.bands:
            # check if the band has a markdown file
            if not band.has_md(directory):
                band.create_md(directory)
            # add a link to the band's markdown file
            mdFile.new_line(f"[[{band.name}]]")

        # list the companies
        mdFile.new_header(level=1, title="Companies")
        for company in self.companies:
            # check if the company has a markdown file
            if not company.has_md(directory):
                company.create_md(directory)
            # add a link to the company's markdown file
            mdFile.new_line(f"[[{company.name}]]")

        mdFile.create_md_file()

    
    def has_md(self, directory):
        file_path = f"{directory}/{self.name}.md"
        try:
            with open(file_path, "r") as file:
                return True
        except FileNotFoundError:
            return False

        