from typing import List, Optional, Annotated

from pydantic import BaseModel, Field

from app.utils.pydantic_custom_types import LongStr, ShortStr


class SkillNote(BaseModel):
    name: ShortStr
    experience_years: float
    description: LongStr


class Skills(BaseModel):
    list: Annotated[List[ShortStr], Field(..., max_items=50)]
    notes: Optional[Annotated[List[SkillNote], Field(None, max_items=50)]] = (
        None
    )
