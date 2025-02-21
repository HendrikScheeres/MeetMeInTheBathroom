from mongoengine import Document, StringField, ListField, ReferenceField
from mdutils import MdUtils

class Band(Document):
    name = StringField(required=True, unique=True)
    meta = { "collection": "bands"}

class Company(Document):
    name = StringField(required=True, unique=True)
    meta = { "collection": "companies"}

class Person(Document):
    name = StringField(required=True, unique=True)
    roles = ListField(StringField())
    bands = ListField(ReferenceField(Band), required=False)
    companies = ListField(ReferenceField(Company), required=False)

    meta = { "collection": "people"}

    def create_md(self, file_path):
        # create the markdown file
        filename = self.name.lower().replace(' ', '_')
        # add the file path to the filename
        # file_path = file_path + "/" + filename + ".md"


        title = self.name
        mdFile = MdUtils(file_name=file_path, title=title)
        mdFile.new_header(level=1, title=title)
        mdFile.new_header(level=2, title="Roles")
        for role in self.roles:
            mdFile.new_list([role])

        mdFile.create_md_file()

        