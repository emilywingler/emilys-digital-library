import { Fleuron } from "@/components/decor/Ornaments";
import { useLocale } from "@/i18n/locale";
import type { AboutBlock, AboutContent } from "@/types/content";
import { BookPage } from "./BookPage";
import { MarginNote } from "./MarginNote";

/**
 * About as an open book. md+: two pages in one spread with a spine shadow.
 * Phones: the same markup stacks into two separate leaves (no shrunk book).
 */
export function AboutBook({ content }: { content: AboutContent }) {
  const { locale, t } = useLocale();
  const lang = locale === "pt" ? "pt-BR" : "en";

  const block = (label: string, b: AboutBlock) => (
    <div className="relative">
      <h4 className="font-masthead text-sm uppercase tracking-[0.2em] text-paper-muted">
        {label}
        {b.placeholder && <span className="block font-body text-[0.6rem] normal-case tracking-wider opacity-70">({t.about.draft})</span>}
      </h4>
      <ul className={`mt-2 space-y-1 text-base ${b.placeholder ? "italic text-paper-muted" : ""}`}>
        {b.items.map((i) => (
          <li key={i.en} className="flex gap-2"><Fleuron className="mt-2 h-2 w-2 shrink-0 text-olive" />{i[locale]}</li>
        ))}
      </ul>
      {b.note && <MarginNote note={b.note} side="right" />}
    </div>
  );

  return (
    <section id="about" aria-labelledby="about-title" className="px-3 py-12 sm:px-6 ">
      <h2 id="about-title" className="mb-6 text-center font-display text-3xl italic text-foreground">
        <span className="block font-masthead text-xs not-italic uppercase tracking-[0.3em] text-primary">{t.about.chapter}</span>
        {t.about.title}
      </h2>
      <div lang={lang} className="mx-auto grid max-w-6xl animate-ink gap-6 md:paper md:book-spine md:grid-cols-2 md:gap-0">
        <div className="paper leaf-edge md:border-0 md:bg-none md:shadow-none">
          <BookPage runningHead={t.about.chapter} title={t.about.pathTitle} folio={1} side="left">
            <ol className="space-y-5 border-l border-rule pl-5">
              {content.timeline.map((e) => (
                <li key={e.id} className="relative">
                  <span className="absolute -left-[1.6rem] top-1.5 h-2 w-2 rotate-45 bg-paper-muted" aria-hidden />
                  <p className="text-xs uppercase tracking-[0.18em] text-paper-muted">{e.period[locale]}</p>
                  <p className="font-display text-xl font-semibold leading-tight">{e.role[locale]}</p>
                  <p className="text-sm italic text-paper-muted">{e.place}</p>
                  <p className="mt-1 text-sm leading-relaxed">{e.summary[locale]}</p>
                  {e.note && <MarginNote note={e.note} side="left" />}
                </li>
              ))}
            </ol>
          </BookPage>
        </div>
        <div className="paper leaf-edge md:border-0 md:bg-none md:shadow-none">
          <BookPage runningHead={t.about.title} title={t.about.interestsTitle} folio={2} side="right">
            <div className="space-y-6">
              {block(t.about.interestAreas, content.interestAreas)}
              {block(t.about.studyAreas, content.studyAreas)}
              {block(t.about.languages, content.languages)}
              {block(t.about.goals, content.goals)}
            </div>
          </BookPage>
        </div>
      </div>
    </section>
  );
}
