import json
import os
from concurrent.futures import ThreadPoolExecutor, as_completed
from collections.abc import MutableMapping
from typing import Any

from dotenv import load_dotenv
from langchain.prompts import ChatPromptTemplate, HumanMessagePromptTemplate
from langchain.schema import SystemMessage
from langchain_openai import ChatOpenAI
from pydantic import SecretStr

load_dotenv(dotenv_path=".env")
api_key: str = os.environ.get("OPENAI_API_KEY") or ""

source_path: str = "../frontend/messages/en.json"

with open(source_path, "r", encoding="utf-8") as f:
    en_data: dict[str, Any] = json.load(f)


def flatten(
    d: dict[str, Any], parent_key: str = "", sep: str = "."
) -> dict[str, str]:
    items: list[tuple[str, str]] = []
    for k, v in d.items():
        new_key = f"{parent_key}{sep}{k}" if parent_key else k
        if isinstance(v, MutableMapping):
            if isinstance(v, dict):
                items.extend(flatten(v, new_key, sep=sep).items())
        else:
            items.append((new_key, str(v)))
    return dict(items)


def unflatten(d: dict[str, str], sep: str = ".") -> dict[str, Any]:
    result: dict[str, Any] = {}
    for k, v in d.items():
        parts = k.split(sep)
        target = result
        for part in parts[:-1]:
            target = target.setdefault(part, {})
        target[parts[-1]] = v
    return result


en_flat: dict[str, str] = flatten(en_data)

target_languages: list[dict[str, str]] = [
    {"code": "es", "language": "Spanish"},
    {"code": "ru", "language": "Russian"},
    {"code": "hi", "language": "Romanized Hindi"},
]

chat_prompt: ChatPromptTemplate = ChatPromptTemplate.from_messages(
    [
        SystemMessage(
            content=(
                "You are an expert translator and developer familiar with "
                "the NextIntl file format used in Next.js applications. "
                "You will be given a JSON file with translation strings in "
                "English. Your task is to translate the values into the target"
                "language, keeping the JSON structure and keys identical. "
                "Return only the translated JSON with flat keys."
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


def translate_and_sync_nested(target: dict[str, str]) -> str:
    code: str = target["code"]
    lang: str = target["language"]
    output_path: str = f"../frontend/messages/{code}.json"

    if os.path.exists(output_path):
        with open(output_path, "r", encoding="utf-8") as f:
            existing_flat: dict[str, str] = flatten(json.load(f))
    else:
        existing_flat = {}

    new_keys: dict[str, str] = {
        k: v for k, v in en_flat.items() if k not in existing_flat
    }
    keys_to_keep: set[str] = set(en_flat.keys())
    updated_flat: dict[str, str] = {
        k: v for k, v in existing_flat.items() if k in keys_to_keep
    }

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
        updated_flat.update(translated_flat)

    final_nested: dict[str, Any] = unflatten(updated_flat)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(final_nested, f, ensure_ascii=False, indent=4)

    return output_path


def main() -> None:
    with ThreadPoolExecutor() as executor:
        futures = [
            executor.submit(translate_and_sync_nested, target)
            for target in target_languages
        ]
        for future in as_completed(futures):
            print(f"✅ {future.result()} synced.")


if __name__ == "__main__":
    main()
