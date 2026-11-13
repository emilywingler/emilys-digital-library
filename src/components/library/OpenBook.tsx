import { useEffect, useRef, useState } from "react";
import * as D from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { Locale, Project } from "@/types/content";
import type { Messages } from "@/i18n/messages";
import { BookPageInfo } from "./BookPageInfo";
import { BookPageMedia } from "./BookPageMedia";

/** Phase timings (ms). CSS keyframes in styles.css use the same durations. */
export const COVER_MS = 380;
export const HINGE_MS = 620;
export const CLOSE_MS = 220;

export type BookPhase = "cover" | "opening" | "open" | "closing";

interface Props {
  project: Project;
  locale: Locale;
  t: Messages["projects"];
  reduceMotion: boolean;
  onClosed: () => void;
  /** Element to refocus after closing (the spine that opened the book). */
  returnFocus: () => void;
}

/**
 * Floating open book. Radix Dialog supplies focus trap, Escape, outside-click,
 * scroll lock and labelling; this component only adds the phase sequence:
 * cover shown → cover swings open on its left edge → pages fade in → (closing).
 * One shared scroll surface contains both pages; CSS switches to a bound
 * vertical leaf when two readable pages cannot fit. Page content stays hidden until the hinge finishes. Reduced motion jumps
 * straight to "open" and closes instantly.
 */
export function OpenBook({ project, locale, t, reduceMotion, onClosed, returnFocus }: Props) {
  const [phase, setPhase] = useState<BookPhase>(reduceMotion ? "open" : "cover");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (reduceMotion) return;
    timers.current.push(setTimeout(() => setPhase("opening"), COVER_MS));
    timers.current.push(setTimeout(() => setPhase("open"), COVER_MS + HINGE_MS));
    return () => timers.current.forEach(clearTimeout);
  }, [reduceMotion]);

  const requestClose = () => {
    if (phase === "closing") return;
    timers.current.forEach(clearTimeout);
    if (reduceMotion) return onClosed();
    setPhase("closing");
    timers.current.push(setTimeout(onClosed, CLOSE_MS));
  };

  return (
    <D.Root open onOpenChange={(o) => { if (!o) requestClose(); }}>
      <D.Portal>
        <D.Overlay className="book-overlay fixed inset-0 z-50" data-phase={phase} />
        <D.Content
          data-phase={phase}
          data-testid="open-book"
          className="open-book fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 outline-none"
          onCloseAutoFocus={(e) => { e.preventDefault(); returnFocus(); }}
        >
          <div className="relative">
            <div className="book-scroll scrollbar-archive">
              <div className="book-spread">
                <section className="book-page book-page-left paper"><div className="book-page-content h-full"><BookPageInfo project={project} locale={locale} t={t} /></div></section>
                <div className="book-gutter" aria-hidden="true" />
                 <section className="book-page book-page-right" data-media-state={project.media.length ? "available" : "empty"} aria-label={t.plateLabel}><div className="book-page-content h-full"><BookPageMedia project={project} locale={locale} t={t} /></div></section>
              </div>
            </div>
            {phase !== "open" && phase !== "closing" && (
              <img src={project.cover[locale]} alt="" aria-hidden="true" className="book-cover" draggable={false} />
            )}
            <D.Close aria-label={t.close} className="book-close">
              <X className="h-5 w-5" aria-hidden="true" />
            </D.Close>
          </div>
        </D.Content>
      </D.Portal>
    </D.Root>
  );
}
