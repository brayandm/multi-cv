from typing import Any

from pydantic import BaseModel


class WebhookPayload(BaseModel):
    action_id: int
    action: str
    result: Any
