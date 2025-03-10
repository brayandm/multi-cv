from pydantic import BaseModel
from typing import List
from .basic_info import BasicInfo
from .professional_link import ProfessionalLink
from .experience import Experience
from .education import Education
from .project import Project


class Profile(BaseModel):
    basic_info: BasicInfo
    professional_links: List[ProfessionalLink]
    experience: List[Experience]
    education: List[Education]
    projects: List[Project]
    skills: List[str]
