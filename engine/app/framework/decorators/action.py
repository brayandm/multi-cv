import urllib.parse
from functools import wraps
from typing import Any, Callable

import requests  # type: ignore
from fastapi import HTTPException, Request

from app.config import (
    BACKEND_API_URL,
    INTER_COMMUNICATION_TOKEN,
)
from app.framework.logging import logger

from contextvars import ContextVar

authorization_var: ContextVar[str | None] = ContextVar(
    "authorization", default=None
)


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

            if (
                response.status_code != 200
                or response.json().get("code") != 200
            ):
                raise HTTPException(status_code=403, detail="Unauthorized")

            try:
                return await func(request, *args, **kwargs)

            except Exception as e:
                logger.error(e)

                rollback(action, authorization)

                raise e

        return wrapper

    return decorator
