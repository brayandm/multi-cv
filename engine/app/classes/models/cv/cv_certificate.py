from pydantic import BaseModel

from app.utils.pydantic_custom_types import ShortStr


class CvCertificate(BaseModel):
    name: ShortStr
    issuer: ShortStr
    verification_url: ShortStr
    issue_date: ShortStr
    expiration_date: ShortStr
