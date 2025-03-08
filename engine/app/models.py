from pydantic import BaseModel
from pydantic.networks import EmailStr


class Person(BaseModel):
    nombre: str
    email: EmailStr
    about: str


class Message(BaseModel):
    message: str
