import inspect
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


def get_schema(
    type_hint: Any, exclude_keys: Optional[List[str]] = None
) -> tuple[Any, list[str]]:
    raw_type = unwrap_annotated(type_hint)
    origin = get_origin(raw_type)
    args = get_args(raw_type)

    flags: list[str] = []

    if origin is Union and type(None) in args:
        flags.append("optional")
        non_none = [arg for arg in args if arg is not type(None)]
        raw_type = unwrap_annotated(non_none[0])
        origin = get_origin(raw_type)
        args = get_args(raw_type)

    if origin is Literal:
        flags.append("literal")
        literal_values = " | ".join(str(x) for x in args)
        return literal_values, flags

    if inspect.isclass(raw_type) and issubclass(raw_type, BaseModel):
        return generate_structure(raw_type, exclude_keys), flags
    elif origin in {list, List}:
        inner, inner_flags = (
            get_schema(args[0], exclude_keys) if args else ("string", [])
        )
        return [inner], flags
    elif raw_type in {str, int, float, bool}:
        return ("string" if raw_type is str else raw_type.__name__, flags)
    else:
        return ("string", flags)


def generate_structure(
    model: Type[BaseModel], exclude_keys: Optional[List[str]] = None
) -> dict[str, tuple[Any, list[str]]]:
    fields: dict[str, tuple[Any, list[str]]] = {}
    exclude_keys = exclude_keys or []
    for name, field in model.__annotations__.items():
        if name in exclude_keys:
            continue
        fields[name] = get_schema(field, exclude_keys)
    return fields


def structure_to_string(
    model: Type[BaseModel], exclude_keys: Optional[List[str]] = None
) -> str:
    structure = generate_structure(model, exclude_keys)
    lines = ["{"]
    for i, (key, (value, flags)) in enumerate(structure.items()):
        comment = f"  # {', '.join(flags)}" if flags else ""
        json_value = (
            f'"{value}"'
            if isinstance(value, str)
            else str(value).replace("'", '"')
        )
        lines.append(f'  "{key}": {json_value},{comment}')
    if lines[-1].endswith(","):
        lines[-1] = lines[-1].rstrip(",")
    lines.append("}")
    return "\n".join(lines)
