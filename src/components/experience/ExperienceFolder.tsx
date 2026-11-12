import { FolderTabs } from "@/components/folder/FolderTabs";
import { useLocale } from "@/i18n/locale";
import type { ExperienceEntry } from "@/types/content";

/** Experience section: maps CV entries into the archive folder. */
export function ExperienceFolder({ entries }: { entries: ExperienceEntry[] }) {
  const { locale, t } = useLocale();
  const items = entries.map((e, i) => ({
    id: e.id,
    index: `Nº ${String(i + 1).padStart(2, "0")} //`,
    label: e.tab[locale],
    content: (
      <article lang={locale === "pt" ? "pt-BR" : "en"}>
        <p className="text-xs uppercase tracking-[0.2em] text-paper-muted">
          {e.period[locale]}{e.kind === "education" && ` · ${t.experience.education}`}
        </p>
        <h3 className="mt-2 font-display text-2xl font-semibold leading-tight sm:text-3xl">{e.role[locale]}</h3>
        <p className="mt-1 italic text-paper-muted">{e.organization}</p>
        {e.bullets.length > 0 && (
          <ul className="mt-5 max-w-3xl space-y-2 border-t border-rule pt-5 leading-relaxed">
            {e.bullets.map((b) => <li key={b.en} className="pl-4 -indent-4">— {b[locale]}</li>)}
          </ul>
        )}
      </article>
    ),
  }));
  return (
    <section id="experience" aria-labelledby="experience-title" className="mx-auto max-w-5xl px-3 py-12 sm:px-6">
      <h2 id="experience-title" className="mb-4 font-display text-3xl italic text-foreground">
        <span className="block font-masthead text-xs not-italic uppercase tracking-[0.3em] text-primary">{t.experience.kicker}</span>
        {t.experience.title}
      </h2>
      <FolderTabs items={items} label={t.experience.tabsLabel} hint={t.experience.hint} />
    </section>
  );
}
