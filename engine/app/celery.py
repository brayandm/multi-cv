from celery import Celery  # type: ignore

from .config import CELERY_BROKER_URL, RESULT_BACKEND  # type: ignore

celery = Celery(
    "engine",
    backend=RESULT_BACKEND,
    broker=CELERY_BROKER_URL,
)
