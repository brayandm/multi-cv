from functools import wraps
from typing import Any, Callable

import requests  # type: ignore
from fastapi import HTTPException

from app.config import (
    BACKEND_API_URL,
    INTER_COMMUNICATION_TOKEN,
)
from app.framework.decorators.context_vars import (
    get_action_id,
    set_action,
    set_action_id,
    set_user_id,
)
from app.framework.logging import logger
from app.framework.middlewares.request_handle_middleware import (
    request_var,
)


def commit_action() -> None:

    action_id = get_action_id()

    try:
        response = requests.post(
            f"{BACKEND_API_URL}/action/commit",
            json={"action_id": action_id},
            headers={
                "X-API-Key": INTER_COMMUNICATION_TOKEN,
            },
        )

    except Exception as e:
        logger.error(
            "Commit failed with error %s",
            e,
        )
        raise e

    if response.status_code != 200 or response.json().get("code") != 200:
        logger.error(
            "Commit failed for action_id %s",
            action_id,
        )
    else:
        logger.info(
            "Commit successful for action_id %s",
            action_id,
        )


def rollback_action(action_id: str) -> None:

    try:
        response = requests.post(
            f"{BACKEND_API_URL}/action/rollback",
            json={"action_id": action_id},
            headers={
                "X-API-Key": INTER_COMMUNICATION_TOKEN,
            },
        )

    except Exception as e:
        logger.error(
            "Rollback failed with error %s",
            e,
        )
        raise e

    if response.status_code != 200 or response.json().get("code") != 200:
        logger.error(
            "Rollback failed for action_id %s",
            action_id,
        )
    else:
        logger.info(
            "Rollback successful for action_id %s",
            action_id,
        )


def commit_action_after() -> Callable[..., Any]:
    def decorator(func: Callable[..., Any]) -> Callable[..., Any]:
        @wraps(func)
        async def wrapper(*args: Any, **kwargs: Any) -> Any:

            result = await func(*args, **kwargs)

            commit_action()

            return result

        return wrapper

    return decorator


def consume_action(action: str) -> Callable[..., Any]:
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
                f"{BACKEND_API_URL}/action/consume",
                json={"action": action},
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
            action_id: str = data.get("action_id")

            if code != 200 or not user_id or not action_id:
                raise HTTPException(status_code=403, detail="Unauthorized")

            set_action_id(action_id)

            set_user_id(user_id)

            set_action(action)

            try:
                return await func(*args, **kwargs)

            except Exception as e:
                logger.error(e)

                rollback_action(action_id)

                raise e

        return wrapper

    return decorator
