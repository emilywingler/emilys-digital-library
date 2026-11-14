import { ManuscriptZone } from "@/components/manuscripts/ManuscriptMarker";
import { useLocale } from "@/i18n/locale";
import type { ExperienceEntry, SkillCategory } from "@/types/content";
import { CardCatalog } from "./CardCatalog";

/** Skills section: binds locale + strings to the card catalog. */
export function SkillsCatalog({ categories, experience }: { categories: SkillCategory[]; experience: ExperienceEntry[] }) {
  const { locale, t } = useLocale();
  const experienceNames = Object.fromEntries(experience.map((e) => [e.id, e.organization]));
  return (
    <section data-section="skills" id="skills" aria-labelledby="skills-title" className="relative mx-auto max-w-5xl px-3 py-12 sm:px-6">
      <h2 id="skills-title" className="mb-4 font-display text-3xl italic text-foreground">
        <span className="block font-masthead text-xs not-italic uppercase tracking-[0.3em] text-primary">{t.skills.kicker}</span>
        {t.skills.title}
      </h2>
      <ManuscriptZone host="skills:section" />
      <CardCatalog categories={categories} locale={locale} label={t.skills.drawersLabel}
        cardLabels={{ seeAlso: t.skills.seeAlso, levels: t.skills.levels }} experienceNames={experienceNames} />
    </section>
  );
}
