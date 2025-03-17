from functools import wraps
from typing import Any, Callable

from fastapi import HTTPException

from app.config import (
    INTER_COMMUNICATION_TOKEN,
)
from app.framework.middlewares.request_handle_middleware import request_var

from app.framework.decorators.action import set_action_id


def validate_api_token() -> Callable[..., Any]:
    def decorator(func: Callable[..., Any]) -> Callable[..., Any]:
        @wraps(func)
        async def wrapper(*args: Any, **kwargs: Any) -> Any:

            request = request_var.get()

            action_id = kwargs.get("payload", {}).action_id

            if not action_id:
                raise HTTPException(
                    status_code=400, detail="Action ID is missing."
                )

            set_action_id(action_id)

            if request is None:
                raise HTTPException(
                    status_code=500, detail="Request context is missing."
                )

            authorization = request.headers.get("X-API-Token")

            if not authorization:
                raise HTTPException(
                    status_code=401,
                    detail="Authorization is required.",
                )

            if authorization != INTER_COMMUNICATION_TOKEN:
                raise HTTPException(
                    status_code=401,
                    detail="Invalid authorization.",
                )

            return await func(*args, **kwargs)

        return wrapper

    return decorator
