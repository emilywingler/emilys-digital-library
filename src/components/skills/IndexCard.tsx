import type { Locale, SkillEntry } from "@/types/content";

export interface IndexCardLabels {
  seeAlso: string;
  levels: Record<NonNullable<SkillEntry["level"]>, string>;
}

/** A library index card for one skill. `experienceNames` resolves `seeAlso` ids. */
export function IndexCard({ skill, locale, labels, experienceNames }: {
  skill: SkillEntry; locale: Locale; labels: IndexCardLabels; experienceNames: Record<string, string>;
}) {
  const name = locale === "en" ? skill.nameEn ?? skill.name : skill.name;
  return (
    <li className="index-card rounded-sm px-5 pb-4 pt-3">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-masthead text-[0.65rem] uppercase tracking-[0.25em] text-paper-muted">{skill.code}</span>
        {skill.level && <span className="text-[0.65rem] uppercase tracking-[0.15em] text-olive">{labels.levels[skill.level]}</span>}
      </div>
      <h3 className="mt-1 border-b border-card-rule pb-1.5 font-display text-xl font-semibold leading-tight">{name}</h3>
      <p className="mt-2 text-sm leading-relaxed">{skill.description[locale]}</p>
      {skill.seeAlso?.length ? (
        <p className="mt-2 text-xs italic text-paper-muted">
          {labels.seeAlso}: {skill.seeAlso.map((id) => experienceNames[id] ?? id).join(", ")}
        </p>
      ) : null}
    </li>
  );
}
