import { Divider } from "@/components/decor/Ornaments";
import { useLocale } from "@/i18n/locale";
import type { JournalArticle } from "@/types/content";
import { JournalEntry } from "./JournalEntry";

/** "The Wingler Journal": a small periodical between the Library and Contact. */
export function WinglerJournal({ articles }: { articles: JournalArticle[] }) {
  const { t, locale } = useLocale();
  if (articles.length === 0) return null;
  const single = articles.length === 1;
  return (
    <section id="journal" aria-labelledby="journal-heading" className="px-4 py-16 sm:px-6">
      <div className="paper journal-sheet mx-auto max-w-5xl px-5 py-10 sm:px-10">
        <header className="text-center">
          <p className="font-masthead text-xs uppercase tracking-[0.3em] text-paper-muted">{t.journal.kicker}</p>
          <h2 id="journal-heading" className="mt-2 font-masthead text-4xl sm:text-5xl">The Wingler Journal</h2>
          <p className="mt-2 font-display italic text-paper-muted">{t.journal.lead}</p>
          <Divider className="mx-auto mt-4 h-4 w-full max-w-md text-gold" />
        </header>
        <ul className={`mt-10 grid gap-12 ${single ? "" : "lg:grid-cols-2"}`}>
          {articles.map((a) => (
            <li key={a.id}><JournalEntry article={a} locale={locale} labels={t.journal} feature={single} /></li>
          ))}
        </ul>
      </div>
    </section>
  );
}
