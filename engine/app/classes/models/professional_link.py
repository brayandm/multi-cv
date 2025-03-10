from pydantic import BaseModel


class ProfessionalLink(BaseModel):
    name: str
    link: str
