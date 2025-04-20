from pydantic import BaseModel, Field

from app.utils.pydantic_custom_types import ShortStr

from typing import Annotated, Literal

ProfessionalLinkType = Annotated[
    Literal[
        "GitHub",
        "LinkedIn",
        "Portfolio",
    ],
    Field(...),
]


class ProfessionalLink(BaseModel):
    name: ProfessionalLinkType
    link: ShortStr
