import inspect
import json
from typing import (
    Annotated,
    Any,
    List,
    Type,
    Union,
    get_args,
    get_origin,
    Optional,
)

from pydantic import BaseModel


def get_schema(
    type_hint: Any, exclude_keys: Optional[List[str]] = None
) -> Any:
    origin = get_origin(type_hint)
    args = get_args(type_hint)

    if origin is Annotated:
        return get_schema(args[0], exclude_keys)
    if origin is Union:
        non_none = [arg for arg in args if arg is not type(None)]
        return get_schema(non_none[0], exclude_keys) if non_none else None
    if inspect.isclass(type_hint) and issubclass(type_hint, BaseModel):
        return generate_structure(type_hint, exclude_keys)
    if origin in {list, List}:
        inner = get_schema(args[0], exclude_keys) if args else "string"
        return [inner]
    if type_hint in {str, int, float, bool}:
        return "string" if type_hint is str else type_hint.__name__
    return "string"


def generate_structure(
    model: Type[BaseModel], exclude_keys: Optional[List[str]] = None
) -> dict[str, Any]:
    fields: dict[str, Any] = {}
    exclude_keys = exclude_keys or []
    for name, field in model.__annotations__.items():
        if name in exclude_keys:
            continue
        fields[name] = get_schema(field, exclude_keys)
    return fields


def structure_to_string(
    model: Type[BaseModel], exclude_keys: Optional[List[str]] = None
) -> str:
    return json.dumps(generate_structure(model, exclude_keys), indent=2)
