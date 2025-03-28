from pydantic import BaseModel
from typing import (
    Any,
    Union,
    get_args,
    get_origin,
    List,
    Annotated,
    Type,
)
import inspect
import json


def get_schema(type_hint: Any) -> Any:
    origin = get_origin(type_hint)
    args = get_args(type_hint)

    if origin is Annotated:
        return get_schema(args[0])
    if origin is Union:
        non_none = [arg for arg in args if arg is not type(None)]
        return get_schema(non_none[0]) if non_none else None
    if inspect.isclass(type_hint) and issubclass(type_hint, BaseModel):
        return generate_structure(type_hint)
    if origin in {list, List}:
        inner = get_schema(args[0]) if args else "string"
        return [inner]
    if type_hint in {str, int, float, bool}:
        return "string" if type_hint is str else type_hint.__name__
    return "string"


def generate_structure(model: Type[BaseModel]) -> dict[str, Any]:
    fields: dict[str, Any] = {}
    for name, field in model.__annotations__.items():
        fields[name] = get_schema(field)
    return fields


def structure_to_string(model: Type[BaseModel]) -> str:
    return json.dumps(generate_structure(model), indent=2)
