from typing import Annotated, List, Optional

from pydantic import BaseModel, Field

from app.utils.pydantic_custom_types import (
    MAX_EDUCATION_LENGTH,
    MAX_EXPERIENCE_LENGTH,
    MAX_PROFESSIONAL_LINKS_LENGTH,
    MAX_PROJECTS_LENGTH,
    MAX_CERTIFICATIONS_LENGTH,
    MAX_LANGUAGES,
    GeneralNotesStr,
)

from .basic_info import BasicInfo
from .education import Education
from .experience import Experience
from .professional_link import ProfessionalLink
from .project import Project
from .skills import Skills
from .certificate import Certificate
from .language import Language


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
    certifications: Annotated[
        List[Certificate], Field(..., max_items=MAX_CERTIFICATIONS_LENGTH)
    ]
    skills: Skills
    languages: Annotated[List[Language], Field(..., max_items=MAX_LANGUAGES)]
    general_notes: Optional[GeneralNotesStr] = None
