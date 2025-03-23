import os
import json
from dotenv import load_dotenv

from langchain.chains import LLMChain

from langchain.prompts import ChatPromptTemplate

from langchain.schema import SystemMessage, HumanMessage
from langchain_openai import ChatOpenAI


from pydantic import SecretStr

load_dotenv(dotenv_path="../.env")
api_key = os.environ.get("OPENAI_API_KEY") or ""

with open("en.json", "r", encoding="utf-8") as f:
    data = json.load(f)

target_languages = [
    {"code": "es", "language": "Spanish"},
    {"code": "fr", "language": "French"},
]

chat_prompt = ChatPromptTemplate.from_messages(
    [
        SystemMessage(
            content=(
                "You are an expert translator and developer familiar with"
                "the NextIntl file format used in Next.js applications. "
                "You will be given a JSON file with translation strings in"
                "English. "
                "Your task is to translate the values into the target"
                "language, keeping the JSON structure identical. "
                "Translations must be short and meaningful to avoid layout"
                "issues. Return only the translated JSON. No extra text, no"
                "comments."
            )
        ),
        HumanMessage(content="{json_data}\n\nTranslate to {target_language}"),
    ]
)

llm = ChatOpenAI(
    temperature=0,
    api_key=SecretStr(api_key),
    model="gpt-4o-mini",
)
chain = LLMChain(llm=llm, prompt=chat_prompt)

input_json_str = json.dumps(data, ensure_ascii=False, indent=2)

for target in target_languages:
    result = chain.run(
        json_data=input_json_str, target_language=target["language"]
    )
    output_filename = f"{target['code']}.json"
    with open(output_filename, "w", encoding="utf-8") as f:
        f.write(result)
    print(f"Output saved to {output_filename}")
