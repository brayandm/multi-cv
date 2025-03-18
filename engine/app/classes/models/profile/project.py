from typing import Optional

from pydantic import BaseModel


class Project(BaseModel):
    id: str
    name: str
    link: str
    description: str
    start_date: str
    end_date: str
    notes: Optional[str] = None
