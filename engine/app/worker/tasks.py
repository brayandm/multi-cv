import importlib
from typing import Any, Dict

import requests  # type: ignore

from app.config import INTER_COMMUNICATION_TOKEN, WEBHOOK_URL
from app.worker.celery import celery  # type: ignore
from app.worker.utils import deserialize, format_result

from app.framework.logging import logger


@celery.task(name="execute_pipeline_task")  # type: ignore
def execute_pipeline_task(
    pipeline_path: str,
    action: str,
    inputs: Dict[str, Any],
) -> Any:

    deserialized_inputs = [
        deserialize(value) for key, value in sorted(inputs.items())
    ]

    module_name, class_name = pipeline_path.rsplit(".", 1)
    module = importlib.import_module(module_name)
    pipeline_class = getattr(module, class_name)

    pipeline_instance = pipeline_class()

    try:
        result = pipeline_instance.run(*deserialized_inputs)
    except Exception as e:
        logger.error(
            "Pipeline failed for action: %s with error: %s",
            action,
            e,
        )
        raise e

    try:
        requests.post(
            WEBHOOK_URL,
            json={"action": action, "result": format_result(result)},
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
