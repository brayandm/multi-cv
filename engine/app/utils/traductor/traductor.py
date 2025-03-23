import json
import os

from dotenv import load_dotenv
from langchain.schema import SystemMessage
from langchain.prompts import ChatPromptTemplate, HumanMessagePromptTemplate
from langchain_openai import ChatOpenAI
from pydantic import SecretStr

load_dotenv(dotenv_path=".env")
api_key = os.environ.get("OPENAI_API_KEY") or ""

CURRENT_DIR = os.path.dirname(__file__)
file_path = os.path.join(CURRENT_DIR, "en.json")

with open(file_path, "r", encoding="utf-8") as f:
    data = json.load(f)

target_languages = [
    {"code": "es", "language": "Spanish"},
    {"code": "fr", "language": "French"},
]

chat_prompt = ChatPromptTemplate.from_messages(
    [
        SystemMessage(
            content=(
                "You are an expert translator and developer familiar with "
                "the NextIntl file format used in Next.js applications. "
                "You will be given a JSON file with translation strings in "
                "English. "
                "Your task is to translate the values into the target "
                "language, keeping the JSON structure identical. "
                "Translations must be short and meaningful to avoid layout "
                "issues. Return only the translated JSON. No extra text, no "
                "comments."
            )
        ),
        HumanMessagePromptTemplate.from_template(
            "{json_data}\n\nTranslate to {target_language}"
        ),
    ]
)

llm = ChatOpenAI(
    temperature=0,
    api_key=SecretStr(api_key),
    model="gpt-4o-mini",
)

chain = chat_prompt | llm

input_json_str = json.dumps(data, ensure_ascii=False, indent=2)

for target in target_languages:
    result = chain.invoke(
        {"json_data": input_json_str, "target_language": target["language"]}
    )

    output_filename = f"{target['code']}.json"
    output_path = os.path.join(CURRENT_DIR, output_filename)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(
            json.loads(str(result.content)), f, ensure_ascii=False, indent=4
        )
    print(f"Output saved to {output_filename}")
