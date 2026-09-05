import { CATALOG, displayEn, getCanon, neighbor, yahTitle, type CanonBook } from "./catalog";
import type { Book, Verse } from "./types";

const cache = new Map<string, Book>();
const inflight = new Map<string, Promise<Book | undefined>>();

export type LoadedBook = Book;

export async function loadBook(id: string): Promise<Book | undefined> {
  const cached = cache.get(id);
  if (cached) return cached;
  const pending = inflight.get(id);
  if (pending) return pending;
  const meta = getCanon(id);
  if (!meta) return undefined;

  const task = (async () => {
    try {
      const res = await fetch(`/bible/${id}.json`);
      if (!res.ok) return undefined;
      const raw = (await res.json()) as { chapters: Book["chapters"] };
      const book: Book = {
        id: meta.id,
        section: meta.section,
        nameEn: meta.nameEn,
        nameAm: meta.nameAm,
        nameGez: meta.nameGez,
        note: meta.note,
        chapters: raw.chapters,
      };
      cache.set(id, book);
      return book;
    } catch {
      return undefined;
    } finally {
      inflight.delete(id);
    }
  })();
  inflight.set(id, task);
  return task;
}

export function prefetchBook(id: string) {
  void loadBook(id);
}

export function prefetchNeighbors(id: string) {
  prefetchBook(neighbor(id, 1).id);
  prefetchBook(neighbor(id, -1).id);
}

export type ScriptureHit = {
  bookId: string;
  bookEn: string;
  bookAm: string;
  chapter: number;
  verse: number;
  preview: string;
};

export function searchScripture(query: string, current?: Book | null, limit = 48): ScriptureHit[] {
  const raw = query.trim();
  if (raw.length < 2) return [];
  const q = raw.toLowerCase();
  const hits: ScriptureHit[] = [];
  const seen = new Set<string>();
  const push = (hit: ScriptureHit) => {
    const key = `${hit.bookId}:${hit.chapter}:${hit.verse}`;
    if (seen.has(key)) return;
    seen.add(key);
    hits.push(hit);
  };

  const ref = raw.match(/^(.+?)\s+(\d+)(?::(\d+))?$/);
  if (ref) {
    const name = ref[1]?.toLowerCase() ?? "";
    const chN = Number(ref[2]);
    const vN = ref[3] ? Number(ref[3]) : 1;
    for (const book of CATALOG) {
      const names = `${book.nameEn} ${yahTitle(book.id)} ${book.nameAm} ${book.nameGez} ${book.id}`.toLowerCase();
      if (!names.includes(name)) continue;
      push({
        bookId: book.id,
        bookEn: displayEn(book),
        bookAm: book.nameAm,
        chapter: Math.min(Math.max(1, chN), book.chapters),
        verse: vN,
        preview: `${book.nameEn} ${chN}:${vN}`,
      });
    }
  }

  for (const book of CATALOG) {
    const names = `${book.nameEn} ${yahTitle(book.id)} ${book.nameAm} ${book.nameGez} ${book.note}`.toLowerCase();
    if (names.includes(q)) {
      push({
        bookId: book.id,
        bookEn: displayEn(book),
        bookAm: book.nameAm,
        chapter: 1,
        verse: 1,
        preview: book.note,
      });
    }
  }

  const scan = (book: Book) => {
    for (const chapter of book.chapters) {
      for (const verse of chapter.verses) {
        const hay = `${verse.en} ${verse.am} ${verse.gez ?? ""}`.toLowerCase();
        if (!hay.includes(q)) continue;
        push({
          bookId: book.id,
          bookEn: displayEn(book),
          bookAm: book.nameAm,
          chapter: chapter.number,
          verse: verse.n,
          preview: verse.en,
        });
        if (hits.length >= limit) return;
      }
    }
  };

  if (current) scan(current);
  for (const book of cache.values()) {
    if (book.id === current?.id) continue;
    scan(book);
    if (hits.length >= limit) break;
  }
  return hits.slice(0, limit);
}

export function hasTraditional(verses: Verse[]): boolean {
  return verses.some((v) => Boolean(v.gez) || (v.am && v.am !== v.en));
}

export function nextLocation(
  meta: CanonBook,
  chapter: number,
  dir: -1 | 1,
): { id: string; chapter: number } {
  const next = chapter + dir;
  if (next >= 1 && next <= meta.chapters) return { id: meta.id, chapter: next };
  const n = neighbor(meta.id, dir);
  return { id: n.id, chapter: dir === 1 ? 1 : n.chapters };
}
