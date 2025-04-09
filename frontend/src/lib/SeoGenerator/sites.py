import json
from typing import Any, Dict, List, TypedDict, NotRequired
from xml.etree.ElementTree import (
    Element,
    SubElement,
    tostring,
    register_namespace,
)
from xml.dom import minidom
from pathlib import Path

BASE_URL = "https://multicv.space"


class Route(TypedDict):
    path: str
    priority: float
    changefreq: str
    localizable: NotRequired[bool]  # optional


class SitemapData(TypedDict):
    languages: List[str]
    routes: List[Route]


def prettify(xml_bytes: bytes) -> str:
    """Return a pretty-printed XML string."""
    return minidom.parseString(xml_bytes).toprettyxml(indent="  ")


def generate_sitemap(data: SitemapData) -> str:
    """Generate the XML sitemap string from given route and language data."""
    # Register xhtml prefix to avoid ns0 in the output
    register_namespace("xhtml", "http://www.w3.org/1999/xhtml")

    urlset: Element = Element(
        "urlset",
        {
            "xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9",
        },
    )

    for route in data["routes"]:
        localizable = route.get("localizable", True)
        url = SubElement(urlset, "url")

        # English (default) route: no prefix
        default_href = f"{BASE_URL}/{route['path']}".replace(
            "//", "/"
        ).replace(":/", "://")
        SubElement(url, "loc").text = default_href

        # hreflang: en
        SubElement(
            url,
            "{http://www.w3.org/1999/xhtml}link",
            {
                "rel": "alternate",
                "hreflang": "en",
                "href": default_href,
            },
        )

        if localizable:
            # hreflang for other languages
            for lang in data["languages"]:
                if lang == "en":
                    continue
                alt_href = f"{BASE_URL}/{lang}{route['path']}".replace(
                    "//", "/"
                ).replace(":/", "://")
                SubElement(
                    url,
                    "{http://www.w3.org/1999/xhtml}link",
                    {
                        "rel": "alternate",
                        "hreflang": lang,
                        "href": alt_href,
                    },
                )

        # hreflang: x-default always goes last
        SubElement(
            url,
            "{http://www.w3.org/1999/xhtml}link",
            {
                "rel": "alternate",
                "hreflang": "x-default",
                "href": default_href,
            },
        )

        SubElement(url, "priority").text = str(route["priority"])
        SubElement(url, "changefreq").text = route["changefreq"]

    xml_bytes = tostring(urlset, encoding="utf-8", method="xml")
    return prettify(xml_bytes)


if __name__ == "__main__":
    BASE_DIR = Path(__file__).resolve().parent
    json_path = BASE_DIR / "sites.json"

    with json_path.open("r", encoding="utf-8") as f:
        raw_data: Dict[str, Any] = json.load(f)
        data: SitemapData = {
            "languages": raw_data["languages"],
            "routes": raw_data["routes"],
        }

    sitemap_xml: str = generate_sitemap(data)

    with open("./public/sitemap.xml", "w", encoding="utf-8") as f:
        f.write(sitemap_xml)

    print("✅ Sitemap successfully generated as 'public/sitemap.xml'")
