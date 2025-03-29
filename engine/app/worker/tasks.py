import asyncio
import importlib
from typing import Any, Dict, Tuple

import requests  # type: ignore
from celery import Task  # type: ignore
from celery.exceptions import TaskError  # type: ignore

from app.config import INTER_COMMUNICATION_TOKEN, WEBHOOK_URL
from app.framework.decorators.action import rollback_action
from app.framework.decorators.context_vars import (
    set_action,
    set_action_id,
    set_user_id,
)
from app.framework.logging import logger
from app.worker.celery import celery  # type: ignore
from app.worker.utils import deserialize, format_result


def rollback_task(
    exc: TaskError,
    task_id: str,
    args: Tuple[Any, ...],
    kwargs: Dict[str, Any],
    einfo: Any,
) -> None:

    action_id = args[1]

    set_action_id(action_id)

    if not action_id:
        logger.error("Action ID is missing for rollback")
        return

    rollback_action()


@celery.task(
    name="execute_pipeline_task",
    bind=True,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 1, "countdown": 5},
)  # type: ignore
def execute_pipeline_task(
    self: Task,
    pipeline_path: str,
    action: str,
    action_id: str,
    user_id: int,
    inputs: Dict[str, Any],
) -> Any:

    retry_count = self.request.retries

    if retry_count > 0:
        logger.info("Retrying #%s for action: %s", retry_count, action)

    deserialized_inputs = [
        deserialize(value) for key, value in sorted(inputs.items())
    ]

    module_name, class_name = pipeline_path.rsplit(".", 1)
    module = importlib.import_module(module_name)
    pipeline_class = getattr(module, class_name)

    pipeline_instance = pipeline_class()

    set_user_id(user_id)
    set_action_id(action_id)
    set_action(action)

    try:
        if asyncio.iscoroutinefunction(pipeline_instance.run):
            result = asyncio.run(pipeline_instance.run(*deserialized_inputs))
        else:
            result = pipeline_instance.run(*deserialized_inputs)
    except Exception as e:
        logger.error(
            "Pipeline failed for action: %s with error: %s", action, e
        )
        raise e

    try:
        requests.post(
            WEBHOOK_URL,
            json={
                "action": action,
                "action_id": action_id,
                "user_id": user_id,
                "result": format_result(result),
            },
            headers={"X-API-Token": INTER_COMMUNICATION_TOKEN},
        )
    except Exception as e:
        logger.error(
            "Webhook failed for action: %s with error: %s",
            action,
            e,
        )
        raise e

    return {"action": action, "result": "success"}


execute_pipeline_task.on_failure = rollback_task
