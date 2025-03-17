from pydantic import BaseModel

from .cv_education import CvEducation
from .cv_experience import CvExperience
from .cv_project import CvProject
from .cv_skill_group import CvSkillGroup


class Cv(BaseModel):
    name: str
    email: str
    phone: str
    linkedin: str
    location: str
    summary: str
    experiences: list[CvExperience]
    skills: list[CvSkillGroup]
    educations: list[CvEducation]
    projects: list[CvProject]
