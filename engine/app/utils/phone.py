import phonenumbers
from phonenumbers import (
    PhoneNumberFormat,
    country_code_for_region,
    format_number,
)


def to_international_format(raw_number: str, region_code: str) -> str:
    try:
        number = phonenumbers.parse(raw_number, region_code)

        if phonenumbers.is_valid_number(number):
            return format_number(number, PhoneNumberFormat.INTERNATIONAL)
        else:
            raise ValueError("Number is not valid")

    except Exception:
        try:
            country_code = country_code_for_region(region_code.upper())
            if not country_code:
                raise ValueError("Invalid region code")

            return f"+{country_code} {raw_number}"
        except Exception as e:
            return f"Error: {e}"
