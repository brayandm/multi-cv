from typing import Any

from pydantic import BaseModel

from app.utils.pydantic_custom_types import ShortStr


class WebhookPayload(BaseModel):
    action: ShortStr
    action_id: ShortStr
    user_id: int
    result: Any
