from typing import Annotated, Literal

from pydantic import BaseModel, Field

from app.utils.pydantic_custom_types import ShortStr

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
