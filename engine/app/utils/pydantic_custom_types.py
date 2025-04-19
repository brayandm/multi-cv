from typing import Annotated, List, Optional, TypeVar

from pydantic import BeforeValidator, Field

MAX_SHORT_STR_LENGTH = 100
MAX_LONG_STR_LENGTH = 1000
MAX_EXTRA_LONG_STR_LENGTH = 10000
MAX_NOTES_LENGTH = 2000
MAX_GENERAL_NOTES_LENGTH = 5000
MAX_PROFESSIONAL_LINKS_LENGTH = 10
MAX_PROJECTS_LENGTH = 15
MAX_EDUCATION_LENGTH = 10
MAX_EXPERIENCE_LENGTH = 20
MAX_EXPERIENCE_BULLETS_LENGTH = 5
MAX_CERTIFICATIONS_LENGTH = 10
MAX_SKILL_CATEGORIES_LENGTH = 10
MAX_SKILLS_PER_CATEGORY = 20
MAX_SKILS = 50
MAX_LANGUAGES = 10
MAX_CHAT_MESSAGES = 10
MAX_PDF_PAGES = 5
MAX_INAPPROPRIATE_MESSAGES = 5

T = TypeVar("T")


def crop_list(max_length: int) -> BeforeValidator:

    def crop(value: Optional[List[T]]) -> Optional[List[T]]:
        if isinstance(value, List) and len(value) > max_length:
            return value[:max_length]
        return value

    return BeforeValidator(crop)


def crop_str(max_length: int) -> BeforeValidator:

    def crop(value: Optional[str]) -> Optional[str]:
        if isinstance(value, str) and len(value) > max_length:
            return value[:max_length]
        return value

    return BeforeValidator(crop)


ShortStr = Annotated[str, Field(..., max_length=MAX_SHORT_STR_LENGTH)]

LongStr = Annotated[str, Field(..., max_length=MAX_LONG_STR_LENGTH)]

ExtraLongStr = Annotated[str, Field(..., max_length=MAX_EXTRA_LONG_STR_LENGTH)]

ForceShortStr = Annotated[
    str,
    crop_str(MAX_SHORT_STR_LENGTH),
    Field(max_length=MAX_SHORT_STR_LENGTH),
]

ForceLongStr = Annotated[
    str,
    crop_str(MAX_LONG_STR_LENGTH),
    Field(max_length=MAX_LONG_STR_LENGTH),
]

NotesStr = Annotated[
    Optional[str],
    crop_str(MAX_NOTES_LENGTH),
    Field(default=None, max_length=MAX_NOTES_LENGTH),
]

GeneralNotesStr = Annotated[
    Optional[str],
    crop_str(MAX_GENERAL_NOTES_LENGTH),
    Field(default=None, max_length=MAX_GENERAL_NOTES_LENGTH),
]
