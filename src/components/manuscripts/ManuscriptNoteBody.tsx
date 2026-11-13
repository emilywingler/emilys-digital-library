import type { Locale, Manuscript } from "@/types/content";
import type { Messages } from "@/i18n/messages";
import { ManuscriptGlyph } from "@/components/decor/ManuscriptGlyphs";

export const formatNo = (n: number, t: Messages["manuscripts"]) => `${t.no} ${String(n).padStart(2, "0")}`;

/** Parchment note content shared by the page dialog and the inline book panel. */
export function ManuscriptNoteBody({ m, locale, t, fresh, titleId }: { m: Manuscript; locale: Locale; t: Messages["manuscripts"]; fresh: boolean; titleId?: string }) {
  return (
    <div lang={locale === "pt" ? "pt-BR" : "en"}>
      <div className="flex items-center justify-between gap-3 border-b border-rule pb-2 font-masthead text-xs uppercase tracking-[0.25em] text-paper-muted">
        <span className="flex items-center gap-2 whitespace-nowrap"><ManuscriptGlyph variant={m.variant} className="h-4 w-4 text-gold" />{formatNo(m.number, t)}</span>
        {fresh && <span role="status" className="ms-stamp text-right">{t.recovered}</span>}
      </div>
      <p id={titleId} className="mt-4 font-display text-2xl italic leading-snug">{m.title[locale]}</p>
      {m.paragraphs.map((p) => <p key={p.en} className="mt-3 leading-relaxed">{p[locale]}</p>)}
      <p className="mt-4 text-right font-display italic text-paper-muted">{m.signature[locale]}</p>
    </div>
  );
}
