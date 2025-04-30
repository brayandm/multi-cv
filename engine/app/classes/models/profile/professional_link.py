from typing import Annotated, Literal

from pydantic import BaseModel, Field, field_validator

from app.utils.pydantic_custom_types import ShortStr

ProfessionalLinkType = Annotated[
    Literal[
        "github",
        "linkedin",
        "portfolio",
    ],
    Field(...),
]


class ProfessionalLink(BaseModel):
    name: ProfessionalLinkType
    link: ShortStr

    @field_validator("name", mode="before")
    @classmethod
    def lowercase_str(cls, v: str) -> str:
        if isinstance(v, str):
            return v.lower()
        return v
