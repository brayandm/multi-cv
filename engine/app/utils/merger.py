import copy
from typing import Any, Dict, List


def merge_dicts(
    existing: Dict[str, Any], new: Dict[str, Any], preserve_keys: List[str]
) -> Dict[str, Any]:
    merged = copy.deepcopy(existing)

    for key, value in new.items():
        if key in preserve_keys:
            continue

        if isinstance(value, dict) and isinstance(merged.get(key), dict):
            merged[key] = merge_dicts(merged[key], value, preserve_keys)
        elif isinstance(value, list) and isinstance(merged.get(key), list):
            merged[key] = merge_lists(merged[key], value, preserve_keys)
        else:
            merged[key] = value

    return merged


def merge_lists(
    existing_list: List[Dict[str, Any]],
    new_list: List[Dict[str, Any]],
    preserve_keys: List[str],
) -> List[Dict[str, Any]]:
    merged_list = copy.deepcopy(existing_list)

    for i, new_item in enumerate(new_list):
        if (
            i < len(merged_list)
            and isinstance(merged_list[i], dict)
            and isinstance(new_item, dict)
        ):
            merged_list[i] = merge_dicts(
                merged_list[i], new_item, preserve_keys
            )
        else:
            merged_list.append(new_item)

    return merged_list
