from pydantic import BaseModel
from typing import List


class SkillNote(BaseModel):
    name: str
    experience: float


class Skills(BaseModel):
    list: list[str]
    notes: List[SkillNote]
