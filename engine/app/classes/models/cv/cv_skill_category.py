from pydantic import BaseModel


class CvSkillCategory(BaseModel):
    category: str
    list: list[str]
