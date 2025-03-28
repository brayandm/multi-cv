from contextvars import ContextVar

user_id_var: ContextVar[int] = ContextVar("user_id")
action_id_var: ContextVar[str | None] = ContextVar("action_id", default=None)
action_var: ContextVar[str | None] = ContextVar("action", default=None)
auth_token_var: ContextVar[str] = ContextVar("auth_token")


def get_user_id() -> int:
    return user_id_var.get()


def set_user_id(user_id: int) -> None:
    user_id_var.set(user_id)


def get_action_id() -> str | None:
    return action_id_var.get()


def set_action_id(action_id: str) -> None:
    action_id_var.set(action_id)


def get_action() -> str | None:
    return action_var.get()


def set_action(action: str) -> None:
    action_var.set(action)


def get_auth_token() -> str:
    return auth_token_var.get()


def set_auth_token(token: str) -> None:
    auth_token_var.set(token)
