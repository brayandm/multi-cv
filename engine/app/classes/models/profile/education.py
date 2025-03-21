from typing import Optional

from pydantic import BaseModel

from app.utils.pydantic_custom_types import ShortStr, NotesStr


class Education(BaseModel):
    id: ShortStr
    institution: ShortStr
    link: ShortStr
    career: ShortStr
    location: ShortStr
    start_date: ShortStr
    end_date: ShortStr
    is_present: bool
    notes: Optional[NotesStr] = None
