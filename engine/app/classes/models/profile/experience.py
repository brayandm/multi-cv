from typing import Optional

from pydantic import BaseModel


class Experience(BaseModel):
    id: str
    company: str
    link: str
    role: str
    location: str
    description: str
    start_date: str
    end_date: str
    is_present: bool
    notes: Optional[str] = None
