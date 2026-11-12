import { useLocale } from "@/i18n/locale";
import type { MarginNoteData } from "@/types/content";

/**
 * Handwritten-style note. On md+ it hangs in the page's outer margin
 * (`side`); on phones it sits inline, indented under its line.
 */
export function MarginNote({ note, side }: { note: MarginNoteData; side: "left" | "right" }) {
  const { locale, t } = useLocale();
  const pos = side === "left" ? "lg:-left-[8.5rem] lg:-rotate-3" : "lg:-right-[8.5rem] lg:rotate-3";
  return (
    <aside className={`ink-note mt-2 border-l border-rule pl-3 text-base lg:absolute lg:top-0 lg:mt-0 lg:w-28 lg:border-0 lg:pl-0 lg:text-center ${pos}`}>
      {note.text[locale]}
      {note.placeholder && <span className="block text-[0.6rem] not-italic uppercase tracking-[0.2em] opacity-70">{t.about.draft}</span>}
    </aside>
  );
}
