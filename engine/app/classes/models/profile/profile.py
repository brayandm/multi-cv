from typing import List, Optional, Annotated

from pydantic import BaseModel, Field

from app.utils.pydantic_custom_types import NotesStr

from .basic_info import BasicInfo
from .education import Education
from .experience import Experience
from .professional_link import ProfessionalLink
from .project import Project
from .skills import Skills


class Profile(BaseModel):
    basic_info: BasicInfo
    professional_links: Annotated[
        List[ProfessionalLink], Field(..., max_items=10)
    ]
    experience: Annotated[List[Experience], Field(..., max_items=20)]
    education: Annotated[List[Education], Field(..., max_items=10)]
    projects: Annotated[List[Project], Field(..., max_items=15)]
    skills: Skills
    general_notes: Optional[NotesStr] = None
