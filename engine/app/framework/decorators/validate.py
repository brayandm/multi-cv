from functools import wraps
from fastapi import Request, HTTPException
import requests  # type: ignore
from typing import Callable, Any
from app.config import BACKEND_API_URL, INTER_COMMUNICATION_TOKEN


def validate(action: str) -> Callable[..., Any]:
    def decorator(func: Callable[..., Any]) -> Callable[..., Any]:
        @wraps(func)
        async def wrapper(request: Request, *args: Any, **kwargs: Any) -> Any:
            authorization = request.headers.get("Authorization")
            if not authorization:
                raise HTTPException(
                    status_code=401,
                    detail="Authorization header is required.",
                )

            response = requests.post(
                BACKEND_API_URL,
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
