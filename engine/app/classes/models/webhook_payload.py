from typing import Any

from pydantic import BaseModel


class WebhookPayload(BaseModel):
    user_id: int
    action: str
    result: Any
