from typing import Optional

from pydantic import BaseModel


class Experience(BaseModel):
    company: str
    end_date: str
    start_date: str
    location: str
    description: str
    role: str
    is_present: bool
    notes: Optional[str] = None
