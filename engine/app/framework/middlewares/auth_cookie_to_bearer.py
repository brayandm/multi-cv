from contextvars import ContextVar
from typing import Any, Callable

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

from app.config import AUTH_COOKIE_NAME

request_var: ContextVar[Request | None] = ContextVar("request", default=None)


class AuthCookieToBearerMiddleware(BaseHTTPMiddleware):
    async def dispatch(
        self, request: Request, call_next: Callable[..., Any]
    ) -> Any:
        request_var.set(request)

        auth_token = request.cookies.get(AUTH_COOKIE_NAME)

        if auth_token:
            headers = dict(request.headers)
            headers["Authorization"] = f"Bearer {auth_token}"
            request.scope["headers"] = [
                (k.encode(), v.encode()) for k, v in headers.items()
            ]

        response = await call_next(request)
        return response
