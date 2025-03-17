from pydantic import BaseModel
from typing import Optional


class Project(BaseModel):
    name: str
    end_date: str
    start_date: str
    description: str
    link: str
    notes: Optional[str] = None
