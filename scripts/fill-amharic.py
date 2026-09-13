#!/usr/bin/env python3
"""Fill verse.am with Ethiopic Amharic. Never leave English in the traditional field."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BIBLE = ROOT / "public" / "bible"
SRC = Path("/tmp/amharic-src/amharic_bible.json")
ETH = re.compile(r"[\u1200-\u137F]")

# Protestant order, matching magna25/amharic-bible-json
PROTESTANT = [
    "genesis", "exodus", "leviticus", "numbers", "deuteronomy", "joshua",
    "judges", "ruth", "1-samuel", "2-samuel", "1-kings", "2-kings",
    "1-chronicles", "2-chronicles", "ezra", "nehemiah", "esther", "job",
    "psalms", "proverbs", "ecclesiastes", "song-of-songs", "isaiah",
    "jeremiah", "lamentations", "ezekiel", "daniel", "hosea", "joel",
    "amos", "obadiah", "jonah", "micah", "nahum", "habakkuk", "zephaniah",
    "haggai", "zechariah", "malachi", "matthew", "mark", "luke", "john",
    "acts", "romans", "1-corinthians", "2-corinthians", "galatians",
    "ephesians", "philippians", "colossians", "1-thessalonians",
    "2-thessalonians", "1-timothy", "2-timothy", "titus", "philemon",
    "hebrews", "james", "1-peter", "2-peter", "1-john", "2-john", "3-john",
    "jude", "revelation",
]


def is_ethiopic(s: str | None) -> bool:
    return bool(s and ETH.search(s))


def lookup(src_verses: list[str], n: int) -> str:
    if n < 1:
        return ""
    if n <= len(src_verses):
        raw = (src_verses[n - 1] or "").strip()
        if raw:
            return raw
    # Combined-verse rows: text lives on a later number.
    for later in src_verses[n:]:
        raw = (later or "").strip()
        if raw:
            return raw
    return ""


def strip_latin_am(verse: dict) -> None:
    am = verse.get("am") or ""
    if am and not is_ethiopic(am):
        verse["am"] = verse["gez"] if is_ethiopic(verse.get("gez")) else ""


def main() -> None:
    src = json.loads(SRC.read_text(encoding="utf-8"))
    books = src["books"]
    filled = 0
    stripped = 0

    for i, bid in enumerate(PROTESTANT):
        path = BIBLE / f"{bid}.json"
        dest = json.loads(path.read_text(encoding="utf-8"))
        src_chs = books[i]["chapters"]
        for ch in dest["chapters"]:
            idx = ch["number"] - 1
            src_verses: list[str] = []
            if 0 <= idx < len(src_chs):
                src_verses = src_chs[idx].get("verses") or []
            for verse in ch["verses"]:
                raw = lookup(src_verses, verse["n"])
                if is_ethiopic(raw):
                    verse["am"] = raw
                    filled += 1
                else:
                    before = verse.get("am") or ""
                    strip_latin_am(verse)
                    if before and before != verse.get("am"):
                        stripped += 1
        path.write_text(json.dumps(dest, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")

    for path in sorted(BIBLE.glob("*.json")):
        if path.stem in PROTESTANT:
            continue
        dest = json.loads(path.read_text(encoding="utf-8"))
        changed = False
        for ch in dest["chapters"]:
            for verse in ch["verses"]:
                before = verse.get("am") or ""
                strip_latin_am(verse)
                if before != verse.get("am"):
                    changed = True
                    stripped += 1
        if changed:
            path.write_text(json.dumps(dest, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")

    print(f"filled amharic {filled}, stripped latin am {stripped}")


if __name__ == "__main__":
    main()
