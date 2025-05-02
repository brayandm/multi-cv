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
    while get_origin(type_hint) is Annotated:
        type_hint = get_args(type_hint)[0]
    return type_hint


def get_schema(
    type_hint: Any, exclude_keys: Optional[List[str]] = None
) -> tuple[Any, list[str]]:
    flags: list[str] = []

    type_hint = unwrap_annotated(type_hint)

    origin = get_origin(type_hint)
    args = get_args(type_hint)

    if origin is Union and type(None) in args:
        flags.append("optional")
        non_none = [arg for arg in args if arg is not type(None)]
        type_hint = unwrap_annotated(non_none[0])
        origin = get_origin(type_hint)
        args = get_args(type_hint)

    if origin is Literal:
        flags.append("literal")
        literal_values = " | ".join(str(x) for x in args)
        return literal_values, flags

    if inspect.isclass(type_hint) and issubclass(type_hint, BaseModel):
        return generate_structure(type_hint, exclude_keys), flags

    elif origin in {list, List}:
        inner_type = args[0] if args else str
        inner_schema, _ = get_schema(inner_type, exclude_keys)
        return [inner_schema], flags

    elif type_hint in {str, int, float, bool}:
        return ("string" if type_hint is str else type_hint.__name__, flags)

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

    def format_value(val: Any) -> str:
        if isinstance(val, str):
            return f'"{val}"'
        elif isinstance(val, list):
            inner = format_value(val[0])
            return f"[{inner}]"
        elif isinstance(val, dict):
            inner_lines = []
            for k, v in val.items():
                inner_val, inner_flags = v if isinstance(v, tuple) else (v, [])
                comment = (
                    f"  # {', '.join(inner_flags)}" if inner_flags else ""
                )
                formatted = format_value(inner_val)
                inner_lines.append(f'    "{k}": {formatted},{comment}')
            if inner_lines:
                inner_lines[-1] = inner_lines[-1].rstrip(",")
            return "{{\n{}\n  }}".format("\n".join(inner_lines))
        else:
            return str(val)

    for key, (val_type, flags) in structure.items():
        comment = f"  # {', '.join(flags)}" if flags else ""
        formatted_value = format_value(val_type)
        lines.append(f'  "{key}": {formatted_value},{comment}')

    if lines[-1].endswith(","):
        lines[-1] = lines[-1].rstrip(",")
    lines.append("}")
    return "\n".join(lines)
