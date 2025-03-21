from typing import List, Optional

from pydantic import BaseModel

from app.utils.pydantic_custom_types import ShortStr, LongStr


class SkillNote(BaseModel):
    name: ShortStr
    experience_years: float
    description: LongStr


class Skills(BaseModel):
    list: list[ShortStr]
    notes: Optional[List[SkillNote]] = None
