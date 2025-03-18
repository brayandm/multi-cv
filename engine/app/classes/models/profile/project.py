from typing import Optional

from pydantic import BaseModel


class Project(BaseModel):
    id: str
    name: str
    end_date: str
    start_date: str
    description: str
    link: str
    notes: Optional[str] = None
