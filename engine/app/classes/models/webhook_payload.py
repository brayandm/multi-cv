from typing import Any

from pydantic import BaseModel


class WebhookPayload(BaseModel):
    action: str
    result: Any
