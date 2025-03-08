from pydantic import BaseModel


class Person(BaseModel):
    nombre: str
    email: str
    about: str


class Message(BaseModel):
    message: str
