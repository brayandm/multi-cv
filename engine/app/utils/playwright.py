from playwright.async_api import async_playwright, Browser

_browser = None
_playwright = None


async def get_browser() -> Browser:
    global _browser, _playwright
    if not _browser:
        _playwright = await async_playwright().start()
        _browser = await _playwright.chromium.launch()
    return _browser


async def close_browser() -> None:
    global _browser, _playwright
    if _browser:
        await _browser.close()
        _browser = None
    if _playwright:
        await _playwright.stop()
        _playwright = None
