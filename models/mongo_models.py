from mongoengine import Document, StringField, ListField, ReferenceField

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