from typing import Optional

from pydantic import BaseModel

from app.utils.pydantic_custom_types import ShortStr, LongStr, NotesStr


class BasicInfo(BaseModel):
    full_name: ShortStr
    email: ShortStr
    about: LongStr
    phone_country_code: ShortStr
    phone_number: ShortStr
    location: ShortStr
    notes: Optional[NotesStr] = None
