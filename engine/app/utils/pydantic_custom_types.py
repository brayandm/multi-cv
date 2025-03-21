from typing import Annotated, Optional, List, TypeVar

from pydantic import BeforeValidator, Field

MAX_SHORT_STR_LENGTH = 100
MAX_LONG_STR_LENGTH = 1000
MAX_NOTES_LENGTH = 2000
MAX_GENERAL_NOTES_LENGTH = 5000

T = TypeVar("T")


def crop_list(max_length: int) -> BeforeValidator:

    def crop(value: List[T]) -> List[T]:
        if isinstance(value, list) and len(value) > max_length:
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
    Field(max_length=MAX_NOTES_LENGTH),
]

GeneralNotesStr = Annotated[
    Optional[str],
    crop_str(MAX_GENERAL_NOTES_LENGTH),
    Field(max_length=MAX_GENERAL_NOTES_LENGTH),
]
