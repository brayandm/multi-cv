from pydantic import BaseModel


class CvSkillGroup(BaseModel):
    list: list[str]
