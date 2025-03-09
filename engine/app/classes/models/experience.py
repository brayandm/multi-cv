from pydantic import BaseModel


class CvExperience(BaseModel):
    company: str
    position: str
    location: str
    start_date: str
    end_date: str
    description: list[str]
