#!/usr/bin/env python3
"""Build per-book JSON for the Tewahedo observatory from public-domain KJV + WEB.

After generating books, run restore-yah-names.py so English uses YAHUAH / Yahushua.
"""
from __future__ import annotations

import json
import re
from html import unescape
from pathlib import Path

ROOT = Path("/workspace")
SRC = Path("/tmp/bible-src")
OUT = ROOT / "public" / "bible"
CANON_TS = ROOT / "src" / "lib" / "bible" / "catalog.ts"
OUT.mkdir(parents=True, exist_ok=True)

KJV_NAME_TO_ID = {
    "Genesis": "genesis",
    "Exodus": "exodus",
    "Leviticus": "leviticus",
    "Numbers": "numbers",
    "Deuteronomy": "deuteronomy",
    "Joshua": "joshua",
    "Judges": "judges",
    "Ruth": "ruth",
    "1 Samuel": "1-samuel",
    "2 Samuel": "2-samuel",
    "1 Kings": "1-kings",
    "2 Kings": "2-kings",
    "1 Chronicles": "1-chronicles",
    "2 Chronicles": "2-chronicles",
    "Ezra": "ezra",
    "Nehemiah": "nehemiah",
    "Esther": "esther",
    "Job": "job",
    "Psalms": "psalms",
    "Proverbs": "proverbs",
    "Ecclesiastes": "ecclesiastes",
    "Song of Solomon": "song-of-songs",
    "Isaiah": "isaiah",
    "Jeremiah": "jeremiah",
    "Lamentations": "lamentations",
    "Ezekiel": "ezekiel",
    "Daniel": "daniel",
    "Hosea": "hosea",
    "Joel": "joel",
    "Amos": "amos",
    "Obadiah": "obadiah",
    "Jonah": "jonah",
    "Micah": "micah",
    "Nahum": "nahum",
    "Habakkuk": "habakkuk",
    "Zephaniah": "zephaniah",
    "Haggai": "haggai",
    "Zechariah": "zechariah",
    "Malachi": "malachi",
    "Matthew": "matthew",
    "Mark": "mark",
    "Luke": "luke",
    "John": "john",
    "Acts": "acts",
    "Romans": "romans",
    "1 Corinthians": "1-corinthians",
    "2 Corinthians": "2-corinthians",
    "Galatians": "galatians",
    "Ephesians": "ephesians",
    "Philippians": "philippians",
    "Colossians": "colossians",
    "1 Thessalonians": "1-thessalonians",
    "2 Thessalonians": "2-thessalonians",
    "1 Timothy": "1-timothy",
    "2 Timothy": "2-timothy",
    "Titus": "titus",
    "Philemon": "philemon",
    "Hebrews": "hebrews",
    "James": "james",
    "1 Peter": "1-peter",
    "2 Peter": "2-peter",
    "1 John": "1-john",
    "2 John": "2-john",
    "3 John": "3-john",
    "Jude": "jude",
    "Revelation": "revelation",
}

USFX_EXTRA = {
    "TOB": "tobit",
    "JDT": "judith",
    "WIS": "wisdom",
    "SIR": "sirach",
    "BAR": "baruch",
    "LJE": "letter-of-jeremiah",
    "1ES": "1-esdras",
    "2ES": "ezra-sutuel",
    "PS2": "psalm-151",
}

