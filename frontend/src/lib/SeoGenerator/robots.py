from typing import List, TypedDict
import json
from pathlib import Path

BASE_URL = "https://multicv.space"
OUTPUT_FILE = "public/robots.txt"


class Route(TypedDict):
    path: str
    priority: float
    changefreq: str


class SitemapData(TypedDict):
    languages: List[str]
    routes: List[Route]


def generate_robots_txt(data: SitemapData) -> str:
    disallow_rules = [
        "User-agent: *",
        "Disallow: /",
        "Disallow: /*?callbackUrl=",
        "",
    ]

    # Routes only available without language prefix (for now)
    non_localized_paths = [
        "/privacy-policy",
        "/terms-and-conditions",
        "/cookies-policy",
    ]

    # Routes that are available with language prefixes
    localized_paths = [
        "/login",
        "/register",
    ]

    # Shared single-version routes
    shared_paths = [
        "/favicon.ico",
        "/sitemap.xml",
    ]

    allow_rules: List[str] = []

    # ✅ First: Allow root
    allow_rules.append("Allow: /$")

    # ✅ Then: Base language paths like /es/, /ru/
    for lang in data["languages"]:
        if lang == "en":
            continue
        allow_rules.append(f"Allow: /{lang}/")
    allow_rules.append("")

    # Shared non-localized paths
    for path in shared_paths:
        allow_rules.append(f"Allow: {path}")
    allow_rules.append("")

    # English-only paths
    for path in non_localized_paths:
        allow_rules.append(f"Allow: {path}")
    allow_rules.append("")

    # Localized paths with versions per language
    for path in localized_paths:
        allow_rules.append(f"Allow: {path}")  # default (en)
        for lang in data["languages"]:
            if lang == "en":
                continue
            lang_path = f"/{lang}{path}"
            allow_rules.append(f"Allow: {lang_path}")
        allow_rules.append("")  # spacing

    # Sitemap link
    sitemap_line = f"Sitemap: {BASE_URL}/sitemap.xml"

    return "\n".join(disallow_rules + allow_rules + [sitemap_line])


if __name__ == "__main__":
    BASE_DIR = Path(__file__).resolve().parent
    json_path = BASE_DIR / "sites.json"

    with json_path.open("r", encoding="utf-8") as f:
        raw_data = json.load(f)
        data: SitemapData = {
            "languages": raw_data["languages"],
            "routes": raw_data["routes"],
        }

    robots_txt = generate_robots_txt(data)

    with open("./public/robots.txt", "w", encoding="utf-8") as f:
        f.write(robots_txt)

    print("✅ robots.txt successfully generated as 'public/robots.txt'")
