from typing import Optional

from pydantic import BaseModel


class Education(BaseModel):
    id: str
    institution: str
    end_date: str
    start_date: str
    location: str
    career: str
    is_present: bool
    notes: Optional[str] = None
