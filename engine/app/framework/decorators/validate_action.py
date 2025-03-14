from functools import wraps
from typing import Any, Callable

import requests  # type: ignore
from fastapi import HTTPException, Request

from app.config import (
    BACKEND_API_URL,
    INTER_COMMUNICATION_TOKEN,
    AUTH_COOKIE_NAME,
)


def validate_action(action: str) -> Callable[..., Any]:
    def decorator(func: Callable[..., Any]) -> Callable[..., Any]:
        @wraps(func)
        async def wrapper(request: Request, *args: Any, **kwargs: Any) -> Any:

            authorization = request.cookies.get(AUTH_COOKIE_NAME)

            if not authorization:
                raise HTTPException(
                    status_code=401,
                    detail="Authorization is required.",
                )

            response = requests.post(
                BACKEND_API_URL + "/validate/action",
                json={"token": authorization, "action": action},
                headers={"x-api-key": INTER_COMMUNICATION_TOKEN},
            )

            if response.status_code != 200 or not response.json().get(
                "valid", False
            ):
                raise HTTPException(status_code=403, detail="Unauthorized")

            return await func(request, *args, **kwargs)

        return wrapper

    return decorator
