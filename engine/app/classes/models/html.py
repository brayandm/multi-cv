from pydantic import BaseModel


class Html(BaseModel):
    content: str
