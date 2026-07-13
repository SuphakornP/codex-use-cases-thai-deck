#!/usr/bin/env python3
"""Build a local, source-linked inventory from the official OpenAI use-case pages."""

from __future__ import annotations

import json
import re
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from bs4 import BeautifulSoup, Tag
import requests


BASE_URL = "https://learn.chatgpt.com"
INDEX_URL = f"{BASE_URL}/use-cases"
ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "data" / "source-usecases.json"
IMAGE_DIR = ROOT / "assets" / "use-cases"
USER_AGENT = "Mozilla/5.0 (compatible; CodexUseCaseDeck/1.0)"


def clean(value: str) -> str:
    return " ".join(value.split())


def fetch(url: str, retries: int = 3) -> bytes:
    for attempt in range(retries):
        try:
            response = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=30)
            response.raise_for_status()
            return response.content
        except (requests.RequestException, TimeoutError):
            if attempt == retries - 1:
                raise
            time.sleep(0.7 * (attempt + 1))
    raise RuntimeError(f"Failed to fetch {url}")


def section_items(section: Tag | None) -> list[str]:
    if section is None:
        return []
    return [clean(item.get_text(" ", strip=True)) for item in section.find_all("li")]


def find_section(soup: BeautifulSoup, heading: str) -> Tag | None:
    node = soup.find("h2", string=lambda value: value and clean(value) == heading)
    return node.find_parent("section") if node else None


def extract_prompt(soup: BeautifulSoup) -> str:
    section = find_section(soup, "Starter prompt")
    if section is None:
        return ""
    prompt = section.select_one(".prompt-scroll__content")
    if prompt:
        return prompt.get_text("\n", strip=True)
    island = section.find("astro-island", attrs={"props": True})
    if island:
        match = re.search(r'"copyValue":\[0,"((?:[^"\\]|\\.)*)"\]', island["props"])
        if match:
            return json.loads(f'"{match.group(1)}"')
    return ""


def extract_workflow(soup: BeautifulSoup) -> list[dict[str, object]]:
    prompt_heading = soup.find("h2", string=lambda value: value and clean(value) == "Starter prompt")
    if prompt_heading is None:
        return []

    sections: list[dict[str, object]] = []
    start_section = prompt_heading.find_parent("section")
    for section in start_section.find_all_next("section"):
        heading = section.find("h2")
        if heading is None:
            continue
        title = clean(heading.get_text(" ", strip=True))
        if title == "Related use cases":
            break
        if title in {"Best for", "Skills & Plugins", "Starter prompt"}:
            continue
        paragraphs = [clean(node.get_text(" ", strip=True)) for node in section.find_all("p")]
        items = section_items(section)
        if paragraphs or items:
            sections.append({"title": title, "paragraphs": paragraphs, "items": items})
    return sections


def extract_meta_value(soup: BeautifulSoup, label: str) -> str:
    node = soup.find("span", string=lambda value: value and clean(value) == label)
    if node is None:
        return ""
    strong = node.find_next_sibling("strong")
    return clean(strong.get_text(" ", strip=True)) if strong else ""


def parse_detail(card: dict[str, object]) -> dict[str, object]:
    html = fetch(str(card["url"])).decode("utf-8")
    soup = BeautifulSoup(html, "html.parser")
    first_h1 = soup.find("h1", string=lambda value: value and clean(value) == card["title"])
    hero_paragraphs = []
    if first_h1:
        for node in first_h1.find_all_next("p", limit=2):
            hero_paragraphs.append(clean(node.get_text(" ", strip=True)))

    card.update(
        {
            "tagline": hero_paragraphs[0] if hero_paragraphs else card["tagline"],
            "summary": hero_paragraphs[1] if len(hero_paragraphs) > 1 else card["tagline"],
            "difficulty": extract_meta_value(soup, "Difficulty"),
            "time": extract_meta_value(soup, "Time horizon"),
            "bestFor": section_items(find_section(soup, "Best for")),
            "starterPrompt": extract_prompt(soup),
            "workflow": extract_workflow(soup),
        }
    )
    return card


def save_image(card: dict[str, object]) -> None:
    image_url = str(card["imageUrl"])
    if not image_url:
        return
    destination = IMAGE_DIR / f"{card['slug']}.webp"
    if not destination.exists():
        destination.write_bytes(fetch(image_url))
    card["image"] = f"assets/use-cases/{destination.name}"


def main() -> None:
    index_html = fetch(INDEX_URL).decode("utf-8")
    soup = BeautifulSoup(index_html, "html.parser")
    cards: list[dict[str, object]] = []

    for node in soup.select("[data-codex-use-case-card]"):
        link = node.find("a", href=re.compile(r"^/codex/use-cases/[^/]+$"))
        title = node.find("h3")
        tagline = node.find("p")
        image = node.find("img")
        if not link or not title or not tagline:
            continue
        slug = str(link["href"]).rstrip("/").split("/")[-1]
        tags = [clean(tag.get_text(" ", strip=True)) for tag in node.select("span")]
        cards.append(
            {
                "index": int(node.get("data-sort-recommended-index", len(cards))),
                "slug": slug,
                "title": clean(title.get_text(" ", strip=True)),
                "tagline": clean(tagline.get_text(" ", strip=True)),
                "tags": tags,
                "url": f"{BASE_URL}/use-cases/{slug}",
                "canonicalUrl": f"{BASE_URL}/codex/use-cases/{slug}",
                "imageUrl": f"{BASE_URL}{image['src']}" if image and image.get("src") else "",
            }
        )

    cards.sort(key=lambda card: int(card["index"]))
    if len(cards) != 99:
        raise RuntimeError(f"Expected 99 official use cases, found {len(cards)}")

    completed: list[dict[str, object]] = []
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = {executor.submit(parse_detail, dict(card)): card["slug"] for card in cards}
        for future in as_completed(futures):
            completed.append(future.result())

    completed.sort(key=lambda card: int(card["index"]))
    IMAGE_DIR.mkdir(parents=True, exist_ok=True)
    with ThreadPoolExecutor(max_workers=10) as executor:
        list(executor.map(save_image, completed))

    payload = {
        "source": INDEX_URL,
        "retrievedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "count": len(completed),
        "useCases": completed,
    }
    DATA_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Saved {len(completed)} use cases to {DATA_PATH}")


if __name__ == "__main__":
    main()
