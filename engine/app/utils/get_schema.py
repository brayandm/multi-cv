import inspect
import json
from typing import (
    Annotated,
    Any,
    List,
    Literal,
    Optional,
    Type,
    Union,
    get_args,
    get_origin,
)

from pydantic import BaseModel


def get_schema(
    type_hint: Any, exclude_keys: Optional[List[str]] = None
) -> Any:
    origin = get_origin(type_hint)
    args = get_args(type_hint)

    is_optional = False

    if origin is Annotated:
        return get_schema(args[0], exclude_keys)

    if origin is Union and type(None) in args:
        is_optional = True
        non_none = [arg for arg in args if arg is not type(None)]
        type_hint = non_none[0]
        origin = get_origin(type_hint)
        args = get_args(type_hint)

    if origin is Literal:
        literal_values = " | ".join(str(x) for x in args)
        schema = {"__literal__": True, "value": literal_values}
    elif inspect.isclass(type_hint) and issubclass(type_hint, BaseModel):
        schema = generate_structure(type_hint, exclude_keys)
    elif origin in {list, List}:
        inner = get_schema(args[0], exclude_keys) if args else "string"
        schema = [inner]  # type: ignore
    elif type_hint in {str, int, float, bool}:
        schema = (
            "string"
            if type_hint is str
            else type_hint.__name__  # type: ignore
        )
    else:
        schema = "string"  # type: ignore

    if is_optional:
        return {"__optional__": True, "value": schema}

    return schema


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
