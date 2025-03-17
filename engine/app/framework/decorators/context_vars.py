from contextvars import ContextVar

user_id_var: ContextVar[int] = ContextVar("user_id")
action_id_var: ContextVar[str | None] = ContextVar("action_id", default=None)


def get_user_id() -> int:
    return user_id_var.get()


def set_user_id(user_id: int) -> None:
    user_id_var.set(user_id)


def get_action_id() -> str | None:
    return action_id_var.get()


def set_action_id(action_id: str) -> None:
    action_id_var.set(action_id)
