from typing import List

from pydantic import BaseModel

from .basic_info import BasicInfo
from .education import Education
from .experience import Experience
from .professional_link import ProfessionalLink
from .project import Project


class Profile(BaseModel):
    basic_info: BasicInfo
    professional_links: List[ProfessionalLink]
    experience: List[Experience]
    education: List[Education]
    projects: List[Project]
    skills: List[str]
