from pydantic import BaseModel


class Education(BaseModel):
    institution: str
    end_date: str
    start_date: str
    location: str
    career: str
    is_present: bool
    notes: str
