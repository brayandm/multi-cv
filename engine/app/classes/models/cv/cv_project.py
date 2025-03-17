from pydantic import BaseModel


class CvProject(BaseModel):
    name: str
    location: str
    start_date: str
    end_date: str
    link: str
    description: str
