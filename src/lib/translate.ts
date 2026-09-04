import { Capacitor } from "@capacitor/core";

type Payload = {
  data: {
    book: string;
    chapter: number;
    sourceLang: "gez" | "am" | "en";
    targetLang: "en" | "am" | "gez";
    text: string;
  };
};

type Result = { ok: true; text: string } | { ok: false; error: string };

export async function translateChapter(input: Payload): Promise<Result> {
  if (Capacitor.isNativePlatform()) {
    return {
      ok: false,
      error: "Chapter translation needs the online observatory. The library still reads offline.",
    };
  }
  const { translateChapterFn } = await import("./translate-server");
  return translateChapterFn(input);
}
