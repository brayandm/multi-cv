from pydantic import BaseModel

from .cv_education import CvEducation
from .cv_experience import CvExperience
from .cv_project import CvProject
from .cv_skill_group import CvSkillGroup
from typing import Optional


class Cv(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    location: Optional[str] = None
    summary: Optional[str] = None
    experiences: Optional[list[CvExperience]] = None
    skills: Optional[list[CvSkillGroup]] = None
    educations: Optional[list[CvEducation]] = None
    projects: Optional[list[CvProject]] = None
