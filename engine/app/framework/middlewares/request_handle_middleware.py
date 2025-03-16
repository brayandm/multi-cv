from contextvars import ContextVar
from typing import Any, Callable

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.datastructures import Headers

from app.config import AUTH_COOKIE_NAME

import urllib.parse

request_var: ContextVar[Request | None] = ContextVar("request", default=None)


class RequestHandleMiddleware(BaseHTTPMiddleware):
    async def dispatch(
        self, request: Request, call_next: Callable[..., Any]
    ) -> Any:
        request_var.set(request)

        auth_token = request.cookies.get(AUTH_COOKIE_NAME)

        if not auth_token:
            auth_token = request.headers.get("Authorization")

        if auth_token:
            auth_token = urllib.parse.unquote(auth_token)

            headers = dict(request.headers)
            headers["Authorization"] = f"Bearer {auth_token}"
            request._headers = Headers(headers)

        response = await call_next(request)
        return response
