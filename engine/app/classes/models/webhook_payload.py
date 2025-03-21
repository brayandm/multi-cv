from typing import Any

from pydantic import BaseModel

from app.utils.pydantic_custom_types import ShortStr


class WebhookPayload(BaseModel):
    action_id: ShortStr
    action: ShortStr
    result: Any
