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


def unwrap_annotated(type_hint: Any) -> Any:
    origin = get_origin(type_hint)
    if origin is Annotated:
        return unwrap_annotated(get_args(type_hint)[0])
    return type_hint


def ordered_schema(
    schema: dict,  # type: ignore
    is_optional: bool = False,
    is_literal: bool = False,
) -> dict:  # type: ignore
    ordered = {}
    if is_optional:
        ordered["__optional__"] = True
    if is_literal:
        ordered["__literal__"] = True
    for k, v in schema.items():
        ordered[k] = v
    return ordered


def get_schema(
    type_hint: Any, exclude_keys: Optional[List[str]] = None
) -> Any:
    raw_type = unwrap_annotated(type_hint)
    origin = get_origin(raw_type)
    args = get_args(raw_type)

    is_optional = False
    is_literal = False
    literal_values = None

    if origin is Union and type(None) in args:
        is_optional = True
        non_none = [arg for arg in args if arg is not type(None)]
        raw_type = unwrap_annotated(non_none[0])
        origin = get_origin(raw_type)
        args = get_args(raw_type)

    if origin is Literal:
        is_literal = True
        literal_values = " | ".join(str(x) for x in args)
        schema = {"value": literal_values}
        return ordered_schema(schema, is_optional, is_literal)

    if inspect.isclass(raw_type) and issubclass(raw_type, BaseModel):
        schema = generate_structure(raw_type, exclude_keys)
    elif origin in {list, List}:
        inner = get_schema(args[0], exclude_keys) if args else "string"
        schema = [inner]  # type: ignore
    elif raw_type in {str, int, float, bool}:
        schema = (
            "string" if raw_type is str else raw_type.__name__  # type: ignore
        )
    else:
        schema = "string"  # type: ignore

    if isinstance(schema, dict):
        return ordered_schema(schema, is_optional, is_literal)
    elif is_optional:
        return {"__optional__": True, "value": schema}
    else:
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
