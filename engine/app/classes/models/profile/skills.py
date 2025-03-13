from typing import List

from pydantic import BaseModel


class SkillNote(BaseModel):
    name: str
    experience_years: float


class Skills(BaseModel):
    list: list[str]
    notes: List[SkillNote]
