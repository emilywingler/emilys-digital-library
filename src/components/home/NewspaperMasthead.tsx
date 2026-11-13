import { Fleuron } from "@/components/decor/Ornaments";
import { manuscriptExtras } from "@/content/manuscripts";
import { useLocale } from "@/i18n/locale";

/**
 * Newspaper nameplate: edition line, title and date line between double rules.
 * The date is formatted per locale with the built-in Intl API (no date library).
 */
export function NewspaperMasthead() {
  const { locale, t } = useLocale();
  const year = new Date().getFullYear();
  return (
    <div className="text-center">
      <div className="flex items-center justify-between gap-2 border-b border-rule pb-2 text-[0.65rem] uppercase tracking-[0.25em] text-paper-muted sm:text-xs">
        <span>{t.home.edition}</span>
        <span className="hidden sm:inline">{t.home.est}</span>
        <span>{locale === "pt" ? `Ano ${year}` : `Year ${year}`}</span>
      </div>
      <p className="mt-4 font-masthead text-4xl leading-none sm:text-6xl md:text-7xl">
        The Wingler Archive
      </p>
      <div className="mt-4 rule-double" />
      <p className="flex items-center justify-center gap-3 pt-3 font-display text-base italic text-paper-muted sm:text-lg">
        <Fleuron className="h-3 w-3" /> {t.home.lead} <Fleuron className="h-3 w-3" />
      </p>
      <aside className="mx-auto mt-2 max-w-md text-xs italic leading-snug text-paper-muted" lang={locale === "pt" ? "pt-BR" : "en"}>
        <span className="font-semibold">{manuscriptExtras.hint.title[locale]}</span> — {manuscriptExtras.hint.body[locale]}
      </aside>
    </div>
  );
}
