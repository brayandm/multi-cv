from typing import List, Optional

from pydantic import BaseModel


class SkillNote(BaseModel):
    name: str
    experience_years: float
    description: str


class Skills(BaseModel):
    list: list[str]
    notes: Optional[List[SkillNote]] = None
