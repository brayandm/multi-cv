from pydantic import BaseModel

from app.classes.models.experience import CvExperience


class Cv(BaseModel):
    name: str
    email: str
    phone: str
    summary: str
    experiences: list[CvExperience]
