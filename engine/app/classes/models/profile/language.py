from typing import Annotated, Literal

from pydantic import BaseModel, Field, field_validator

from app.utils.pydantic_custom_types import (
    ShortStr,
)

LanguageLevel = Annotated[
    Literal[
        "basic",
        "intermediate",
        "professional",
        "native",
    ],
    Field(...),
]


class Language(BaseModel):
    name: ShortStr
    level: LanguageLevel

    @field_validator("level", mode="before")
    @classmethod
    def lowercase_str(cls, v: str) -> str:
        if isinstance(v, str):
            return v.lower()
        return v
