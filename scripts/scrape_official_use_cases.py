#!/usr/bin/env python3
"""Build a local, source-linked inventory from the official OpenAI use-case pages."""

from __future__ import annotations

import json
import re
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from copy import deepcopy
from pathlib import Path
from urllib.parse import parse_qs, urljoin, urlsplit
from bs4 import BeautifulSoup, Tag
import requests


BASE_URL = "https://learn.chatgpt.com"
INDEX_URL = f"{BASE_URL}/use-cases"
ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "data" / "source-usecases.json"
IMAGE_DIR = ROOT / "assets" / "use-cases"
USER_AGENT = "Mozilla/5.0 (compatible; CodexUseCaseDeck/1.0)"
EXPECTED_COUNT = 121
USE_CASE_PATH = re.compile(r"^/(?:codex/)?use-cases/[^/]+$")


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


def extract_code_block(node: Tag) -> str:
    code = deepcopy(node)
    for line_numbers in code.select('span.syntax-highlighter-line-numbers[aria-hidden="true"]'):
        line_numbers.decompose()
    return code.get_text()


def extract_workflow(soup: BeautifulSoup, page_title: str) -> list[dict[str, object]]:
    prompt_heading = soup.find("h2", string=lambda value: value and clean(value) == "Starter prompt")
    best_for_headings = soup.find_all(
        "h2", string=lambda value: value and clean(value) == "Best for"
    )
    start_heading = prompt_heading or (best_for_headings[-1] if best_for_headings else None)
    if start_heading is None:
        return []

    sections: dict[str, dict[str, object]] = {}
    start_section = start_heading.find_parent("section")
    for section in start_section.find_all_next("section"):
        heading = section.find("h2")
        if heading is None and section.get("id") != "useCaseMarkdownContent":
            continue
        title = clean(heading.get_text(" ", strip=True)) if heading else page_title
        if title == "Related use cases":
            break
        if title in {"Best for", "Skills & Plugins", "Starter prompt"}:
            continue
        paragraphs = [clean(node.get_text(" ", strip=True)) for node in section.find_all("p")]
        items = section_items(section)
        code_blocks = (
            [extract_code_block(node) for node in section.find_all("pre")]
            if section.get("id") == "useCaseMarkdownContent" else []
        )
        if heading is None:
            paragraphs = [p for p in paragraphs if p]
        if paragraphs or items or code_blocks:
            record = {"title": title, "paragraphs": paragraphs, "items": items}
            signature = json.dumps(record, ensure_ascii=False, sort_keys=True)
            record = sections.setdefault(signature, record)
            if code_blocks:
                record["codeBlocks"] = code_blocks
    return list(sections.values())


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
    canonical = soup.find("link", rel="canonical", href=True)
    hero_paragraphs = []
    if first_h1:
        for node in first_h1.find_all_next("p", limit=2):
            hero_paragraphs.append(clean(node.get_text(" ", strip=True)))

    card.update(
        {
            "canonicalUrl": str(canonical["href"]) if canonical else card["canonicalUrl"],
            "tagline": hero_paragraphs[0] if hero_paragraphs else card["tagline"],
            "summary": hero_paragraphs[1] if len(hero_paragraphs) > 1 else card["tagline"],
            "difficulty": extract_meta_value(soup, "Difficulty"),
            "time": extract_meta_value(soup, "Time horizon"),
            "bestFor": section_items(find_section(soup, "Best for")),
            "starterPrompt": extract_prompt(soup),
            "workflow": extract_workflow(soup, str(card["title"])),
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


def find_catalog_url(soup: BeautifulSoup) -> str:
    for link in soup.select("main a[href]"):
        url = urljoin(INDEX_URL, str(link["href"]))
        if (
            clean(link.get_text(" ", strip=True)) == "Browse all use cases"
            and url == f"{BASE_URL}/use-cases/all"
        ):
            return url
    raise RuntimeError("Official landing page has no recognized Browse all use cases link")


def extract_image_urls(soup: BeautifulSoup) -> dict[str, str]:
    images = {}
    for image in soup.select("img[src]"):
        url = urljoin(BASE_URL, str(image["src"]))
        parts = urlsplit(url)
        if parts.netloc == urlsplit(BASE_URL).netloc and re.fullmatch(
            r"/codex/use-cases/[^/]+\.webp", parts.path
        ):
            images[Path(parts.path).stem] = url
    return images


def parse_cards(
    soup: BeautifulSoup,
    previous_cards: dict[str, dict[str, object]],
    image_urls: dict[str, str],
) -> list[dict[str, object]]:
    labels: dict[str, dict[str, str]] = {"category": {}, "task_type": {}}
    for link in soup.select("a[data-use-case-filter-link][data-filter-value][data-filter-label]"):
        value = str(link["data-filter-value"])
        query = parse_qs(urlsplit(str(link.get("href", ""))).query)
        for dimension in labels:
            if query.get(dimension) == [value]:
                labels[dimension][value] = clean(str(link["data-filter-label"]))
    cards: list[dict[str, object]] = []
    for node in soup.select("[data-codex-use-case-card]"):
        link = node.find("a", href=USE_CASE_PATH)
        if link is None:
            raise RuntimeError("Official use-case card has no recognized detail link")
        title = node.find("h3")
        tagline = node.find("p")
        image = node.find("img")
        if node.name == "li":
            text_group = link.find("span", recursive=False)
            fields = text_group.find_all("span", recursive=False) if text_group else []
            if len(fields) != 2:
                raise RuntimeError(f"Unrecognized use-case list text: {link['href']}")
            title, tagline = fields
            tags = []
            for dimension in labels:
                values = str(node.get(f"data-{dimension}", "")).split()
                if not values or any(value not in labels[dimension] for value in values):
                    raise RuntimeError(f"Unmapped official {dimension} labels: {link['href']}")
                tags.extend(labels[dimension][value] for value in values)
            # Legacy cards showed the first two labels from categories, then task types.
            tags = tags[:2]
        else:
            tags = [clean(tag.get_text(" ", strip=True)) for tag in node.select("span")]
        if title is None or tagline is None:
            raise RuntimeError(f"Official use-case card has no title or tagline: {link['href']}")
        slug = str(link["href"]).rstrip("/").split("/")[-1]
        image_url = (
            urljoin(BASE_URL, str(image["src"])) if image and image.get("src")
            else image_urls.get(slug) or str(previous_cards.get(slug, {}).get("imageUrl", ""))
        )
        if not image_url:
            raise RuntimeError(f"No evidenced illustration URL for official use case: {slug}")
        cards.append(
            {
                "index": int(node.get("data-sort-recommended-index", len(cards))),
                "slug": slug,
                "title": clean(title.get_text(" ", strip=True)),
                "tagline": clean(tagline.get_text(" ", strip=True)),
                "tags": tags,
                "url": f"{BASE_URL}/use-cases/{slug}",
                "canonicalUrl": f"{BASE_URL}/use-cases/{slug}",
                "imageUrl": image_url,
            }
        )

    cards.sort(key=lambda card: int(card["index"]))
    if len({card["slug"] for card in cards}) != len(cards):
        raise RuntimeError("Official inventory contains duplicate use-case slugs")
    return cards


def main() -> None:
    previous_cards = {}
    if DATA_PATH.exists():
        previous_cards = {card["slug"]: card for card in json.loads(DATA_PATH.read_text())["useCases"]}
    soup = BeautifulSoup(fetch(INDEX_URL).decode("utf-8"), "html.parser")
    image_urls = extract_image_urls(soup)
    if not soup.select("[data-codex-use-case-card]"):
        soup = BeautifulSoup(fetch(find_catalog_url(soup)).decode("utf-8"), "html.parser")
        image_urls.update(extract_image_urls(soup))
    cards = parse_cards(soup, previous_cards, image_urls)
    if len(cards) != EXPECTED_COUNT:
        raise RuntimeError(f"Expected {EXPECTED_COUNT} official use cases, found {len(cards)}")

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
