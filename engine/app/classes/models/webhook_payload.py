from typing import Any

from pydantic import BaseModel


class WebhookPayload(BaseModel):
    action_id: str
    action: str
    result: Any
