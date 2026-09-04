import { useMemo, useState } from "react";
import { BOOKS, CANON_INDEX, getBook } from "@/lib/bible/books";
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
  const [ai, setAi] = useState<{ status: "idle" | "loading" | "done" | "error"; text: string; error?: string }>({
    status: "idle",
    text: "",
  });
  const [aiTarget, setAiTarget] = useState<"en" | "am">("en");

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
    <div className="panel-enter mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col gap-4 px-1 pb-8">
      <header className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <p className="text-xs uppercase tracking-[0.2em] text-subtle">Mazhaf — the books</p>
        <h2 className="mt-2 font-display text-4xl">Ethiopian Orthodox Tewahedo scripture</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
          The Tewahedo canon holds eighty-one books — broader than the Western Bible. Traditional text is
          given in Ge'ez where a liturgical line is kept, and in Amharic throughout. English follows the
          public-domain renderings. Choose a chapter, then ask the translator for a fresh literary version.
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

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
        <nav className="scroll-thin max-h-[40vh] overflow-y-auto rounded-xl bg-surface p-3 shadow-[var(--shadow-border)] lg:max-h-none">
          {(Object.keys(SECTION_LABELS) as Array<keyof typeof SECTION_LABELS>).map((section) => {
            const group = BOOKS.filter((b) => b.section === section);
            if (group.length === 0) return null;
            const label = SECTION_LABELS[section];
            return (
              <div key={section} className="mb-4">
                <p className="px-2 pb-1 text-[11px] uppercase tracking-wider text-subtle">
                  {label.en}
                </p>
                {group.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => {
                      setBookId(b.id);
                      setChapterNum(b.chapters[0]?.number ?? 1);
                      setAi({ status: "idle", text: "" });
                    }}
                    className={cn(
                      "flex w-full flex-col rounded-md px-2 py-2 text-left text-sm",
                      b.id === bookId ? "bg-accent text-accent-fg" : "hover:bg-raised",
                    )}
                  >
                    <span>{b.nameEn}</span>
                    <span className={cn("font-ethiopic text-xs", b.id === bookId ? "text-accent-fg/70" : "text-muted")}>
                      {b.nameAm}
                    </span>
                  </button>
                ))}
              </div>
            );
          })}
        </nav>

        <div className="flex min-h-0 flex-col gap-3">
          {book ? (
            <>
              <div className="rounded-xl bg-raised p-4 shadow-[var(--shadow-border)]">
                <h3 className="font-display text-2xl">{book.nameEn}</h3>
                <p className="font-ethiopic text-muted">{book.nameGez}</p>
                <p className="mt-2 text-sm text-muted">{book.note}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {book.chapters.map((c) => (
                    <button
                      key={c.number}
                      type="button"
                      onClick={() => {
                        setChapterNum(c.number);
                        setAi({ status: "idle", text: "" });
                      }}
                      className={cn(
                        "h-11 min-w-11 rounded-lg px-3 text-sm tabular-nums",
                        c.number === chapter?.number ? "bg-accent text-accent-fg" : "bg-surface hover:bg-bg",
                      )}
                    >
                      {c.number}
                    </button>
                  ))}
                </div>
              </div>

              {chapter ? (
                <article className="scroll-thin min-h-0 flex-1 overflow-y-auto rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] sm:p-7">
                  {chapter.title ? (
                    <p className="mb-4 text-xs uppercase tracking-[0.18em] text-subtle">{chapter.title}</p>
                  ) : null}
                  {lang === "dual" ? (
                    <div className="grid gap-8 md:grid-cols-2">
                      <VerseCol verses={chapter.verses} side="traditional" />
                      <VerseCol verses={chapter.verses} side="english" />
                    </div>
                  ) : lang === "traditional" ? (
                    <VerseCol verses={chapter.verses} side="traditional" />
                  ) : (
                    <VerseCol verses={chapter.verses} side="english" />
                  )}
                </article>
              ) : null}

              <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="mr-auto text-sm text-muted">Translate this chapter with Grok</p>
                  <button
                    type="button"
                    onClick={() => setAiTarget("en")}
                    className={cn(
                      "h-11 rounded-lg px-3 text-sm",
                      aiTarget === "en" ? "bg-accent text-accent-fg" : "bg-raised",
                    )}
                  >
                    To English
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiTarget("am")}
                    className={cn(
                      "h-11 rounded-lg px-3 text-sm",
                      aiTarget === "am" ? "bg-accent text-accent-fg" : "bg-raised",
                    )}
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
            </>
          ) : null}
        </div>
      </div>

      <details className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
        <summary className="cursor-pointer font-display text-xl">The eighty-one books</summary>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CANON_INDEX.map((g) => (
            <div key={g.section}>
              <p className="text-xs uppercase tracking-wider text-subtle">{g.section}</p>
              <ul className="mt-1 text-sm text-muted">
                {g.books.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}

function VerseCol({
  verses,
  side,
}: {
  verses: { n: number; gez?: string; am: string; en: string }[];
  side: "traditional" | "english";
}) {
  return (
    <div className="space-y-4">
      {verses.map((v) => (
        <p key={v.n} className="text-base leading-relaxed">
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
