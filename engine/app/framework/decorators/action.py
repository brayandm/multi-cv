import urllib.parse
from contextvars import ContextVar
from functools import wraps
from typing import Any, Callable

import requests  # type: ignore
from fastapi import HTTPException

from app.config import (
    BACKEND_API_URL,
    INTER_COMMUNICATION_TOKEN,
)
from app.framework.logging import logger

from app.framework.middlewares.auth_cookie_to_bearer import request_var

authorization_var: ContextVar[str | None] = ContextVar(
    "authorization", default=None
)

user_id_var: ContextVar[int | None] = ContextVar("user_id", default=None)


def get_user_id() -> int | None:
    return user_id_var.get()


def get_authorization() -> str | None:
    return authorization_var.get()


def rollback(action: str, authorization: str) -> None:

    try:
        response = requests.post(
            f"{BACKEND_API_URL}/action/rollback",
            json={"action": action},
            headers={
                "X-API-Key": INTER_COMMUNICATION_TOKEN,
                "Authorization": authorization,
            },
        )

    except Exception as e:
        logger.error(
            "Rollback failed for action: %s with error: %s",
            action,
            e,
        )
        raise e

    if response.status_code != 200 or response.json().get("code") != 200:
        logger.error(
            "Rollback failed for action: %s",
            action,
        )
    else:
        logger.info(
            "Rollback successful for action: %s",
            action,
        )


def action(action: str) -> Callable[..., Any]:
    def decorator(func: Callable[..., Any]) -> Callable[..., Any]:
        @wraps(func)
        async def wrapper(*args: Any, **kwargs: Any) -> Any:

            request = request_var.get()

            if request is None:
                raise HTTPException(
                    status_code=500, detail="Request context is missing."
                )

            authorization = request.headers.get("Authorization")

            authorization = (
                urllib.parse.unquote(authorization) if authorization else None
            )

            authorization_var.set(authorization)

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

            if response.status_code != 200:
                raise HTTPException(status_code=403, detail="Unauthorized")

            data = response.json()

            code: int = data.get("code")
            user_id: int = data.get("user_id")

            if code != 200 or not user_id:
                raise HTTPException(status_code=403, detail="Unauthorized")

            user_id_var.set(user_id)

            try:
                return await func(*args, **kwargs)

            except Exception as e:
                logger.error(e)

                rollback(action, authorization)

                raise e

        return wrapper

    return decorator
