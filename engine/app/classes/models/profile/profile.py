from typing import List, Optional

from pydantic import BaseModel

from .basic_info import BasicInfo
from .education import Education
from .experience import Experience
from .professional_link import ProfessionalLink
from .project import Project
from .skills import Skills

from app.utils.pydantic_custom_types import NotesStr


class Profile(BaseModel):
    basic_info: BasicInfo
    professional_links: List[ProfessionalLink]
    experience: List[Experience]
    education: List[Education]
    projects: List[Project]
    skills: Skills
    general_notes: Optional[NotesStr] = None
