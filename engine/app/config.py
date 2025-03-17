import os

AMQP = {
    "username": os.environ.get("RABBITMQ_USER"),
    "password": os.environ.get("RABBITMQ_PASSWORD"),
    "host": os.environ.get("RABBITMQ_HOST"),
    "port": os.environ.get("RABBITMQ_PORT"),
    "vhost": os.environ.get(
        "RABBITMQ_VHOST",
    ),
}

REDIS = {
    "password": os.environ.get("REDIS_PASSWORD"),
    "host": os.environ.get("REDIS_HOST"),
    "port": os.environ.get("REDIS_PORT"),
    "db": os.environ.get("REDIS_DB_NUMBER"),
}

MONGO_DB = {
    "username": os.environ.get("MONGO_DB_USERNAME", ""),
    "password": os.environ.get("MONGO_DB_PASSWORD", ""),
    "host": os.environ.get("MONGO_DB_HOST", ""),
    "port": os.environ.get("MONGO_DB_PORT", ""),
    "name": os.environ.get("MONGO_DB_NAME", ""),
}

CELERY_BROKER_URL = (
    "amqp://{username}:{password}@{host}:{port}/{vhost}".format(**AMQP),
)

RESULT_BACKEND = "redis://:{password}@{host}:{port}/{db}".format(**REDIS)

DOCUMENTS_DISK = os.environ.get("DOCUMENTS_DISK", "local")

STORAGE_PATH = os.environ.get("STORAGE_PATH", "/tmp")

AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")
AWS_DEFAULT_REGION = os.environ.get("AWS_DEFAULT_REGION")
AWS_BUCKET = os.environ.get("AWS_BUCKET")
AWS_USE_PATH_STYLE_ENDPOINT = os.environ.get("AWS_USE_PATH_STYLE_ENDPOINT")

WEBHOOK_URL = os.environ.get("WEBHOOK_URL")

BACKEND_API_URL = os.environ.get("BACKEND_API_URL", "")

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")

INTER_COMMUNICATION_TOKEN = os.environ.get("INTER_COMMUNICATION_TOKEN", "")

AUTH_COOKIE_NAME = os.environ.get("AUTH_COOKIE_NAME", "auth_token")
