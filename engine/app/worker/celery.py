from celery import Celery  # type: ignore

from app.config import CELERY_BROKER_URL, RESULT_BACKEND  # type: ignore

celery = Celery(
    "engine",
    backend=RESULT_BACKEND,
    broker=CELERY_BROKER_URL,
    include=["app.worker.tasks"],
)

celery.conf.update(
    task_routes={
        "*": {"queue": "openai_queue"},
    },
    task_soft_time_limit=60,
    task_time_limit=65,
    task_acks_late=True,
    task_reject_on_worker_lost=True,
)
