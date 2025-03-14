from functools import wraps
from typing import Any, Callable

from fastapi import HTTPException, Request

from app.config import (
    INTER_COMMUNICATION_TOKEN,
)


def validate_api_token() -> Callable[..., Any]:
    def decorator(func: Callable[..., Any]) -> Callable[..., Any]:
        @wraps(func)
        async def wrapper(request: Request, *args: Any, **kwargs: Any) -> Any:

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

            return await func(request, *args, **kwargs)

        return wrapper

    return decorator
