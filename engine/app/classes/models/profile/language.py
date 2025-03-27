from typing import Literal, Annotated

from pydantic import BaseModel, Field

from app.utils.pydantic_custom_types import (
    ShortStr,
)

LanguageProficiency = Annotated[
    Literal[
        "Basic",
        "Limited",
        "Professional",
        "Full professional",
        "Native",
    ],
    Field(...),
]


class Language(BaseModel):
    name: ShortStr
    proficiency: LanguageProficiency
