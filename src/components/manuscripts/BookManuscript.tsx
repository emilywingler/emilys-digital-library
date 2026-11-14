import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { Manuscript } from "@/types/content";
import { useLocale } from "@/i18n/locale";
import { useManuscripts } from "./ManuscriptProvider";
import { ManuscriptNoteBody } from "./ManuscriptNoteBody";
import { MarkerButton } from "./ManuscriptMarker";

/**
 * Nº 05 inside an opened book (fleuron, info page or media page). Its note is an
 * inline, non-modal parchment panel inside the book's own dialog: Escape is
 * captured on window (before Radix's document listener) so it closes only the
 * note, and focus returns to the book's close button.
 */
export function BookManuscriptPanel({ m: M, anchor }: { m: Manuscript; anchor: string }) {
  const { discover, queueLetter, found } = useManuscripts();
  const { locale, t } = useLocale();
  const [open, setOpen] = useState<{ fresh: boolean } | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLSpanElement>(null);

  const close = () => {
    const dialog = host.current?.closest('[role="dialog"]');
    setOpen(null);
    setTimeout(() => dialog?.querySelector<HTMLElement>(".book-close")?.focus(), 0);
  };

  useEffect(() => {
    if (!open) return;
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopImmediatePropagation(); e.preventDefault(); close();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <span ref={host}>
      {!found.has(M.id) && <MarkerButton m={M} anchor={anchor} onActivate={() => { const done = discover(M.id); setOpen({ fresh: true }); if (done) queueLetter(); }} />}
      {open && (
        <div ref={panel} tabIndex={-1} role="group" aria-labelledby="ms-book-title" className="ms-book-panel paper">
          <button type="button" onClick={close} aria-label={t.manuscripts.close} className="ms-close"><X className="h-4 w-4" aria-hidden="true" /></button>
          <ManuscriptNoteBody m={M} locale={locale} t={t.manuscripts} fresh={open.fresh} titleId="ms-book-title" />
        </div>
      )}
    </span>
  );
}
