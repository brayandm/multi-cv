from pydantic import BaseModel


class Experience(BaseModel):
    company: str
    end_date: str
    start_date: str
    location: str
    description: str
    role: str
    is_present: bool
