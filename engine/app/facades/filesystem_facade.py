from fs.base import FS
from fs.osfs import OSFS
from fs_s3fs import S3FS  # type: ignore

from app.config import (
    AWS_ACCESS_KEY_ID,
    AWS_BUCKET,
    AWS_DEFAULT_REGION,
    AWS_SECRET_ACCESS_KEY,
    AWS_USE_PATH_STYLE_ENDPOINT,
    DOCUMENTS_DISK,
    STORAGE_PATH,
)


class FilesystemFacade:
    _local_filesystem: OSFS | None = None
    _s3_filesystem: S3FS | None = None

    @classmethod
    def get_filesystem(cls) -> FS:
        return (
            cls.get_s3_filesystem()
            if DOCUMENTS_DISK == "s3"
            else cls.get_local_filesystem()
        )

    @classmethod
    def get_local_filesystem(cls) -> OSFS:
        if cls._local_filesystem is None:
            cls._local_filesystem = OSFS(STORAGE_PATH, create=True)
        return cls._local_filesystem

    @classmethod
    def get_s3_filesystem(cls) -> S3FS:
        if cls._s3_filesystem is None:
            cls._s3_filesystem = S3FS(
                bucket_name=AWS_BUCKET,
                aws_access_key_id=AWS_ACCESS_KEY_ID,
                aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
                region=AWS_DEFAULT_REGION,
                root_path=STORAGE_PATH,
                use_path_style=AWS_USE_PATH_STYLE_ENDPOINT == "true",
            )
        return cls._s3_filesystem
