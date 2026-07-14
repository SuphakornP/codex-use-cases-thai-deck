#!/usr/bin/env python3
"""Validate and merge official metadata with the bilingual presentation copy."""

from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
SOURCE_PATH = DATA_DIR / "source-usecases.json"
TRANSLATION_PATHS = [DATA_DIR / f"usecases-th-{part}.json" for part in ("01", "02", "03")]
EN_TRANSLATION_PATHS = [DATA_DIR / f"usecases-en-{part}.json" for part in ("01", "02", "03")]
OUTPUT_PATH = DATA_DIR / "usecases-data.js"
CATEGORIES = {
    "งานประจำ": {"id": "everyday-work", "en": "Everyday work"},
    "ข้อมูลและการตัดสินใจ": {"id": "data-decisions", "en": "Data and decisions"},
    "การเงินและกลยุทธ์": {"id": "finance-strategy", "en": "Finance and strategy"},
    "การขายและปฏิบัติการ": {"id": "sales-operations", "en": "Sales and operations"},
    "การศึกษาและอาชีพ": {"id": "education-career", "en": "Education and career"},
    "ออกแบบและสร้าง": {"id": "design-build", "en": "Design and build"},
    "วิศวกรรมซอฟต์แวร์": {"id": "software-engineering", "en": "Software engineering"},
    "วิทยาศาสตร์และความปลอดภัย": {"id": "science-security", "en": "Science and security"},
}
TH_TRANSLATION_KEYS = {
    "index",
    "slug",
    "titleTh",
    "titleEn",
    "summaryTh",
    "categoryTh",
    "workflow",
    "promptTh",
    "checkTh",
}
EN_TRANSLATION_KEYS = {"index", "slug", "workflowEn", "checkEn"}


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def validate_workflow(
    index: int, workflow: object, field: str, *, max_detail_length: int | None = None
) -> None:
    if not isinstance(workflow, list) or len(workflow) != 4:
        raise ValueError(f"Index {index}: {field} must contain exactly four steps")
    for step in workflow:
        if set(step) != {"label", "detail"}:
            raise ValueError(f"Index {index}: invalid {field} step")
        for key in ("label", "detail"):
            if not isinstance(step[key], str) or not step[key].strip():
                raise ValueError(f"Index {index}: {field} {key} must be a non-empty string")
        if max_detail_length is not None and len(step["detail"]) > max_detail_length:
            raise ValueError(
                f"Index {index}: {field} detail exceeds {max_detail_length} characters"
            )


def validate_th_translation(item: dict, source: dict) -> None:
    index = item.get("index")
    if set(item) != TH_TRANSLATION_KEYS:
        raise ValueError(f"Index {index}: Thai translation keys do not match the deck schema")
    if item["slug"] != source["slug"] or item["titleEn"] != source["title"]:
        raise ValueError(f"Index {index}: source identity mismatch")
    if item["categoryTh"] not in CATEGORIES:
        raise ValueError(f"Index {index}: unsupported category {item['categoryTh']}")
    validate_workflow(index, item["workflow"], "workflow")
    for key in ("titleTh", "summaryTh", "promptTh", "checkTh"):
        if not isinstance(item[key], str) or not item[key].strip():
            raise ValueError(f"Index {index}: missing {key}")


def validate_en_translation(item: dict, source: dict) -> None:
    index = item.get("index")
    if set(item) != EN_TRANSLATION_KEYS:
        raise ValueError(f"Index {index}: English translation keys do not match the deck schema")
    if item["slug"] != source["slug"]:
        raise ValueError(f"Index {index}: English source identity mismatch")
    validate_workflow(index, item["workflowEn"], "workflowEn", max_detail_length=140)
    if not isinstance(item["checkEn"], str) or not item["checkEn"].strip():
        raise ValueError(f"Index {index}: missing checkEn")
    for key in ("title", "summary", "starterPrompt"):
        if not isinstance(source.get(key), str) or not source[key].strip():
            raise ValueError(f"Index {index}: official source is missing {key}")


def main() -> None:
    source_payload = load_json(SOURCE_PATH)
    source_items = source_payload["useCases"]
    translations_th = []
    for path in TRANSLATION_PATHS:
        translations_th.extend(load_json(path))
    translations_en = []
    for path in EN_TRANSLATION_PATHS:
        translations_en.extend(load_json(path))

    translations_th.sort(key=lambda item: item["index"])
    translations_en.sort(key=lambda item: item["index"])
    counts = (len(source_items), len(translations_th), len(translations_en))
    if counts != (99, 99, 99):
        raise ValueError(f"Expected 99 source, Thai, and English records, got {counts}")
    expected_indices = list(range(99))
    if [item["index"] for item in translations_th] != expected_indices:
        raise ValueError("Thai translation indices must be contiguous from 0 through 98")
    if [item["index"] for item in translations_en] != expected_indices:
        raise ValueError("English translation indices must be contiguous from 0 through 98")

    merged = []
    for source, translation_th, translation_en in zip(
        source_items, translations_th, translations_en, strict=True
    ):
        if source["index"] != translation_th["index"] or source["index"] != translation_en["index"]:
            raise ValueError(f"Index order mismatch at {source['index']}")
        validate_th_translation(translation_th, source)
        validate_en_translation(translation_en, source)
        category = CATEGORIES[translation_th["categoryTh"]]
        merged.append(
            {
                "index": source["index"],
                "slug": source["slug"],
                "titleTh": translation_th["titleTh"],
                "titleEn": source["title"],
                "summaryTh": translation_th["summaryTh"],
                "summaryEn": source["summary"],
                "categoryId": category["id"],
                "categoryTh": translation_th["categoryTh"],
                "categoryEn": category["en"],
                "workflowTh": translation_th["workflow"],
                "workflowEn": translation_en["workflowEn"],
                "promptTh": translation_th["promptTh"],
                "promptEn": source["starterPrompt"],
                "checkTh": translation_th["checkTh"],
                "checkEn": translation_en["checkEn"],
                "difficulty": source["difficulty"],
                "time": source["time"],
                "tags": source["tags"],
                "image": source["image"],
                "url": source["url"],
            }
        )

    serialized = json.dumps(merged, ensure_ascii=False, separators=(",", ":"))
    banner = (
        "// Generated by scripts/build_deck_data.py from official OpenAI source metadata "
        "and reviewed Thai/English presentation copy.\n"
    )
    OUTPUT_PATH.write_text(f"{banner}window.USE_CASES={serialized};\n", encoding="utf-8")
    print(f"Built {len(merged)} slides in {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
