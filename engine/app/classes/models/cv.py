from app.classes.models.cv_experience import CvExperience
from pydantic import BaseModel


class Cv(BaseModel):
    name: str
    email: str
    phone: str
    summary: str
    experiences: list[CvExperience]
