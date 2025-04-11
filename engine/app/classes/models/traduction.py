from typing import Mapping

from pydantic import BaseModel, Field, model_validator

from app.utils.pydantic_custom_types import ShortStr

LANGUAGE_NAME_BY_LOCALE: Mapping[str, str] = {
    "ar": "Arabic",
    "de": "German",
    "en": "English",
    "es": "Spanish",
    "fr": "French",
    "he": "Hebrew",
    "hi": "Romanized Hindi",
    "id": "Indonesian",
    "it": "Italian",
    "ja": "Japanese",
    "ko": "Korean",
    "nl": "Dutch",
    "pl": "Polish",
    "pt": "Portuguese",
    "ru": "Russian",
    "sv": "Swedish",
    "th": "Thai",
    "tr": "Turkish",
    "uk": "Ukrainian",
    "vi": "Vietnamese",
    "zh": "Chinese",
}


class Traduction(BaseModel):
    locale: ShortStr
    name: ShortStr = Field(init=False)

    @model_validator(mode="before")
    @classmethod
    def validate_and_deduce(
        cls, values: dict[str, object]
    ) -> dict[str, object]:
        if "name" in values:
            raise ValueError(
                "The 'name' field must not be provided explicitly."
            )
        locale_value = values.get("locale")
        if not isinstance(locale_value, str):
            raise TypeError("The 'locale' field must be a string.")
        if locale_value not in LANGUAGE_NAME_BY_LOCALE:
            raise ValueError(f"Unsupported locale: {locale_value!r}")
        values["name"] = LANGUAGE_NAME_BY_LOCALE[locale_value]
        return values
