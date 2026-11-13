import { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as D from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { Locale, Project } from "@/types/content";
import type { Messages } from "@/i18n/messages";
import { BookPageInfo } from "./BookPageInfo";
import { BookPageMedia } from "./BookPageMedia";

/** Phase timings (ms). CSS keyframes in styles.css use the same durations. */
export const COVER_MS = 380;
export const HINGE_MS = 620;
/** Closing: cover swings shut over the pages, then flies back to its spine. */
export const FOLD_MS = 520;
export const RETURN_MS = 420;

export type BookPhase = "cover" | "opening" | "open" | "folding" | "returning";

interface Props {
  project: Project;
  locale: Locale;
  t: Messages["projects"];
  reduceMotion: boolean;
  onClosed: () => void;
  /** Element to refocus after closing (the spine that opened the book). */
  returnFocus: () => void;
  /** Current on-screen rect of the spine this book came from (measured when the return starts). */
  getOrigin?: () => DOMRect | undefined;
}

/**
 * Floating open book. Radix Dialog supplies focus trap, Escape, outside-click,
 * scroll lock and labelling; this component only adds the phase sequence:
 * cover shown → cover swings open on its left edge → pages fade in. Closing
 * reverses it: (open → folding) → returning, where the closed cover moves and
 * scales onto the spine's measured position, then unmounts.
 * One shared scroll surface contains both pages; CSS switches to a bound
 * vertical leaf when two readable pages cannot fit. Page content stays hidden until the hinge finishes. Reduced motion jumps
 * straight to "open" and closes instantly.
 */
export function OpenBook({ project, locale, t, reduceMotion, onClosed, returnFocus, getOrigin }: Props) {
  const [phase, setPhase] = useState<BookPhase>(reduceMotion ? "open" : "cover");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const coverRef = useRef<HTMLImageElement>(null);
  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const later = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); };

  useEffect(() => {
    if (!reduceMotion) {
      later(() => setPhase("opening"), COVER_MS);
      later(() => setPhase("open"), COVER_MS + HINGE_MS);
    }
    return clearTimers; // also drops any pending close callbacks on unmount
  }, [reduceMotion]);

  // Measure once when the return starts: spine centre minus cover centre, in
  // viewport px. Ancestors only translate (never scale), so that delta is also
  // the cover's local translate. Invalid origin → CSS defaults shrink in place.
  useLayoutEffect(() => {
    if (phase !== "returning") return;
    const cover = coverRef.current;
    if (!cover) return;
    const from = cover.getBoundingClientRect();
    const to = getOrigin?.();
    if (to && to.width > 0 && to.height > 0 && from.height > 0) {
      cover.style.setProperty("--ret-x", `${to.left + to.width / 2 - (from.left + from.width / 2)}px`);
      cover.style.setProperty("--ret-y", `${to.top + to.height / 2 - (from.top + from.height / 2)}px`);
      cover.style.setProperty("--ret-s", String(to.height / from.height));
      cover.setAttribute("data-return", "spine");
    } else cover.setAttribute("data-return", "fallback");
  }, [phase, getOrigin]);

  const requestClose = () => {
    if (phase === "folding" || phase === "returning") return;
    clearTimers();
    if (reduceMotion) return onClosed();
    const toReturn = () => { setPhase("returning"); later(onClosed, RETURN_MS); };
    if (phase === "open") { setPhase("folding"); later(toReturn, FOLD_MS); }
    else toReturn(); // cover / opening: the cover is already closed-ish, skip the fold
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
            {phase !== "open" && (
              <img ref={coverRef} src={project.cover[locale]} alt="" aria-hidden="true" className="book-cover" draggable={false} />
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
