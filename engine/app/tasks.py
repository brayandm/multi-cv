import importlib
import os
from typing import Any, Dict

import requests  # type: ignore

from app.celery import celery  # type: ignore
from app.config import WEBHOOK_URL


@celery.task(name="execute_pipeline")  # type: ignore
def execute_pipeline(
    pipeline_path: str,
    action: str,
    inputs: Dict[str, Any],
) -> Any:

    module_name, class_name = pipeline_path.rsplit(".", 1)
    module = importlib.import_module(module_name)
    pipeline_class = getattr(module, class_name)

    pipeline_instance = pipeline_class()
    result = pipeline_instance.run(**inputs)

    requests.post(WEBHOOK_URL, json={"action": action, "result": result})
