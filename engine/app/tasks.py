import importlib
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
    def deserialize(value: Dict[str, Any]) -> Any:
        type_path = value.get("__type__")
        data = value.get("data")

        assert type_path is not None

        if type_path == "primitive":
            return data

        module_name, class_name = type_path.rsplit(".", 1)
        module = importlib.import_module(module_name)
        model_class = getattr(module, class_name)

        return model_class(**data)

    deserialized_inputs = {
        key: deserialize(value) for key, value in inputs.items()
    }

    module_name, class_name = pipeline_path.rsplit(".", 1)
    module = importlib.import_module(module_name)
    pipeline_class = getattr(module, class_name)

    pipeline_instance = pipeline_class()
    result = pipeline_instance.run(**deserialized_inputs)

    requests.post(WEBHOOK_URL, json={"action": action, "result": result})

    return {"action": action, "result": "success"}
