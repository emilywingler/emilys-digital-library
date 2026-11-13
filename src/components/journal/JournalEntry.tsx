import type { JournalArticle, Locale } from "@/types/content";
import { JournalCta, type JournalCtaLabels } from "./JournalCta";

export interface JournalEntryLabels extends JournalCtaLabels {
  inProgress: string; language: string; minutes: string; published: string;
}

/** One article: tipped-in cover plate, stamp, metadata, excerpt and CTA. */
export function JournalEntry({ article, locale, labels, feature }: { article: JournalArticle; locale: Locale; labels: JournalEntryLabels; feature?: boolean }) {
  const date = article.publishedAt
    ? new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : "en", { dateStyle: "long", timeZone: "UTC" }).format(new Date(article.publishedAt))
    : null;
  return (
    <article className={`journal-entry grid gap-6 ${feature ? "lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-10" : ""}`} aria-labelledby={`journal-title-${article.id}`}>
      <div className="journal-plate relative">
        <img src={article.cover.src} alt={article.cover.alt} width={article.cover.width} height={article.cover.height}
          loading="lazy" decoding="async" className="block aspect-video w-full object-cover" />
        {article.status === "in-progress" && (
          <span id={`journal-status-${article.id}`} className="journal-stamp">{labels.inProgress}</span>
        )}
      </div>
      <div className="min-w-0">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-masthead text-xs uppercase tracking-[0.2em] text-paper-muted">
          <span><span className="sr-only">{labels.language}: </span>{article.lang === "pt-BR" ? "PT-BR" : "EN"}</span>
          {date && <><span aria-hidden="true">·</span><span><span className="sr-only">{labels.published}: </span><time dateTime={article.publishedAt}>{date}</time></span></>}
          {article.readingMinutes && <><span aria-hidden="true">·</span><span>{labels.minutes.replace("{n}", String(article.readingMinutes))}</span></>}
        </p>
        <h3 id={`journal-title-${article.id}`} lang={article.lang} className="mt-3 font-display text-2xl font-semibold leading-tight sm:text-3xl">
          {article.title}
        </h3>
        <p lang={article.lang} className="mt-3 text-paper-muted">{article.excerpt}</p>
        <div className="mt-5"><JournalCta article={article} labels={labels} /></div>
      </div>
    </article>
  );
}