# id, section, nameEn, nameAm, nameGez, note
META = [
    ("genesis", "orit", "Genesis", "ኦሪት ዘፍጥረት", "ኦሪት ዘፍጥረት", "The first book of the Orit."),
    ("exodus", "orit", "Exodus", "ኦሪት ዘጸአት", "ኦሪት ዘጸአት", "The going out from Egypt."),
    ("leviticus", "orit", "Leviticus", "ኦሪት ዘሌዋውያን", "ኦሪት ዘሌዋውያን", "The holiness of the tent."),
    ("numbers", "orit", "Numbers", "ኦሪት ዘኍልቍ", "ኦሪት ዘኍልቍ", "The numbering of Israel."),
    ("deuteronomy", "orit", "Deuteronomy", "ኦሪት ዘዳግም", "ኦሪት ዘዳግም", "The second law."),
    ("joshua", "orit", "Joshua", "ኢያሱ", "ኢያሱ ወልደ ኖን", "The crossing of the Jordan."),
    ("judges", "orit", "Judges", "መሳፍንት", "መሳፍንት", "The judges of Israel."),
    ("ruth", "orit", "Ruth", "ሩት", "ሩት", "The gleaning at Bethlehem."),
    ("1-samuel", "dagua", "1 Samuel", "1ኛ ሳሙኤል", "ሳሙኤል ፩", "The prophet and the first king."),
    ("2-samuel", "dagua", "2 Samuel", "2ኛ ሳሙኤል", "ሳሙኤል ፪", "The house of David."),
    ("1-kings", "dagua", "1 Kings", "1ኛ ነገሥት", "ነገሥት ፩", "Solomon and the temple."),
    ("2-kings", "dagua", "2 Kings", "2ኛ ነገሥት", "ነገሥት ፪", "The fall of the kingdoms."),
    ("1-chronicles", "dagua", "1 Chronicles", "1ኛ ዜና መዋዕል", "ዜና መዋዕል ፩", "The chronicles of the kings."),
    ("2-chronicles", "dagua", "2 Chronicles", "2ኛ ዜና መዋዕል", "ዜና መዋዕል ፪", "The temple and the exile."),
    ("ezra", "dagua", "Ezra", "ዕዝራ", "ዕዝራ", "The return from Babylon."),
    ("nehemiah", "dagua", "Nehemiah", "ነህምያ", "ነህምያ", "The rebuilding of the wall."),
    ("1-esdras", "dagua", "1 Esdras", "ዕዝራ ፩", "ዕዝራ", "Greek Ezra, kept in the broader canon."),
    ("ezra-sutuel", "dagua", "Ezra Sutuel", "ዕዝራ ሱቱኤል", "ዕዝራ ሱቱኤል", "Ethiopic 4 Ezra / 2 Esdras."),
    ("esther", "dagua", "Esther", "አስቴር", "አስቴር", "The queen of Persia."),
    ("tobit", "dagua", "Tobit", "ጦቢት", "ጦቢት", "The road with Raphael."),
    ("judith", "dagua", "Judith", "ዮዲት", "ዮዲት", "The widow of Bethulia."),
    ("job", "dagua", "Job", "ኢዮብ", "ኢዮብ", "The patience of Job."),
    ("psalms", "dagua", "Psalms", "መዝሙረ ዳዊት", "መዝሙር", "One hundred fifty-one psalms in the Ethiopian Psalter."),
    ("proverbs", "dagua", "Proverbs", "ምሳሌ", "ምሳሌያተ ሰሎሞን", "The proverbs of Solomon."),
    ("ecclesiastes", "dagua", "Ecclesiastes", "መክብብ", "መክብብ", "Vanity of vanities."),
    ("song-of-songs", "dagua", "Song of Songs", "መኃልየ መኃልይ", "መኃልየ መኃልይ", "The song of songs."),
    ("wisdom", "dagua", "Wisdom", "ጥበበ ሰሎሞን", "ጥበበ ሰሎሞን", "The wisdom of Solomon."),
    ("sirach", "dagua", "Sirach", "ስራክ", "ስራክ", "The wisdom of Ben Sira."),
    ("isaiah", "nebiyat", "Isaiah", "ትንቢተ ኢሳይያስ", "ኢሳይያስ", "Lift up your eyes on high."),
    ("jeremiah", "nebiyat", "Jeremiah", "ትንቢተ ኤርምያስ", "ኤርምያስ", "The weeping prophet."),
    ("baruch", "nebiyat", "Baruch", "ባሮክ", "ባሮክ", "The scribe of Jeremiah."),
    ("letter-of-jeremiah", "nebiyat", "Letter of Jeremiah", "መልእክተ ኤርምያስ", "መልእክተ ኤርምያስ", "Against the idols of Babylon."),
    ("lamentations", "nebiyat", "Lamentations", "ሰቆቃወ ኤርምያስ", "ሰቆቃወ", "How lonely sits the city."),
    ("ezekiel", "nebiyat", "Ezekiel", "ትንቢተ ሕዝቅኤል", "ሕዝቅኤል", "The wheels and the glory."),
    ("daniel", "nebiyat", "Daniel", "ትንቢተ ዳንኤል", "ዳንኤል", "The night visions."),
    ("hosea", "nebiyat", "Hosea", "ሆሴዕ", "ሆሴዕ", "Minor prophet."),
    ("joel", "nebiyat", "Joel", "ኢዮኤል", "ኢዮኤል", "Minor prophet."),
    ("amos", "nebiyat", "Amos", "አሞጽ", "አሞጽ", "Minor prophet."),
    ("obadiah", "nebiyat", "Obadiah", "አብድዩ", "አብድዩ", "Minor prophet."),
    ("jonah", "nebiyat", "Jonah", "ዮናስ", "ዮናስ", "Minor prophet."),
    ("micah", "nebiyat", "Micah", "ሚክያስ", "ሚክያስ", "Minor prophet."),
    ("nahum", "nebiyat", "Nahum", "ናሆም", "ናሆም", "Minor prophet."),
    ("habakkuk", "nebiyat", "Habakkuk", "ዕንባቆም", "ዕንባቆም", "Minor prophet."),
    ("zephaniah", "nebiyat", "Zephaniah", "ሶፎንያስ", "ሶፎንያስ", "Minor prophet."),
    ("haggai", "nebiyat", "Haggai", "ሐጌ", "ሐጌ", "Minor prophet."),
    ("zechariah", "nebiyat", "Zechariah", "ዘካርያስ", "ዘካርያስ", "Minor prophet."),
    ("malachi", "nebiyat", "Malachi", "ሚልክያስ", "ሚልክያስ", "Minor prophet."),
    ("enoch", "broader", "1 Enoch", "መጽሐፈ ሄኖክ", "ሄኖክ", "The blessing of Enoch."),
    ("jubilees", "broader", "Jubilees", "መጽሐፈ ኩፋሌ", "ኩፋሌ", "The division of the days."),
    ("matthew", "wengel", "Matthew", "የማቴዎስ ወንጌል", "ወንጌል ዘማቴዎስ", "The gospel of Matthew."),
    ("mark", "wengel", "Mark", "የማርቆስ ወንጌል", "ወንጌል ዘማርቆስ", "The gospel of Mark."),
    ("luke", "wengel", "Luke", "የሉቃስ ወንጌል", "ወንጌል ዘሉቃስ", "The gospel of Luke."),
    ("john", "wengel", "John", "የዮሐንስ ወንጌል", "ወንጌል ዘዮሐንስ", "The gospel of John."),
    ("acts", "wengel", "Acts", "ሥራ የሐዋርያት", "ግብረ ሐዋርያት", "The acts of the apostles."),
    ("romans", "wengel", "Romans", "ወደ ሮሜ", "ሮሜ", "Paul to the Romans."),
    ("1-corinthians", "wengel", "1 Corinthians", "1ኛ ቆሮንቶስ", "ቆሮንቶስ ፩", "Paul to Corinth."),
    ("2-corinthians", "wengel", "2 Corinthians", "2ኛ ቆሮንቶስ", "ቆሮንቶስ ፪", "Paul to Corinth again."),
    ("galatians", "wengel", "Galatians", "ወደ ገላትያ", "ገላትያ", "Paul to Galatia."),
    ("ephesians", "wengel", "Ephesians", "ወደ ኤፌሶን", "ኤፌሶን", "Paul to Ephesus."),
    ("philippians", "wengel", "Philippians", "ወደ ፊልጵስዩስ", "ፊልጵስዩስ", "Paul to Philippi."),
    ("colossians", "wengel", "Colossians", "ወደ ቆላስይስ", "ቆላስይስ", "Paul to Colossae."),
    ("1-thessalonians", "wengel", "1 Thessalonians", "1ኛ ተሰሎንቄ", "ተሰሎንቄ ፩", "Paul to Thessalonica."),
    ("2-thessalonians", "wengel", "2 Thessalonians", "2ኛ ተሰሎንቄ", "ተሰሎንቄ ፪", "Paul to Thessalonica again."),
    ("1-timothy", "wengel", "1 Timothy", "1ኛ ጢሞቴዎስ", "ጢሞቴዎስ ፩", "Paul to Timothy."),
    ("2-timothy", "wengel", "2 Timothy", "2ኛ ጢሞቴዎስ", "ጢሞቴዎስ ፪", "Paul to Timothy again."),
    ("titus", "wengel", "Titus", "ወደ ቲቶ", "ቲቶ", "Paul to Titus."),
    ("philemon", "wengel", "Philemon", "ወደ ፊልሞና", "ፊልሞና", "Paul to Philemon."),
    ("hebrews", "wengel", "Hebrews", "ወደ ዕብራውያን", "ዕብራውያን", "To the Hebrews."),
    ("james", "wengel", "James", "ያዕቆብ", "ያዕቆብ", "The letter of James."),
    ("1-peter", "wengel", "1 Peter", "1ኛ ጴጥሮስ", "ጴጥሮስ ፩", "Peter's first letter."),
    ("2-peter", "wengel", "2 Peter", "2ኛ ጴጥሮስ", "ጴጥሮስ ፪", "Peter's second letter."),
    ("1-john", "wengel", "1 John", "1ኛ ዮሐንስ", "ዮሐንስ ፩", "John's first letter."),
    ("2-john", "wengel", "2 John", "2ኛ ዮሐንስ", "ዮሐንስ ፪", "John's second letter."),
    ("3-john", "wengel", "3 John", "3ኛ ዮሐንስ", "ዮሐንስ ፫", "John's third letter."),
    ("jude", "wengel", "Jude", "ይሁዳ", "ይሁዳ", "The letter of Jude."),
    ("revelation", "wengel", "Revelation", "ራእይ ዮሐንስ", "ራእይ", "The revelation of John."),
]

