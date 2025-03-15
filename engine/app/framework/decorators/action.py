import urllib.parse
from contextvars import ContextVar
from functools import wraps
from typing import Any, Callable

import requests  # type: ignore
from fastapi import HTTPException, Request

from app.config import (
    BACKEND_API_URL,
    INTER_COMMUNICATION_TOKEN,
)
from app.framework.logging import logger

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
        async def wrapper(request: Request, *args: Any, **kwargs: Any) -> Any:

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

            data = response.json()

            code: int = data.get("code")
            user_id: int = data.get("user_id")

            if response.status_code != 200 or code != 200 or not user_id:
                raise HTTPException(status_code=403, detail="Unauthorized")

            user_id_var.set(user_id)

            try:
                return await func(request, *args, **kwargs)

            except Exception as e:
                logger.error(e)

                rollback(action, authorization)

                raise e

        return wrapper

    return decorator
