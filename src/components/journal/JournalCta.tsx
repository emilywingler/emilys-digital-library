import type { JournalArticle } from "@/types/content";

/** True only for absolute https URLs. */
export function isSafeExternalUrl(url?: string): url is string {
  if (!url) return false;
  try { return new URL(url).protocol === "https:"; } catch { return false; }
}

export interface JournalCtaLabels { read: string; newTab: string; unavailable: string }

/**
 * "Read on Medium". In progress → native disabled button (never a link).
 * Published + https URL → new-tab link. Published without a valid URL → nothing.
 */
export function JournalCta({ article, labels }: { article: JournalArticle; labels: JournalCtaLabels }) {
  if (article.status === "in-progress") {
    return (
      <button type="button" disabled className="journal-cta" aria-describedby={`journal-status-${article.id}`}>
        {labels.read}
      </button>
    );
  }
  if (!isSafeExternalUrl(article.url)) return null;
  return (
    <a href={article.url} target="_blank" rel="noopener noreferrer" className="journal-cta">
      {labels.read}<span className="sr-only"> {labels.newTab}</span>
    </a>
  );
}
