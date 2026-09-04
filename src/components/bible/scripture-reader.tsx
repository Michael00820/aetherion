import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { BOOKS, CANON_INDEX, getBook, matchCanonName, searchScripture } from "@/lib/bible/books";
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
  const [bookId, setBookId] = useState(BOOKS[0]?.id ?? "genesis");
  const book = getBook(bookId) ?? BOOKS[0];
  const [chapterNum, setChapterNum] = useState(book?.chapters[0]?.number ?? 1);
  const chapter = book?.chapters.find((c) => c.number === chapterNum) ?? book?.chapters[0];
  const [verseNum, setVerseNum] = useState(chapter?.verses[0]?.n ?? 1);
  const [query, setQuery] = useState("");
  const [ai, setAi] = useState<{ status: "idle" | "loading" | "done" | "error"; text: string; error?: string }>({
    status: "idle",
    text: "",
  });
  const [aiTarget, setAiTarget] = useState<"en" | "am">("en");
  const jump = useRef(false);

  const hits = useMemo(() => searchScripture(query), [query]);

  useEffect(() => {
    if (!jump.current || !chapter) return;
    jump.current = false;
    const exists = chapter.verses.some((v) => v.n === verseNum);
    const n = exists ? verseNum : (chapter.verses[0]?.n ?? 1);
    const el = document.getElementById(`v-${bookId}-${chapter.number}-${n}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [bookId, chapter, verseNum]);

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

  function goTo(nextBook: string, nextChapter: number, nextVerse?: number) {
    const b = getBook(nextBook);
    const ch = b?.chapters.find((c) => c.number === nextChapter) ?? b?.chapters[0];
    jump.current = true;
    setBookId(nextBook);
    setChapterNum(ch?.number ?? 1);
    setVerseNum(nextVerse ?? ch?.verses[0]?.n ?? 1);
    setAi({ status: "idle", text: "" });
    setQuery("");
  }

  function stepChapter(dir: -1 | 1) {
    if (!book) return;
    const idx = book.chapters.findIndex((c) => c.number === chapter?.number);
    const next = book.chapters[idx + dir];
    if (next) {
      goTo(book.id, next.number);
      return;
    }
    const bi = BOOKS.findIndex((b) => b.id === book.id);
    const nb = BOOKS[bi + dir];
    if (!nb) return;
    const ch = dir === 1 ? nb.chapters[0] : nb.chapters[nb.chapters.length - 1];
    if (ch) goTo(nb.id, ch.number);
  }

  async function runTranslate() {
    if (!book || !chapter) return;
    const key = cacheKey(book.id, chapter.number, aiTarget);
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
          book: book.nameEn,
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

  return (
    <div className="panel-enter mx-auto w-full max-w-6xl px-1 pb-10">
      <header className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <p className="text-xs uppercase tracking-[0.2em] text-subtle">Mazhaf — the books</p>
        <h2 className="mt-2 font-display text-4xl">Ethiopian Orthodox Tewahedo scripture</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
          Choose a book, chapter, and verse. Search Ge'ez, Amharic, or English. Traditional text
          keeps the liturgical line; English follows the public-domain renderings.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {(
            [
              ["traditional", "Traditional"],
              ["english", "English"],
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
            placeholder="Search books and verses — e.g. light, መጀመሪያ, Genesis 1:3"
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

        <div className="mt-3 grid grid-cols-[auto_1fr_auto_auto] gap-2 sm:grid-cols-[auto_minmax(0,1.4fr)_auto_auto]">
          <button type="button" className="nav-chip" aria-label="Previous chapter" onClick={() => stepChapter(-1)}>
            <ChevronLeft className="size-4" />
          </button>
          <select
            className="mazhaf-select min-w-0"
            value={bookId}
            aria-label="Book"
            onChange={(e) => {
              const b = getBook(e.target.value);
              goTo(e.target.value, b?.chapters[0]?.number ?? 1);
            }}
          >
            {(Object.keys(SECTION_LABELS) as Array<keyof typeof SECTION_LABELS>).map((section) => {
              const group = BOOKS.filter((b) => b.section === section);
              if (group.length === 0) return null;
              return (
                <optgroup key={section} label={SECTION_LABELS[section].en}>
                  {group.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.nameEn} — {b.nameAm}
                    </option>
                  ))}
                </optgroup>
              );
            })}
          </select>
          <select
            className="mazhaf-select w-[4.6rem]"
            value={String(chapter?.number ?? 1)}
            aria-label="Chapter"
            onChange={(e) => goTo(bookId, Number(e.target.value))}
          >
            {book?.chapters.map((c) => (
              <option key={c.number} value={c.number}>
                {c.number}
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
            {chapter?.verses.map((v) => (
              <option key={v.n} value={v.n}>
                {v.n}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-2 flex items-center justify-between gap-2 text-xs text-subtle">
          <span className="font-ethiopic">{book?.nameGez}</span>
          <button type="button" className="nav-chip h-10 w-10" aria-label="Next chapter" onClick={() => stepChapter(1)}>
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {book && chapter ? (
        <article className="mt-4 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] sm:p-7">
          <h3 className="font-display text-2xl">{book.nameEn}</h3>
          <p className="font-ethiopic text-muted">{book.nameGez}</p>
          <p className="mt-2 text-sm text-muted">{book.note}</p>
          {chapter.title ? (
            <p className="mt-4 text-xs uppercase tracking-[0.18em] text-subtle">{chapter.title}</p>
          ) : null}
          <p className="mt-1 text-sm text-subtle">
            Chapter {chapter.number} · {chapter.verses.length} verses
          </p>
          <div className="mt-5">
            {lang === "dual" ? (
              <div className="grid gap-8 md:grid-cols-2">
                <VerseCol
                  bookId={book.id}
                  chapter={chapter.number}
                  verses={chapter.verses}
                  side="traditional"
                  active={verseNum}
                  onSelect={setVerseNum}
                  anchor
                />
                <VerseCol
                  bookId={book.id}
                  chapter={chapter.number}
                  verses={chapter.verses}
                  side="english"
                  active={verseNum}
                  onSelect={setVerseNum}
                />
              </div>
            ) : (
              <VerseCol
                bookId={book.id}
                chapter={chapter.number}
                verses={chapter.verses}
                side={lang === "traditional" ? "traditional" : "english"}
                active={verseNum}
                onSelect={setVerseNum}
                anchor
              />
            )}
          </div>
        </article>
      ) : null}

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

      <details className="mt-4 rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]" open>
        <summary className="cursor-pointer font-display text-xl">The eighty-one books</summary>
        <p className="mt-2 text-sm text-muted">
          Tap a title to open it when the observatory holds the text. Grey titles are listed in the
          Tewahedo canon and will be filled as the library grows.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CANON_INDEX.map((g) => (
            <div key={g.section}>
              <p className="text-xs uppercase tracking-wider text-subtle">{g.section}</p>
              <ul className="mt-1 text-sm">
                {g.books.map((name) => {
                  const match = matchCanonName(name);
                  return (
                    <li key={name}>
                      {match ? (
                        <button
                          type="button"
                          className="py-1 text-left text-fg underline-offset-2 hover:underline"
                          onClick={() => goTo(match.id, match.chapters[0]?.number ?? 1)}
                        >
                          {name}
                        </button>
                      ) : (
                        <span className="py-1 text-muted">{name}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </details>
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
  verses: { n: number; gez?: string; am: string; en: string }[];
  side: "traditional" | "english";
  active: number;
  onSelect: (n: number) => void;
  anchor?: boolean;
}) {
  return (
    <div className="space-y-3">
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
