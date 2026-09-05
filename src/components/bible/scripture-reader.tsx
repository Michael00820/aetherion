import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { CATALOG, CANON_GROUPS, displayEn, getCanon, neighbor } from "@/lib/bible/catalog";
import { hasTraditional, loadBook, nextLocation, prefetchNeighbors, searchScripture } from "@/lib/bible/load";
import type { Book, Verse } from "@/lib/bible/types";
import { SECTION_LABELS } from "@/lib/bible/types";
import { translateChapter } from "@/lib/translate";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const cacheKey = (book: string, chapter: number, target: string) =>
  `aetherion-tr:${book}:${chapter}:${target}`;

export function ScriptureReader() {
  const lang = useAppStore((s) => s.scriptureLang);
  const setLang = useAppStore((s) => s.setScriptureLang);
  const [bookId, setBookId] = useState(CATALOG[0]?.id ?? "genesis");
  const meta = getCanon(bookId) ?? CATALOG[0]!;
  const [chapterNum, setChapterNum] = useState(1);
  const [verseNum, setVerseNum] = useState(1);
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [slide, setSlide] = useState(0);
  const [ai, setAi] = useState<{ status: "idle" | "loading" | "done" | "error"; text: string; error?: string }>({
    status: "idle",
    text: "",
  });
  const [aiTarget, setAiTarget] = useState<"en" | "am">("en");
  const jump = useRef(false);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const readerRef = useRef<HTMLElement | null>(null);

  const chapter = book?.chapters.find((c) => c.number === chapterNum) ?? book?.chapters[0];

  useEffect(() => {
    let live = true;
    setLoading(true);
    void loadBook(bookId).then((loaded) => {
      if (!live) return;
      setBook(loaded ?? null);
      setLoading(false);
      prefetchNeighbors(bookId);
    });
    return () => {
      live = false;
    };
  }, [bookId]);

  useEffect(() => {
    if (!jump.current || !chapter) return;
    jump.current = false;
    const n = chapter.verses.some((v) => v.n === verseNum) ? verseNum : (chapter.verses[0]?.n ?? 1);
    const el = document.getElementById(`v-${bookId}-${chapter.number}-${n}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [bookId, chapter, verseNum]);

  const hits = useMemo(() => searchScripture(query, book), [query, book]);
  const traditionalReady = chapter ? hasTraditional(chapter.verses) : false;

  const traditional = useMemo(() => {
    if (!chapter) return "";
    return chapter.verses
      .map((v) => {
        const gez = v.gez ? `${v.n} ${v.gez}` : "";
        const am = `${v.n} ${v.am}`;
        return gez ? `${gez}\n${am}` : am;
      })
      .join("\n\n");
  }, [chapter]);

  const english = useMemo(() => {
    if (!chapter) return "";
    return chapter.verses.map((v) => `${v.n} ${v.en}`).join("\n\n");
  }, [chapter]);

  function goTo(nextBook: string, nextChapter: number, nextVerse = 1, dir: -1 | 0 | 1 = 0) {
    const nextMeta = getCanon(nextBook);
    const ch = Math.min(Math.max(1, nextChapter), nextMeta?.chapters ?? 1);
    jump.current = nextVerse > 1;
    if (dir) setSlide(dir);
    setBookId(nextBook);
    setChapterNum(ch);
    setVerseNum(nextVerse);
    setAi({ status: "idle", text: "" });
    setQuery("");
    if (nextVerse <= 1) {
      requestAnimationFrame(() => readerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  }

  function stepChapter(dir: -1 | 1) {
    const loc = nextLocation(meta, chapterNum, dir);
    goTo(loc.id, loc.chapter, 1, dir);
  }

  useEffect(() => {
    if (!slide) return;
    const t = window.setTimeout(() => setSlide(0), 280);
    return () => window.clearTimeout(t);
  }, [slide]);

  function onPointerDown(e: PointerEvent) {
    touch.current = { x: e.clientX, y: e.clientY };
  }
  function onPointerUp(e: PointerEvent) {
    if (!touch.current) return;
    const dx = e.clientX - touch.current.x;
    const dy = e.clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) < 56 || Math.abs(dx) < Math.abs(dy) * 1.15) return;
    // swipe/scroll right (finger moves right) → next chapter, as requested
    if (dx > 0) stepChapter(1);
    else stepChapter(-1);
  }

  async function runTranslate() {
    if (!meta || !chapter) return;
    const key = cacheKey(meta.id, chapter.number, aiTarget);
    const cached = localStorage.getItem(key);
    if (cached) {
      setAi({ status: "done", text: cached });
      return;
    }
    setAi({ status: "loading", text: "" });
    try {
      const source = traditional || english;
      const result = await translateChapter({
        data: {
          book: meta.nameEn,
          chapter: chapter.number,
          sourceLang: "am",
          targetLang: aiTarget,
          text: source,
        },
      });
      if (result.ok) {
        localStorage.setItem(key, result.text);
        setAi({ status: "done", text: result.text });
      } else {
        setAi({ status: "error", text: "", error: result.error });
      }
    } catch (err) {
      setAi({
        status: "error",
        text: "",
        error: err instanceof Error ? err.message : "Translation failed.",
      });
    }
  }

  const shownLang = lang === "dual" && !traditionalReady ? "english" : lang;
  const nextMeta = neighbor(bookId, 1);
  const prevMeta = neighbor(bookId, -1);

  return (
    <div className="panel-enter mx-auto w-full max-w-6xl px-1 pb-10">
      <header className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <p className="text-xs uppercase tracking-[0.2em] text-subtle">Mazhaf — the books</p>
        <h2 className="mt-2 font-display text-4xl">Tewahedo scripture · YAH names</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
          English restores the unique Name of the Creator after the YAH Scriptures:
          {" "}
          <strong>YAHUAH</strong> — never Elohim, which names other mighty ones — and
          {" "}
          <strong>Yahushua</strong> for the Son. Traditional pages keep Ge'ez and Amharic.
          Open any book at chapter 1. Swipe right for the next chapter, left for the previous.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {(
            [
              ["traditional", "Traditional"],
              ["english", "English · YAH"],
              ["dual", "Facing pages"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setLang(id)}
              className={cn(
                "h-11 rounded-lg px-4 text-sm",
                lang === id ? "bg-accent text-accent-fg" : "bg-raised hover:bg-surface",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <div className="sticky top-0 z-20 mt-4 rounded-xl bg-bg/95 p-3 shadow-[var(--shadow-border)] backdrop-blur-sm">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search YAHUAH, Yahushua, Bereshith, light, Yohanan 1:1"
            className="h-12 w-full rounded-lg border border-border bg-raised pl-10 pr-3 text-sm"
            aria-label="Search scripture"
          />
        </label>
        {query.trim().length >= 2 ? (
          <ul className="mt-2 max-h-56 overflow-y-auto rounded-lg bg-surface p-1">
            {hits.length === 0 ? (
              <li className="px-3 py-2 text-sm text-muted">No passages match.</li>
            ) : (
              hits.map((hit) => (
                <li key={`${hit.bookId}-${hit.chapter}-${hit.verse}`}>
                  <button
                    type="button"
                    className="flex w-full flex-col rounded-md px-3 py-2 text-left hover:bg-raised"
                    onClick={() => goTo(hit.bookId, hit.chapter, hit.verse)}
                  >
                    <span className="text-sm">
                      {hit.bookEn} {hit.chapter}:{hit.verse}
                    </span>
                    <span className="line-clamp-2 text-xs text-muted">{hit.preview}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        ) : null}

        <div className="mt-3 grid grid-cols-[auto_1fr_auto_auto] gap-2">
          <button type="button" className="nav-chip" aria-label="Previous chapter" onClick={() => stepChapter(-1)}>
            <ChevronLeft className="size-4" />
          </button>
          <select
            className="mazhaf-select min-w-0"
            value={bookId}
            aria-label="Book"
            onChange={(e) => goTo(e.target.value, 1, 1)}
          >
            {(Object.keys(SECTION_LABELS) as Array<keyof typeof SECTION_LABELS>).map((section) => {
              const group = CATALOG.filter((b) => b.section === section);
              if (group.length === 0) return null;
              return (
                <optgroup key={section} label={SECTION_LABELS[section].en}>
                  {group.map((b) => (
                    <option key={b.id} value={b.id}>
                      {displayEn(b)} — {b.nameAm}
                    </option>
                  ))}
                </optgroup>
              );
            })}
          </select>
          <select
            className="mazhaf-select w-[4.6rem]"
            value={String(chapterNum)}
            aria-label="Chapter"
            onChange={(e) => goTo(bookId, Number(e.target.value), 1)}
          >
            {Array.from({ length: meta.chapters }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <select
            className="mazhaf-select w-[4.6rem]"
            value={String(verseNum)}
            aria-label="Verse"
            onChange={(e) => {
              jump.current = true;
              setVerseNum(Number(e.target.value));
            }}
          >
            {(chapter?.verses ?? [{ n: 1 }]).map((v) => (
              <option key={v.n} value={v.n}>
                {v.n}
              </option>
            ))}
          </select>
        </div>
        <p className="mt-2 text-xs text-subtle">
          <span className="font-ethiopic">{meta.nameGez}</span>
          {" · "}
          swipe right next · swipe left previous
        </p>
      </div>

      <article
        ref={readerRef}
        className={cn(
          "mazhaf-reader mt-4 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] sm:p-7",
          slide === 1 && "mazhaf-slide-next",
          slide === -1 && "mazhaf-slide-prev",
        )}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          touch.current = null;
        }}
      >
        <h3 className="font-display text-2xl">{displayEn(meta)}</h3>
        <p className="font-ethiopic text-muted">{meta.nameGez}</p>
        <p className="mt-2 text-sm text-muted">{meta.note}</p>
        {loading || !chapter ? (
          <p className="mt-6 text-sm text-muted">Opening {displayEn(meta)}…</p>
        ) : (
          <>
            <p className="mt-4 text-sm text-subtle">
              Chapter {chapter.number} of {meta.chapters} · {chapter.verses.length} verses
            </p>
            <div className="mt-5">
              {shownLang === "dual" ? (
                <div className="grid gap-8 md:grid-cols-2">
                  <VerseCol
                    bookId={meta.id}
                    chapter={chapter.number}
                    verses={chapter.verses}
                    side="traditional"
                    active={verseNum}
                    onSelect={setVerseNum}
                    anchor
                  />
                  <VerseCol
                    bookId={meta.id}
                    chapter={chapter.number}
                    verses={chapter.verses}
                    side="english"
                    active={verseNum}
                    onSelect={setVerseNum}
                  />
                </div>
              ) : (
                <VerseCol
                  bookId={meta.id}
                  chapter={chapter.number}
                  verses={chapter.verses}
                  side={shownLang === "traditional" ? "traditional" : "english"}
                  active={verseNum}
                  onSelect={setVerseNum}
                  anchor
                />
              )}
            </div>
            <p className="mt-8 text-center text-xs text-subtle">
              {chapter.number >= meta.chapters
                ? `Next: ${displayEn(nextMeta)} 1`
                : `Next: ${displayEn(meta)} ${chapter.number + 1}`}
              {" · "}
              {chapter.number <= 1
                ? `Previous: ${displayEn(prevMeta)} ${prevMeta.chapters}`
                : `Previous: ${displayEn(meta)} ${chapter.number - 1}`}
            </p>
          </>
        )}
      </article>

      <div className="mt-4 rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
        <div className="flex flex-wrap items-center gap-2">
          <p className="mr-auto text-sm text-muted">Translate this chapter with Grok</p>
          <button
            type="button"
            onClick={() => setAiTarget("en")}
            className={cn("h-11 rounded-lg px-3 text-sm", aiTarget === "en" ? "bg-accent text-accent-fg" : "bg-raised")}
          >
            To English
          </button>
          <button
            type="button"
            onClick={() => setAiTarget("am")}
            className={cn("h-11 rounded-lg px-3 text-sm", aiTarget === "am" ? "bg-accent text-accent-fg" : "bg-raised")}
          >
            To Amharic
          </button>
          <Button onClick={() => void runTranslate()} disabled={ai.status === "loading"}>
            {ai.status === "loading" ? "Translating…" : "Translate chapter"}
          </Button>
        </div>
        {ai.status === "error" ? <p className="mt-3 text-sm text-danger">{ai.error}</p> : null}
        {ai.status === "done" ? (
          <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed text-fg">{ai.text}</pre>
        ) : null}
      </div>

      <div className="mt-4 rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
        <h3 className="font-display text-xl">The Tewahedo library</h3>
        <p className="mt-2 text-sm text-muted">
          Tap any book. English is the YAH restoration. Traditional is Ge'ez and Amharic.
        </p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CANON_GROUPS.map((g) => (
            <div key={g.section}>
              <p className="text-xs uppercase tracking-wider text-subtle">{g.section}</p>
              <ul className="mt-1">
                {g.ids.map((id) => {
                  const item = getCanon(id);
                  if (!item) return null;
                  const on = item.id === bookId;
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        className={cn(
                          "w-full py-2 text-left text-sm",
                          on ? "text-accent" : "text-fg hover:underline",
                        )}
                        onClick={() => goTo(item.id, 1, 1)}
                      >
                        {displayEn(item)}
                        <span className="ml-2 font-ethiopic text-xs text-muted">{item.nameAm}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function VerseCol({
  bookId,
  chapter,
  verses,
  side,
  active,
  onSelect,
  anchor = false,
}: {
  bookId: string;
  chapter: number;
  verses: Verse[];
  side: "traditional" | "english";
  active: number;
  onSelect: (n: number) => void;
  anchor?: boolean;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-[0.16em] text-subtle">
        {side === "english" ? "English · YAHUAH / Yahushua" : "Ge'ez / Amharic"}
      </p>
      {verses.map((v) => (
        <p
          key={`${side}-${v.n}`}
          id={anchor ? `v-${bookId}-${chapter}-${v.n}` : undefined}
          onClick={() => onSelect(v.n)}
          className={cn(
            "cursor-pointer rounded-lg px-2 py-2 text-base leading-relaxed",
            active === v.n ? "bg-raised ring-1 ring-accent/50" : "hover:bg-raised/60",
          )}
        >
          <span className="mr-2 text-xs tabular-nums text-subtle">{v.n}</span>
          {side === "english" ? (
            <span>{v.en}</span>
          ) : (
            <span className="font-ethiopic">
              {v.gez ? (
                <>
                  <span className="block">{v.gez}</span>
                  <span className="mt-1 block text-muted">{v.am}</span>
                </>
              ) : (
                v.am
              )}
            </span>
          )}
        </p>
      ))}
    </div>
  );
}
