import * as D from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { manuscriptExtras, manuscripts } from "@/content/manuscripts";
import { ManuscriptGlyph } from "@/components/decor/ManuscriptGlyphs";
import { useLocale } from "@/i18n/locale";
import { useManuscripts } from "./ManuscriptProvider";
import { ManuscriptNoteBody, formatNo } from "./ManuscriptNoteBody";
import { SECTION_HEADING } from "./placement";

const pad = (n: number) => String(n).padStart(2, "0");

function focusStable(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}

/** Page-level note dialog, collection indicator + overview, and the final letter. */
export function ManuscriptLayer() {
  const { ready, found, dialog, setDialog } = useManuscripts();
  const { locale, t } = useLocale();
  const tm = t.manuscripts;
  const note = dialog?.kind === "note" ? manuscripts.find((m) => m.id === dialog.id) : undefined;
  const count = found.size;
  const complete = count === manuscripts.length;
  const L = manuscriptExtras.letter;

  const close = (focusId?: string) => {
    setDialog(null);
    if (focusId) setTimeout(() => focusStable(focusId), 0);
  };

  return (
    <>
      {ready && count > 0 && (
        <button type="button" className="ms-counter paper" onClick={() => setDialog({ kind: "collection" })}
          aria-label={tm.openCollection.replace("{n}", pad(count))} id="ms-counter">
          <ManuscriptGlyph variant="seal" className="h-4 w-4 shrink-0 text-gold" />
          <span className="flex min-w-0 flex-col text-left">
            <span className="font-masthead text-[0.65rem] uppercase tracking-[0.2em] text-paper-muted">{tm.title} · <span className="whitespace-nowrap tabular-nums">{pad(count)}/07</span></span>
            <span className="ms-counter-line font-display text-sm italic leading-tight">{tm.lines[count - 1]}</span>
          </span>
        </button>
      )}

      <D.Root open={!!note} onOpenChange={(o) => { if (!o && note) close(SECTION_HEADING[note.section]); }}>
        <D.Portal>
          <D.Overlay className="ms-overlay" />
          <D.Content className="ms-panel paper" aria-describedby={undefined}
            onCloseAutoFocus={(e) => e.preventDefault()}>
            {note && <>
              <D.Title className="sr-only">{formatNo(note.number, tm)}</D.Title>
              <ManuscriptNoteBody m={note} locale={locale} t={tm} fresh />
              <D.Close aria-label={tm.close} className="ms-close"><X className="h-4 w-4" aria-hidden="true" /></D.Close>
            </>}
          </D.Content>
        </D.Portal>
      </D.Root>

      <D.Root open={dialog?.kind === "collection"} onOpenChange={(o) => { if (!o) close("ms-counter"); }}>
        <D.Portal>
          <D.Overlay className="ms-overlay" />
          <D.Content className="ms-panel paper" aria-describedby="ms-progress" onCloseAutoFocus={(e) => e.preventDefault()}>
            <D.Title className="font-display text-2xl italic">{tm.collection}</D.Title>
            <p id="ms-progress" className="mt-1 font-masthead text-xs uppercase tracking-[0.2em] text-paper-muted">{tm.progress.replace("{n}", pad(count))}</p>
            <ol className="mt-4 divide-y divide-rule border-y border-rule">
              {manuscripts.map((m) => {
                const has = found.has(m.id);
                return (
                  <li key={m.id} className="flex min-h-11 items-center gap-3 py-1.5" data-found={has}>
                    <ManuscriptGlyph variant={m.variant} className={has ? "h-4 w-4 shrink-0 text-gold" : "h-4 w-4 shrink-0 text-paper-muted/40"} />
                    <span className="font-masthead text-xs tracking-[0.15em] text-paper-muted">{formatNo(m.number, tm)}</span>
                    {has
                      ? <span className="font-display italic">{m.title[locale]}</span>
                      : <span className="text-sm italic text-paper-muted/70">{tm.stillLost}</span>}
                  </li>
                );
              })}
            </ol>
            {complete && (
              <button type="button" className="mt-4 font-display italic underline decoration-gold underline-offset-4" onClick={() => setDialog({ kind: "letter" })}>{tm.reread}</button>
            )}
            <D.Close aria-label={tm.closeCollection} className="ms-close"><X className="h-4 w-4" aria-hidden="true" /></D.Close>
          </D.Content>
        </D.Portal>
      </D.Root>

      <D.Root open={dialog?.kind === "letter"} onOpenChange={(o) => { if (!o) close("ms-counter"); }}>
        <D.Portal>
          <D.Overlay className="ms-overlay" />
          <D.Content className="ms-panel ms-letter paper" aria-describedby={undefined} onCloseAutoFocus={(e) => e.preventDefault()}>
            <div lang={locale === "pt" ? "pt-BR" : "en"}>
              <ManuscriptGlyph variant="seal" className="mx-auto h-6 w-6 text-gold" />
              <D.Title className="mt-3 text-center font-display text-3xl italic leading-tight">{L.title[locale]}</D.Title>
              <div className="mx-auto mt-3 h-px w-24 bg-gold/60" aria-hidden="true" />
              {L.paragraphs.map((p) => <p key={p.en} className="mt-4 leading-relaxed">{p[locale]}</p>)}
              <p className="mt-6 font-display italic">{L.closing[locale]}</p>
              <p className="font-display text-2xl italic">{L.signature}</p>
            </div>
            <D.Close aria-label={tm.closeLetter} className="ms-close"><X className="h-4 w-4" aria-hidden="true" /></D.Close>
          </D.Content>
        </D.Portal>
      </D.Root>
    </>
  );
}
