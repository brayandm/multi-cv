from pydantic import BaseModel

from .cv_experience import CvExperience


class Cv(BaseModel):
    name: str
    email: str
    phone: str
    summary: str
    experiences: list[CvExperience]
