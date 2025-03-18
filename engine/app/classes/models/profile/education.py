from typing import Optional

from pydantic import BaseModel


class Education(BaseModel):
    id: str
    institution: str
    link: str
    career: str
    location: str
    start_date: str
    end_date: str
    is_present: bool
    notes: Optional[str] = None
