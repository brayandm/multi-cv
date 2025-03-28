from typing import Annotated, Literal

from pydantic import BaseModel, Field

from app.utils.pydantic_custom_types import (
    ShortStr,
)

LanguageLevel = Annotated[
    Literal[
        "Basic",
        "Intermediate",
        "Professional",
        "Native",
    ],
    Field(...),
]


class Language(BaseModel):
    name: ShortStr
    level: LanguageLevel
