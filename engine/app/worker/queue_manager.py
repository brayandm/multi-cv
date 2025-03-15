from typing import Any, Dict, Type

from app.classes.base import Pipeline
from app.framework.decorators.action import get_authorization, get_user_id
from app.worker.tasks import execute_pipeline_task
from app.worker.utils import serialize


class QueueManager:
    def __init__(self, default_queue: str = "default_queue") -> None:
        self.default_queue = default_queue
        self.pipeline_queues: Dict[str, str] = {}

    def register_pipeline(
        self, pipeline_class: Type[Pipeline], queue_name: str
    ) -> None:
        self.pipeline_queues[pipeline_class.__name__] = queue_name

    def execute_pipeline(
        self,
        pipeline_class: Type[Pipeline],
        action: str,
        *inputs: Any,
    ) -> None:
        queue_name = self.pipeline_queues.get(
            pipeline_class.__name__, self.default_queue
        )

        inputs_dict = {
            f"arg{i}": input_value for i, input_value in enumerate(inputs)
        }

        serialized_inputs = {
            key: serialize(value) for key, value in inputs_dict.items()
        }

        authorization = get_authorization()

        user_id = get_user_id()

        execute_pipeline_task.apply_async(
            args=[
                f"{pipeline_class.__module__}.{pipeline_class.__name__}",
                action,
                authorization,
                user_id,
                serialized_inputs,
            ],
            queue=queue_name,
        )
        print(f"Pipeline {pipeline_class.__name__} sent to queue {queue_name}")
