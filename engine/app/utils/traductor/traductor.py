import json
import os
from collections import OrderedDict
from collections.abc import MutableMapping
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Any

from dotenv import load_dotenv
from langchain.prompts import ChatPromptTemplate, HumanMessagePromptTemplate
from langchain.schema import SystemMessage
from langchain_openai import ChatOpenAI
from pydantic import SecretStr

from app.classes.models.traduction import LANGUAGE_NAME_BY_LOCALE

load_dotenv(dotenv_path=".env")
api_key: str = os.environ.get("OPENAI_API_KEY") or ""

base_paths: list[str] = [
    "../frontend/messages",
    "./app/utils/traductions/cv",
]

target_languages: list[dict[str, str]] = [
    {"code": code, "language": name}
    for code, name in LANGUAGE_NAME_BY_LOCALE.items()
    if code != "en"
]

print("Available languages:", target_languages)


def flatten(
    d: dict[str, Any], parent_key: str = "", sep: str = "."
) -> OrderedDict[str, str]:
    items: list[tuple[str, str]] = []
    for k, v in d.items():
        new_key = f"{parent_key}{sep}{k}" if parent_key else k
        if isinstance(v, MutableMapping) and isinstance(v, dict):
            items.extend(flatten(v, new_key, sep=sep).items())
        else:
            items.append((new_key, str(v)))
    return OrderedDict(items)


def unflatten(d: dict[str, str], sep: str = ".") -> OrderedDict[str, Any]:
    result: OrderedDict[str, Any] = OrderedDict()
    for k, v in d.items():
        parts = k.split(sep)
        target: OrderedDict[str, Any] = result
        for part in parts[:-1]:
            if part not in target or not isinstance(target[part], dict):
                target[part] = OrderedDict()
            target = target[part]
        target[parts[-1]] = v
    return result


chat_prompt: ChatPromptTemplate = ChatPromptTemplate.from_messages(
    [
        SystemMessage(
            content=(
                "You are an expert translator and developer familiar with "
                "the NextIntl file format used in Next.js applications. "
                "You will be given a JSON file with translation strings in "
                "English. Your task is to translate the values into the"
                "target language, keeping the JSON structure and keys"
                "identical. Return only the translated JSON with flat keys. "
                "No extra text."
            )
        ),
        HumanMessagePromptTemplate.from_template(
            "{json_data}\n\nTranslate to {target_language}"
        ),
    ]
)

llm: ChatOpenAI = ChatOpenAI(
    temperature=0,
    api_key=SecretStr(api_key),
    model="gpt-4o-mini",
)

chain = chat_prompt | llm


def translate_and_sync_nested(base_path: str, target: dict[str, str]) -> str:
    source_path: str = os.path.join(base_path, "en.json")
    if not os.path.exists(source_path):
        raise FileNotFoundError(f"Missing source file: {source_path}")

    with open(source_path, "r", encoding="utf-8") as f:
        en_data: OrderedDict[str, Any] = json.load(
            f, object_pairs_hook=OrderedDict
        )
    en_flat: OrderedDict[str, str] = flatten(en_data)

    code: str = target["code"]
    lang: str = target["language"]
    output_path: str = os.path.join(base_path, f"{code}.json")

    if os.path.exists(output_path):
        with open(output_path, "r", encoding="utf-8") as f:
            existing_flat: dict[str, str] = flatten(json.load(f))
    else:
        existing_flat = {}

    new_keys: OrderedDict[str, str] = OrderedDict(
        (k, v) for k, v in en_flat.items() if k not in existing_flat
    )
    keys_to_keep: set[str] = set(en_flat.keys())
    updated_flat: OrderedDict[str, str] = OrderedDict(
        (k, v) for k, v in existing_flat.items() if k in keys_to_keep
    )

    if new_keys:
        input_json_str: str = json.dumps(
            new_keys, ensure_ascii=False, indent=2
        )
        result = chain.invoke(
            {"json_data": input_json_str, "target_language": lang}
        )
        translated_flat: dict[str, str] = json.loads(
            result.content
            if isinstance(result.content, str)
            else json.dumps(result.content)
        )
        for k in new_keys:
            if k in translated_flat:
                updated_flat[k] = translated_flat[k]

    ordered_final: OrderedDict[str, str] = OrderedDict()
    for k in en_flat.keys():
        if k in updated_flat:
            ordered_final[k] = updated_flat[k]

    final_nested: OrderedDict[str, Any] = unflatten(ordered_final)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(final_nested, f, ensure_ascii=False, indent=2)

    return output_path


def main() -> None:
    with ThreadPoolExecutor() as executor:
        futures = [
            executor.submit(translate_and_sync_nested, base_path, target)
            for base_path in base_paths
            for target in target_languages
        ]
        for future in as_completed(futures):
            print(f"✅ {future.result()} synced.")


if __name__ == "__main__":
    main()
