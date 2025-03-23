def get_first_name_last_name(first_name: str, last_name: str) -> str:
    first = first_name.strip().split()[0].capitalize()
    last = last_name.strip().split()[0].capitalize()

    return f"{first}{last}"
