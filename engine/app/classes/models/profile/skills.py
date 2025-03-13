from pydantic import BaseModel


class Skills(BaseModel):
    list: list[str]
