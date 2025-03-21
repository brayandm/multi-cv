from typing import Annotated, List, Optional

from pydantic import BaseModel, Field

from app.utils.pydantic_custom_types import (
    MAX_EDUCATION_LENGTH,
    MAX_EXPERIENCE_LENGTH,
    MAX_PROFESSIONAL_LINKS_LENGTH,
    MAX_PROJECTS_LENGTH,
    GeneralNotesStr,
)

from .basic_info import BasicInfo
from .education import Education
from .experience import Experience
from .professional_link import ProfessionalLink
from .project import Project
from .skills import Skills


class Profile(BaseModel):
    basic_info: BasicInfo
    professional_links: Annotated[
        List[ProfessionalLink],
        Field(..., max_items=MAX_PROFESSIONAL_LINKS_LENGTH),
    ]
    experience: Annotated[
        List[Experience], Field(..., max_items=MAX_EXPERIENCE_LENGTH)
    ]
    education: Annotated[
        List[Education], Field(..., max_items=MAX_EDUCATION_LENGTH)
    ]
    projects: Annotated[
        List[Project], Field(..., max_items=MAX_PROJECTS_LENGTH)
    ]
    skills: Skills
    general_notes: Optional[GeneralNotesStr] = None
