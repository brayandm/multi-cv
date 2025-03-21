from typing import Optional

from pydantic import BaseModel

from app.utils.pydantic_custom_types import (
    LongStr,
    NotesStr,
    ShortStr,
)


class Project(BaseModel):
    id: ShortStr
    name: ShortStr
    link: ShortStr
    description: LongStr
    start_date: ShortStr
    end_date: ShortStr
    is_present: bool
    notes: Optional[NotesStr] = None