TAG_RE = re.compile(r"<[^>]+>")
WS_RE = re.compile(r"\s+")


def clean(text: str) -> str:
    text = unescape(TAG_RE.sub("", text))
    return WS_RE.sub(" ", text).strip()


def verses_from_strings(lines: list[str]) -> list[dict]:
    out = []
    for i, line in enumerate(lines, 1):
        t = clean(line)
        if not t:
            continue
        out.append({"n": i, "en": t, "am": t})
    return out or [{"n": 1, "en": "", "am": ""}]


def parse_kjv() -> dict[str, dict]:
    data = json.loads((SRC / "en_kjv.json").read_text(encoding="utf-8-sig"))
    books: dict[str, dict] = {}
    for item in data:
        bid = KJV_NAME_TO_ID.get(item["name"])
        if not bid:
            continue
        chapters = []
        for i, ch in enumerate(item["chapters"], 1):
            chapters.append({"number": i, "verses": verses_from_strings(ch)})
        books[bid] = {"id": bid, "chapters": chapters}
    return books


def parse_usfx_book(xml: str, usfx_id: str) -> list[list[str]] | None:
    marker = f'<book id="{usfx_id}"'
    start = xml.find(marker)
    if start < 0:
        return None
    nxt = xml.find("<book id=", start + 5)
    blob = xml[start : nxt if nxt > 0 else None]
    chapters: list[list[str]] = []
    current: list[str] | None = None
    verse_no = None
    buf: list[str] = []

    def flush_verse():
        nonlocal verse_no, buf, current
        if current is None or verse_no is None:
            buf = []
            return
        while len(current) < verse_no:
            current.append("")
        current[verse_no - 1] = (current[verse_no - 1] + " " + "".join(buf)).strip()
        buf = []

    # Walk tags roughly
    pos = 0
    while True:
        m = re.search(r"<c id=\"(\d+)\"\s*/>|<v id=\"(\d+)\"\s*/?>|<ve\s*/>", blob[pos:])
        if not m:
            break
        kind = m.group(0)
        text_before = blob[pos : pos + m.start()]
        if verse_no is not None:
            buf.append(text_before)
        pos = pos + m.end()
        if m.group(1):
            flush_verse()
            current = []
            chapters.append(current)
            verse_no = None
            buf = []
        elif m.group(2):
            flush_verse()
            verse_no = int(m.group(2))
            buf = []
        else:
            flush_verse()
            verse_no = None
            buf = []
    flush_verse()
    return chapters or None


