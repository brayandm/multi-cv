from pydantic import BaseModel
from typing import Optional


class Experience(BaseModel):
    company: str
    end_date: str
    start_date: str
    location: str
    description: str
    role: str
    is_present: bool
    notes: Optional[str] = None
