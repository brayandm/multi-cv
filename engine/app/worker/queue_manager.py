from typing import Any, Dict, Type
from app.classes.base import Pipeline
from app.worker.tasks import execute_pipeline


class QueueManager:
    def __init__(self, default_queue: str = "default_queue") -> None:
        self.default_queue = default_queue
        self.pipeline_queues: Dict[str, str] = {}

    def register_pipeline(
        self, pipeline_class: Type[Pipeline], queue_name: str
    ) -> None:
        self.pipeline_queues[pipeline_class.__name__] = queue_name

    def execute(
        self,
        pipeline_class: Type[Pipeline],
        action: str,
        inputs: Dict[str, Any],
    ) -> None:
        queue_name = self.pipeline_queues.get(
            pipeline_class.__name__, self.default_queue
        )

        def transform(value: Any) -> Dict[str, Any]:
            if hasattr(value, "dict"):
                vtype = (
                    f"{value.__class__.__module__}.{value.__class__.__name__}"
                )

                return {
                    "__type__": vtype,
                    "data": value.dict(),
                }
            return {
                "__type__": "primitive",
                "data": value,
            }

        serialized_inputs = {
            key: transform(value) for key, value in inputs.items()
        }

        execute_pipeline.apply_async(
            args=[
                f"{pipeline_class.__module__}.{pipeline_class.__name__}",
                action,
                serialized_inputs,
            ],
            queue=queue_name,
        )
        print(f"Pipeline {pipeline_class.__name__} sent to queue {queue_name}")
