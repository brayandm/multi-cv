from pydantic import BaseModel

from app.utils.pydantic_custom_types import ShortStr


class CvTexts(BaseModel):
    contact_info: ShortStr
    summary: ShortStr
    experience: ShortStr
    education: ShortStr
    projects: ShortStr
    certifications: ShortStr
    languages: ShortStr
    skills: ShortStr
