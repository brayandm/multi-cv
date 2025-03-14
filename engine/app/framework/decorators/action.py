import urllib.parse
from functools import wraps
from typing import Any, Callable

import requests  # type: ignore
from fastapi import HTTPException, Request

from app.config import (
    BACKEND_API_URL,
    INTER_COMMUNICATION_TOKEN,
)


def action(action: str) -> Callable[..., Any]:
    def decorator(func: Callable[..., Any]) -> Callable[..., Any]:
        @wraps(func)
        async def wrapper(request: Request, *args: Any, **kwargs: Any) -> Any:

            authorization = request.headers.get("Authorization")

            authorization = (
                urllib.parse.unquote(authorization) if authorization else None
            )

            if not authorization:
                raise HTTPException(
                    status_code=401,
                    detail="Authorization is required.",
                )

            response = requests.post(
                f"{BACKEND_API_URL}/action/consume",
                json={"action": action},
                headers={
                    "X-API-Key": INTER_COMMUNICATION_TOKEN,
                    "Authorization": authorization,
                },
            )

            if (
                response.status_code != 200
                or response.json().get("code") != 200
            ):
                raise HTTPException(status_code=403, detail="Unauthorized")

            try:
                return await func(request, *args, **kwargs)

            except Exception as e:
                response = requests.post(
                    f"{BACKEND_API_URL}/action/rollback",
                    json={"token": authorization, "action": action},
                    headers={"X-API-Key": INTER_COMMUNICATION_TOKEN},
                )
                raise e

        return wrapper

    return decorator
