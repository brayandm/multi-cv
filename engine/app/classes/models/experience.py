from pydantic import BaseModel


class Experience(BaseModel):
    company: str
    position: str
    start_date: str
    end_date: str
    description: list[str]
