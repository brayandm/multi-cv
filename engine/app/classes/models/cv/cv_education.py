from pydantic import BaseModel


class CvEducation(BaseModel):
    institution: str
    career: str
    location: str
    start_date: str
    end_date: str
