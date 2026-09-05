#!/usr/bin/env python3
"""Restore YAHUAH / Yahushua on public-domain English (KJV + WEB deuterocanon).

The branded "YAH Scriptures" translation is all-rights-reserved, so this does not
copy that edition. It restores the Name on the public-domain English already in
public/bible, in the YAH Scriptures manner:

  YHWH / LORD / Jehovah / God (the Creator) → YAHUAH
  Jesus / Christ                              → Yahushua / Messiah
  gods (other mighty ones)                    → elohim
  Lord (Adonai / Kyrios)                      → Master  (OT "the Lord" that is YHWH → YAHUAH)

YAHUAH is the unique Name of the Creator. elohim is left only for other
heavenly/mighty ones. The Name is always spelled in all caps: YAHUAH.

Verse wording is otherwise left as in the source. Idempotent.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BIBLE = ROOT / "public" / "bible"

OT = {
    "genesis", "exodus", "leviticus", "numbers", "deuteronomy", "joshua",
    "judges", "ruth", "1-samuel", "2-samuel", "1-kings", "2-kings",
    "1-chronicles", "2-chronicles", "ezra", "nehemiah", "esther", "job",
    "psalms", "proverbs", "ecclesiastes", "song-of-songs", "isaiah",
    "jeremiah", "lamentations", "ezekiel", "daniel", "hosea", "joel",
    "amos", "obadiah", "jonah", "micah", "nahum", "habakkuk", "zephaniah",
    "haggai", "zechariah", "malachi",
}
DEUTERO = {
    "tobit", "judith", "wisdom", "sirach", "baruch", "letter-of-jeremiah",
    "1-esdras", "ezra-sutuel", "enoch", "jubilees",
}

# Longer phrases first.
PHRASES = [
    ("Holy Ghost", "Set-apart Spirit"),
    ("Holy Spirit", "Set-apart Spirit"),
    ("Jesus Christ", "Yahushua the Messiah"),
    ("Christ Jesus", "the Messiah Yahushua"),
    ("Lord Jesus", "Master Yahushua"),
    ("Jesus'", "Yahushua's"),
    ("John the Baptist", "Yohanan the Immerser"),
    ("Jehovahjireh", "YAHUAH-Yireh"),
    ("Jehovahnissi", "YAHUAH-Nissi"),
    ("Jehovahshalom", "YAHUAH-Shalom"),
    ("Jehovahtsidkenu", "YAHUAH-Tsidkenu"),
    ("Jehovahshammah", "YAHUAH-Shammah"),
    ("The LORD God", "YAHUAH"),
    ("the LORD God", "YAHUAH"),
    ("LORD God", "YAHUAH"),
    ("The LORD GOD", "YAHUAH"),
    ("the LORD GOD", "YAHUAH"),
    ("LORD GOD", "YAHUAH"),
    ("the Lord GOD", "YAHUAH"),
    ("The Lord GOD", "YAHUAH"),
    ("Lord GOD", "YAHUAH"),
    ("the Lord God", "YAHUAH"),
    ("Lord God", "YAHUAH"),
    ("The LORD JEHOVAH", "YAHUAH"),
    ("the LORD JEHOVAH", "YAHUAH"),
    ("LORD JEHOVAH", "YAHUAH"),
    ("The LORD'S", "YAHUAH's"),
    ("the LORD'S", "YAHUAH's"),
    ("The LORD's", "YAHUAH's"),
    ("the LORD's", "YAHUAH's"),
    ("The LORD", "YAHUAH"),
    ("the LORD", "YAHUAH"),
]

WORD_MAP = [
    ("JEHOVAH", "YAHUAH"),
    ("Jehovah", "YAHUAH"),
    ("JESUS", "Yahushua"),
    ("Jesus", "Yahushua"),
    ("Christians", "believers"),
    ("Christian", "believer"),
    ("Christ's", "the Messiah's"),
    ("Christs", "Messiahs"),
    ("Christ", "Messiah"),
    ("LORD'S", "YAHUAH's"),
    ("LORD's", "YAHUAH's"),
    ("LORD", "YAHUAH"),
    ("GOD'S", "YAHUAH's"),
    ("GOD's", "YAHUAH's"),
    ("GOD", "YAHUAH"),
    ("God's", "YAHUAH's"),
    ("God", "YAHUAH"),
    ("gods", "elohim"),
    ("Gods", "elohim"),
    ("churches", "assemblies"),
    ("Churches", "Assemblies"),
    ("church", "assembly"),
    ("Church", "Assembly"),
    ("baptized", "immersed"),
    ("Baptized", "Immersed"),
    ("baptize", "immerse"),
    ("Baptize", "Immerse"),
    ("baptism", "immersion"),
    ("Baptism", "Immersion"),
    ("Baptist", "Immerser"),
]

# Restored personal / place names used throughout the YAH Scriptures canon.
NAMES = [
    ("Joshua", "Yahoshua"),
    ("Isaiah", "Yeshayahu"),
    ("Jeremiah", "Yirmeyahu"),
    ("Ezekiel", "Yehezqel"),
    ("Daniel", "Dani'el"),
    ("Hosea", "Hoshea"),
    ("Joel", "Yo'el"),
    ("Obadiah", "Obadyah"),
    ("Jonah", "Yonah"),
    ("Micah", "Mikah"),
    ("Habakkuk", "Habaqquq"),
    ("Zephaniah", "Tsephanyah"),
    ("Zechariah", "Zekaryah"),
    ("Malachi", "Mal'aki"),
    ("Elijah", "Eliyahu"),
    ("Elisha", "Elisha"),
    ("Samuel", "Shemu'el"),
    ("Solomon", "Shelomoh"),
    ("Moses", "Mosheh"),
    ("Abraham", "Abraham"),
    ("Isaac", "Yitschaq"),
    ("Jacob", "Ya'aqob"),
    ("Israelites", "Yisra'elites"),
    ("Israelite", "Yisra'elite"),
    ("Israel's", "Yisra'el's"),
    ("Israel", "Yisra'el"),
    ("Judah", "Yehudah"),
    ("Jerusalem", "Yerushalayim"),
    ("David's", "Dawid's"),
    ("David", "Dawid"),
    ("Mary", "Miryam"),
    ("Joseph", "Yoseph"),
    ("John's", "Yohanan's"),
    ("John", "Yohanan"),
    ("James", "Ya'aqob"),
    ("Peter", "Kepha"),
    ("Paul's", "Sha'ul's"),
    ("Paul", "Sha'ul"),
    ("Matthew", "Mattithyahu"),
    ("Mark", "Marqos"),
    ("Luke", "Luqas"),
    ("Jews", "Yehudim"),
    ("Jew", "Yehudi"),
    ("Gentiles", "nations"),
    ("Gentile", "nation"),
    ("Egyptians", "Mitsrim"),
    ("Egyptian", "Mitsri"),
    ("Egypt", "Mitsrayim"),
    ("Babylon", "Babel"),
    ("Hebrews", "Ibrim"),
    ("Hebrew", "Ibri"),
    ("Saul", "Sha'ul"),
    ("Nathan", "Nathan"),
    ("Baruch", "Baruk"),
    ("Tobit", "Tobiyah"),
    ("Judith", "Yahudith"),
    ("Enoch", "Hanok"),
]


def sub_word(text: str, src: str, dst: str) -> str:
    return re.sub(rf"\b{re.escape(src)}\b", dst, text)


def restore(text: str, book_id: str) -> str:
    def braces(m: re.Match[str]) -> str:
        inner = m.group(1)
        # Translator glosses vs supplied italic words.
        if ":" in inner or "Heb" in inner or len(inner) > 28:
            return ""
        return inner

    text = re.sub(r"\{([^}]*)\}", braces, text)
    text = text.replace("you⌃", "you").replace("You⌃", "You")
    text = re.sub(r"\s+", " ", text).strip()

    for src, dst in PHRASES:
        text = text.replace(src, dst)

    corpus = "nt"
    if book_id in OT:
        corpus = "ot"
    elif book_id in DEUTERO:
        corpus = "deutero"

    if corpus in ("ot", "deutero"):
        # Remaining "the Lord" in OT/deuterocanon is almost always YHWH
        # (Psalm 23 and WEB deuterocanon lost small-caps LORD).
        text = re.sub(r"\bthe Lord\b", "YAHUAH", text)
        text = re.sub(r"\bThe Lord\b", "YAHUAH", text)
        text = re.sub(r"\bmy Lord\b", "my Master", text)
        text = re.sub(r"\bMy Lord\b", "My Master", text)
        text = re.sub(r"\bLord's\b", "YAHUAH's", text)
        text = re.sub(r"\bLords\b", "Masters", text)
        text = sub_word(text, "Lord", "YAHUAH")
    else:
        text = re.sub(r"\bthe Lord\b", "the Master", text)
        text = re.sub(r"\bThe Lord\b", "The Master", text)
        text = re.sub(r"\bmy Lord\b", "my Master", text)
        text = re.sub(r"\bLord's\b", "Master's", text)
        text = sub_word(text, "Lord", "Master")

    for src, dst in WORD_MAP:
        text = sub_word(text, src, dst)

    for src, dst in NAMES:
        if src == dst:
            continue
        text = sub_word(text, src, dst)

    # Creator only: never leave Elohim on the unique Name.
    text = sub_word(text, "Elohim's", "YAHUAH's")
    text = sub_word(text, "Elohim", "YAHUAH")
    text = re.sub(r"\bYAHUAH(?:\s+YAHUAH)+\b", "YAHUAH", text)
    text = re.sub(r"\bthe YAHUAH\b", "YAHUAH", text)
    text = re.sub(r"\bThe YAHUAH\b", "YAHUAH", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def main() -> None:
    changed_verses = 0
    files = 0
    samples = []
    want = {
        ("genesis", 1, 1),
        ("genesis", 2, 4),
        ("exodus", 3, 15),
        ("exodus", 6, 3),
        ("psalms", 23, 1),
        ("psalms", 110, 1),
        ("isaiah", 12, 2),
        ("matthew", 1, 1),
        ("matthew", 1, 21),
        ("john", 1, 1),
        ("john", 1, 17),
        ("john", 3, 16),
        ("philippians", 2, 11),
        ("acts", 2, 36),
    }
    for path in sorted(BIBLE.glob("*.json")):
        data = json.loads(path.read_text())
        book_id = path.stem
        mutated = False
        for chapter in data.get("chapters", []):
            for verse in chapter.get("verses", []):
                old = verse.get("en", "")
                new = restore(old, book_id)
                if new != old:
                    verse["en"] = new
                    mutated = True
                    changed_verses += 1
                key = (book_id, chapter.get("number"), verse.get("n"))
                if key in want:
                    samples.append((key, new))
        if mutated:
            path.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
            files += 1
    print(f"restored {changed_verses} verses in {files} books")
    for key, text in samples:
        print(f"{key[0]} {key[1]}:{key[2]}")
        print(" ", text)


if __name__ == "__main__":
    main()
