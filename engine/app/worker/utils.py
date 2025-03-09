from typing import Any, Dict
import importlib


def serialize(value: Any) -> Dict[str, Any]:
    if hasattr(value, "dict"):
        vtype = f"{value.__class__.__module__}.{value.__class__.__name__}"

        return {
            "__type__": vtype,
            "data": value.dict(),
        }
    return {
        "__type__": "primitive",
        "data": value,
    }


def format_result(value: Any) -> Any:
    if hasattr(value, "dict"):
        return value.dict()
    return value


def deserialize(value: Dict[str, Any]) -> Any:
    type_path = value.get("__type__")
    data = value.get("data")

    assert type_path is not None

    if type_path == "primitive":
        return data

    module_name, class_name = type_path.rsplit(".", 1)
    module = importlib.import_module(module_name)
    model_class = getattr(module, class_name)

    return model_class(**data)
