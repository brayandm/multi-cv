from typing import Any, Dict, Type

from app.classes.base import Pipeline
from app.tasks import execute_pipeline


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

        execute_pipeline.apply_async(
            args=[
                f"{pipeline_class.__module__}.{pipeline_class.__name__}",
                action,
                inputs,
            ],
            queue=queue_name,
        )
        print(f"Pipeline {pipeline_class.__name__} sent to queue {queue_name}")
