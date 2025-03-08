from fs.base import FS
from fs.osfs import OSFS
from fs_s3fs import S3FS  # type: ignore
from app.config import (
    STORAGE_PATH,
    DOCUMENTS_DISK,
    AWS_BUCKET,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_DEFAULT_REGION,
    AWS_USE_PATH_STYLE_ENDPOINT,
)


class Filesystem:

    @staticmethod
    def get_filesystem() -> FS:

        storage_type = DOCUMENTS_DISK

        if storage_type == "s3":
            return Filesystem.get_s3_filesystem()  # type: ignore

        return Filesystem.get_local_filesystem()

    @staticmethod
    def get_local_filesystem() -> OSFS:
        return OSFS(STORAGE_PATH, create=True)

    @staticmethod
    def get_s3_filesystem() -> S3FS:
        return S3FS(
            bucket_name=AWS_BUCKET,
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
            region=AWS_DEFAULT_REGION,
            root_path=STORAGE_PATH,
            use_path_style=AWS_USE_PATH_STYLE_ENDPOINT == "true",
        )
