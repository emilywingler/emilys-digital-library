import { useState, type KeyboardEvent } from "react";
import { Divider } from "@/components/decor/Ornaments";
import { OrnateArrow } from "@/components/decor/OrnateArrow";
import { useLocale } from "@/i18n/locale";
import type { JournalSlot } from "@/types/content";
import { JournalEntry } from "./JournalEntry";
import { UpcomingEntry } from "./UpcomingEntry";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * "The Wingler Journal": a small periodical between the Library and Contact.
 * One slide shown at a time; all slides share one grid cell so the section
 * keeps the tallest slide's height. Inactive slides are `inert` + hidden.
 */
export function WinglerJournal({ slots }: { slots: JournalSlot[] }) {
  const { t, locale } = useLocale();
  const [index, setIndex] = useState(0);
  if (slots.length === 0) return null;
  const total = slots.length;
  const go = (d: number) => setIndex((i) => (i + d + total) % total);
  const onKey = (e: KeyboardEvent) => {
    const tag = (e.target as HTMLElement).tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement).isContentEditable) return;
    if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
  };
  return (
    <section data-reveal id="journal" aria-labelledby="journal-heading" className="px-4 py-16 sm:px-6">
      <div className="paper journal-sheet mx-auto max-w-5xl px-5 py-10 sm:px-10">
        <header className="text-center">
          <p className="font-masthead text-xs uppercase tracking-[0.3em] text-paper-muted">{t.journal.kicker}</p>
          <h2 id="journal-heading" className="mt-2 font-masthead text-4xl sm:text-5xl">The Wingler Journal</h2>
          <p className="mt-2 font-display italic text-paper-muted">{t.journal.lead}</p>
          <Divider className="mx-auto mt-4 h-4 w-full max-w-md text-gold" />
        </header>
        <div className="mt-10" role="region" aria-roledescription="carousel" aria-label={t.journal.carousel} onKeyDown={total > 1 ? onKey : undefined}>
          <div className="journal-track">
            {slots.map((s, i) => {
              const active = i === index;
              return (
                <div key={s.id} className="journal-slide" data-active={active} aria-hidden={!active} inert={!active}
                  role="group" aria-roledescription="slide">
                  {s.kind === "article"
                    ? <JournalEntry article={s} locale={locale} labels={t.journal} feature />
                    : <UpcomingEntry title={t.journal.upcoming} note={t.journal.upcomingNote} />}
                </div>
              );
            })}
          </div>
          {total > 1 && (
            <div className="journal-nav">
              <button type="button" className="journal-nav-btn" aria-label={t.journal.prevArticle} onClick={() => go(-1)}><OrnateArrow direction="left" length="2.25rem" /></button>
              <span className="journal-nav-pos" aria-live="polite" aria-atomic="true">{pad(index + 1)} / {pad(total)}</span>
              <button type="button" className="journal-nav-btn" aria-label={t.journal.nextArticle} onClick={() => go(1)}><OrnateArrow direction="right" length="2.25rem" /></button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
