import importlib
from typing import Any, Dict

import requests  # type: ignore

from app.worker.celery import celery  # type: ignore
from app.config import WEBHOOK_URL
from app.worker.utils import deserialize, format_result


@celery.task(name="execute_pipeline")  # type: ignore
def execute_pipeline(
    pipeline_path: str,
    action: str,
    inputs: Dict[str, Any],
) -> Any:

    deserialized_inputs = {
        key: deserialize(value) for key, value in inputs.items()
    }

    module_name, class_name = pipeline_path.rsplit(".", 1)
    module = importlib.import_module(module_name)
    pipeline_class = getattr(module, class_name)

    pipeline_instance = pipeline_class()
    result = pipeline_instance.run(**deserialized_inputs)

    requests.post(
        WEBHOOK_URL, json={"action": action, "result": format_result(result)}
    )

    return {"action": action, "result": "success"}
