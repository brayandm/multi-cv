import urllib.parse
from contextvars import ContextVar
from typing import Any, Callable

from fastapi import Request
from starlette.datastructures import MutableHeaders
from starlette.middleware.base import BaseHTTPMiddleware

from app.config import AUTH_COOKIE_NAME

request_var: ContextVar[Request | None] = ContextVar("request", default=None)


class RequestHandleMiddleware(BaseHTTPMiddleware):
    async def dispatch(
        self, request: Request, call_next: Callable[..., Any]
    ) -> Any:
        request_var.set(request)

        auth_token = request.headers.get("Authorization")

        if not auth_token:
            auth_token = request.cookies.get(AUTH_COOKIE_NAME)
        else:
            auth_token = auth_token.replace("Bearer ", "")

        if auth_token:
            auth_token = urllib.parse.unquote(auth_token)

            new_header = MutableHeaders(request._headers)
            new_header["Authorization"] = f"Bearer {auth_token}"
            request._headers = new_header
            request.scope.update(headers=request.headers.raw)

        response = await call_next(request)
        return response
