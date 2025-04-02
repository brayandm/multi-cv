import json
import os
from typing import Any


def get_traductions(locale: str) -> Any:
    traductions_path = os.path.join(
        "app", "utils", "traductions", "cv", f"{locale}.json"
    )

    with open(traductions_path, "r", encoding="utf-8") as traductions_file:
        traductions = json.load(traductions_file)

    return traductions
