from typing import Optional, List, Annotated

from pydantic import BaseModel, Field

from .cv_education import CvEducation
from .cv_experience import CvExperience
from .cv_project import CvProject
from .cv_skill_category import CvSkillCategory

from app.utils.pydantic_custom_types import (
    ShortStr,
    crop_list,
    MAX_EXPERIENCE_LENGTH,
    MAX_EDUCATION_LENGTH,
    MAX_PROJECTS_LENGTH,
    MAX_SKILL_CATEGORIES_LENGTH,
)


class Cv(BaseModel):
    name: Optional[ShortStr] = None
    email: Optional[ShortStr] = None
    phone: Optional[ShortStr] = None
    linkedin: Optional[ShortStr] = None
    github: Optional[ShortStr] = None
    location: Optional[ShortStr] = None
    summary: Optional[ShortStr] = None

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