def merge_usfx(books: dict[str, dict], xml: str) -> None:
    for usfx_id, bid in USFX_EXTRA.items():
        chs = parse_usfx_book(xml, usfx_id)
        if not chs:
            print("missing usfx", usfx_id)
            continue
        if bid == "psalm-151":
            psalms = books.get("psalms")
            if psalms:
                verses = verses_from_strings(chs[0] if chs else [])
                psalms["chapters"].append({"number": 151, "verses": verses})
            continue
        chapters = [{"number": i, "verses": verses_from_strings(ch)} for i, ch in enumerate(chs, 1)]
        books[bid] = {"id": bid, "chapters": chapters}


def extract_overlays() -> dict[str, dict[int, dict[int, dict]]]:
    """Pull Ge'ez/Amharic from the hand-authored books.ts excerpts."""
    text = (ROOT / "src" / "lib" / "bible" / "books.ts").read_text()
    overlays: dict[str, dict[int, dict[int, dict]]] = {}
    book_chunks = re.split(r"\n  \{\n    id: \"", text)
    for chunk in book_chunks[1:]:
        bid = chunk.split('"', 1)[0]
        # map excerpt ids onto canonical books
        target, default_ch = {
            "genesis": ("genesis", None),
            "john": ("john", None),
            "enoch": ("enoch", None),
            "jubilees": ("jubilees", None),
            "psalm19": ("psalms", 19),
            "psalm23": ("psalms", 23),
            "psalm121": ("psalms", 121),
            "sirach43": ("sirach", 43),
            "matthew5": ("matthew", 5),
            "isaiah40": ("isaiah", 40),
        }.get(bid, (bid, None))
        ch_iter = re.finditer(
            r"number: (\d+),[\s\S]*?verses: \[([\s\S]*?)\n        \],",
            chunk,
        )
        for ch_m in ch_iter:
            ch_n = default_ch or int(ch_m.group(1))
            body = ch_m.group(2)
            for vm in re.finditer(
                r"\{\s*n: (\d+),([\s\S]*?)\n          \}",
                body,
            ):
                n = int(vm.group(1))
                block = vm.group(2)
                def grab(key: str) -> str | None:
                    m = re.search(rf'{key}: "((?:\\.|[^"\\])*)"', block)
                    if not m:
                        return None
                    return m.group(1).replace('\\n', '\n').replace('\\"', '"').replace("\\\\", "\\")
                gez, am, en = grab("gez"), grab("am"), grab("en")
                if not (gez or am or en):
                    continue
                overlays.setdefault(target, {}).setdefault(ch_n, {})[n] = {
                    k: v for k, v in (("gez", gez), ("am", am), ("en", en)) if v
                }
    return overlays


