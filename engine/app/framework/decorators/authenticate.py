from functools import wraps
from typing import Any, Callable

import requests  # type: ignore
from fastapi import HTTPException

from app.config import (
    BACKEND_API_URL,
    INTER_COMMUNICATION_TOKEN,
)
from app.framework.decorators.context_vars import set_user_id
from app.framework.logging import logger
from app.framework.middlewares.request_handle_middleware import (
    request_var,
)


def authenticate() -> Callable[..., Any]:
    def decorator(func: Callable[..., Any]) -> Callable[..., Any]:
        @wraps(func)
        async def wrapper(*args: Any, **kwargs: Any) -> Any:

            request = request_var.get()

            if request is None:
                raise HTTPException(
                    status_code=500, detail="Request context is missing."
                )

            authorization = request.headers.get("Authorization")

            if not authorization:
                raise HTTPException(
                    status_code=401,
                    detail="Authorization is required.",
                )

            client_ip = request.client.host if request.client else "unknown"

            response = requests.post(
                f"{BACKEND_API_URL}/auth/get-id",
                headers={
                    "X-API-Key": INTER_COMMUNICATION_TOKEN,
                    "X-Client-IP": client_ip,
                    "Authorization": authorization,
                },
            )

            if response.status_code != 200:
                raise HTTPException(status_code=403, detail="Unauthorized")

            data = response.json()

            code: int = data.get("code")
            user_id: int = data.get("user_id")

            if code != 200 or not user_id:
                raise HTTPException(status_code=403, detail="Unauthorized")

            set_user_id(user_id)

            try:
                return await func(*args, **kwargs)

            except Exception as e:
                logger.error(e)

                raise e

        return wrapper

    return decorator
