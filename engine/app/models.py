from pydantic import BaseModel


class Person(BaseModel):
    name: str
    email: str
    about: str


class Message(BaseModel):
    message: str
