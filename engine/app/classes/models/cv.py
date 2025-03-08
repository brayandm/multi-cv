from pydantic import BaseModel
from app.classes.models.experience import Experience


class CV(BaseModel):
    name: str
    email: str
    phone: str
    summary: str
    experiences: list[Experience]
