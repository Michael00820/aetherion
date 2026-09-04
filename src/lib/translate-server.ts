import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  book: z.string().min(1).max(80),
  chapter: z.number().int().min(1).max(200),
  sourceLang: z.enum(["gez", "am", "en"]),
  targetLang: z.enum(["en", "am", "gez"]),
  text: z.string().min(1).max(12000),
});

const LANG: Record<"gez" | "am" | "en", string> = {
  gez: "Ge'ez (classical Ethiopic of the Ethiopian Orthodox Tewahedo Church)",
  am: "Amharic",
  en: "literary English",
};

export const translateChapterFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "Translation is unavailable in this environment." };
    }

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 2200,
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content:
              "You translate sacred Ethiopian Orthodox Tewahedo scripture with reverence and accuracy. Keep verse numbers. Do not add commentary, notes, or preface. Output only the translated chapter.",
          },
          {
            role: "user",
            content: `Translate ${data.book} chapter ${data.chapter} from ${LANG[data.sourceLang]} into ${LANG[data.targetLang]}. Preserve verse numbering.\n\n${data.text}`,
          },
        ],
      }),
    });

    if (!res.ok) {
      return { ok: false as const, error: `Translation failed (${res.status}).` };
    }

    const body = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = body.choices?.[0]?.message?.content?.trim() ?? "";
    if (!text) return { ok: false as const, error: "The translator returned an empty page." };
    return { ok: true as const, text };
  });
