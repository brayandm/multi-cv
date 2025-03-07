from celery import Celery  # type: ignore

from .config import CELERY_BROKER_URL, RESULT_BACKEND  # type: ignore

celery = Celery(
    "engine",
    backend=RESULT_BACKEND,
    broker=CELERY_BROKER_URL,
    include=["app.tasks"],
)

celery.conf.update(
    task_routes={
        "tasks.send_to_openai": {"queue": "openai_queue"},
    }
)

celery.conf.task_queues = {
    "openai_queue",
}