def apply_overlays(books: dict[str, dict], overlays: dict) -> None:
    for bid, chs in overlays.items():
        book = books.get(bid)
        if not book:
            # create from overlay only
            chapters = []
            for ch_n in sorted(chs):
                verses = []
                for n, payload in sorted(chs[ch_n].items()):
                    verses.append(
                        {
                            "n": n,
                            "en": payload.get("en") or payload.get("am") or "",
                            "am": payload.get("am") or payload.get("en") or "",
                            **({"gez": payload["gez"]} if payload.get("gez") else {}),
                        }
                    )
                chapters.append({"number": ch_n, "verses": verses})
            books[bid] = {"id": bid, "chapters": chapters}
            continue
        by_num = {c["number"]: c for c in book["chapters"]}
        for ch_n, verses in chs.items():
            ch = by_num.get(ch_n)
            if not ch:
                ch = {"number": ch_n, "verses": []}
                book["chapters"].append(ch)
                book["chapters"].sort(key=lambda c: c["number"])
                by_num[ch_n] = ch
            existing = {v["n"]: v for v in ch["verses"]}
            for n, payload in verses.items():
                v = existing.get(n)
                if not v:
                    v = {"n": n, "en": payload.get("en") or "", "am": payload.get("am") or payload.get("en") or ""}
                    ch["verses"].append(v)
                    ch["verses"].sort(key=lambda x: x["n"])
                    existing[n] = v
                if payload.get("en"):
                    v["en"] = payload["en"]
                if payload.get("am"):
                    v["am"] = payload["am"]
                if payload.get("gez"):
                    v["gez"] = payload["gez"]


