from typing import Annotated, List, Optional

from pydantic import BaseModel, Field

from app.utils.pydantic_custom_types import (
    MAX_CERTIFICATIONS_LENGTH,
    MAX_EDUCATION_LENGTH,
    MAX_EXPERIENCE_LENGTH,
    MAX_LANGUAGES,
    MAX_PROJECTS_LENGTH,
    MAX_SKILL_CATEGORIES_LENGTH,
    ForceLongStr,
    ForceShortStr,
    crop_list,
)

from .cv_certificate import CvCertificate
from .cv_education import CvEducation
from .cv_experience import CvExperience
from .cv_language import CvLanguage
from .cv_project import CvProject
from .cv_skill_category import CvSkillCategory


class Cv(BaseModel):
    full_name: Optional[ForceShortStr] = None
    email: Optional[ForceShortStr] = None
    phone: Optional[ForceShortStr] = None
    linkedin: Optional[ForceShortStr] = None
    github: Optional[ForceShortStr] = None
    location: Optional[ForceShortStr] = None
    summary: Optional[ForceLongStr] = None

    experiences: Annotated[
        Optional[List[CvExperience]],
        crop_list(MAX_EXPERIENCE_LENGTH),
        Field(None, max_items=MAX_EXPERIENCE_LENGTH),
    ]
    skill_categories: Annotated[
        Optional[List[CvSkillCategory]],
        crop_list(MAX_SKILL_CATEGORIES_LENGTH),
        Field(None, max_items=MAX_SKILL_CATEGORIES_LENGTH),
    ]
    educations: Annotated[
        Optional[List[CvEducation]],
        crop_list(MAX_EDUCATION_LENGTH),
        Field(None, max_items=MAX_EDUCATION_LENGTH),
    ]
    projects: Annotated[
        Optional[List[CvProject]],
        crop_list(MAX_PROJECTS_LENGTH),
        Field(None, max_items=MAX_PROJECTS_LENGTH),
    ]
    certifications: Annotated[
        Optional[List[CvCertificate]],
        crop_list(MAX_CERTIFICATIONS_LENGTH),
        Field(None, max_items=MAX_CERTIFICATIONS_LENGTH),
    ]

    languages: Annotated[
        Optional[List[CvLanguage]],
        crop_list(MAX_LANGUAGES),
        Field(None, max_items=MAX_LANGUAGES),
    ]
