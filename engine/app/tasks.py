import os

from .celery import celery  # type: ignore
from typing import Any, Dict
import importlib

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

WEBHOOK_URL = os.getenv("WEBHOOK_URL", "")


@celery.task(name="execute_pipeline")  # type: ignore
def execute_pipeline(pipeline_path: str, inputs: Dict[str, Any]) -> Any:

    module_name, class_name = pipeline_path.rsplit(".", 1)
    module = importlib.import_module(module_name)
    pipeline_class = getattr(module, class_name)

    pipeline_instance = pipeline_class()
    return pipeline_instance.run(**inputs)