def write_catalog(books: dict[str, dict]) -> None:
    lines = [
        "export type CanonSection = \"orit\" | \"nebiyat\" | \"dagua\" | \"wengel\" | \"broader\";",
        "",
        "export type CanonBook = {",
        "  id: string;",
        "  section: CanonSection;",
        "  nameEn: string;",
        "  nameAm: string;",
        "  nameGez: string;",
        "  note: string;",
        "  chapters: number;",
        "};",
        "",
        "export const CATALOG: CanonBook[] = [",
    ]
    for bid, section, name_en, name_am, name_gez, note in META:
        book = books.get(bid)
        if not book:
            continue
        ch_count = len(book["chapters"])
        note_s = note.replace('"', '\\"')
        lines.append(
            f"  {{ id: \"{bid}\", section: \"{section}\", nameEn: \"{name_en}\", nameAm: \"{name_am}\", nameGez: \"{name_gez}\", note: \"{note_s}\", chapters: {ch_count} }},"
        )
    lines.append("];")
    lines.append("")
    lines.append("export const CANON_GROUPS: { section: string; ids: string[] }[] = [")
    groups = [
        ("Orit (8)", "orit"),
        ("Kings & Writings", "dagua"),
        ("Prophets", "nebiyat"),
        ("Broader canon", "broader"),
        ("Wengel — the Gospel and Apostles", "wengel"),
    ]
    # Rebuild groups from actual catalog order in META
    by_section: dict[str, list[str]] = {}
    for bid, section, *_ in META:
        if bid in books:
            by_section.setdefault(section, []).append(bid)
    labels = {
        "orit": "Orit (8)",
        "dagua": "Kings, Writings & Wisdom",
        "nebiyat": "Nebiyat — the Prophets",
        "broader": "Broader canon",
        "wengel": "Wengel — Gospel and Apostles",
    }
    for section, ids in by_section.items():
        id_list = ", ".join(f'"{i}"' for i in ids)
        lines.append(f"  {{ section: \"{labels[section]}\", ids: [{id_list}] }},")
    lines.append("];")
    lines.append("")
    lines.append("export function getCanon(id: string): CanonBook | undefined {")
    lines.append("  return CATALOG.find((b) => b.id === id);")
    lines.append("}")
    lines.append("")
    lines.append("export function neighbor(id: string, dir: -1 | 1): CanonBook {")
    lines.append("  const i = CATALOG.findIndex((b) => b.id === id);")
    lines.append("  const n = CATALOG.length;")
    lines.append("  return CATALOG[(i + dir + n) % n] ?? CATALOG[0]!;")
    lines.append("}")
    CANON_TS.write_text("\n".join(lines) + "\n")


def main() -> None:
    books = parse_kjv()
    xml = (SRC / "eng-web.usfx.xml").read_text(errors="replace")
    merge_usfx(books, xml)
    overlays = extract_overlays()
    apply_overlays(books, overlays)
    for path in OUT.glob("*.json"):
        path.unlink()
    for bid, book in books.items():
        (OUT / f"{bid}.json").write_text(json.dumps(book, ensure_ascii=False, separators=(",", ":")))
    write_catalog(books)
    print("books", len(books), "files", len(list(OUT.glob('*.json'))))
    print("catalog", CANON_TS)


if __name__ == "__main__":
    main()
