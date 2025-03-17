from typing import Optional

from pydantic import BaseModel, EmailStr


class BasicInfo(BaseModel):
    full_name: str
    email: EmailStr
    about: str
    country_code: str
    phone_number: str
    location: str
    notes: Optional[str] = None
