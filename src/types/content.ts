/**
 * Shared content models. Every visitor-facing string that changes with the
 * language is a {@link LocalizedText}, so a future database row maps 1:1
 * (e.g. two columns `title_pt` / `title_en`, or a JSONB `{ pt, en }`).
 */
export type Locale = "pt" | "en";

/** A string available in every supported locale. */
export type LocalizedText = Record<Locale, string>;

/** Identity shown on the Home front page. */
export interface Profile {
  name: string;
  headline: LocalizedText;
  intro: LocalizedText;
  location: LocalizedText;
}

/** A professional link. Only real, confirmed links belong here. */
export interface ContactLink {
  id: "github" | "linkedin" | "email";
  label: string;
  /** Visible handle, e.g. "github.com/emilywingler" */
  display: string;
  href: string;
}


/** One file in the Experience folder. Bullets are copied from the CV verbatim (pt) and translated (en). */
export interface ExperienceEntry {
  id: string;
  tab: LocalizedText;
  kind: "work" | "education";
  period: LocalizedText;
  role: LocalizedText;
  organization: string;
  bullets: LocalizedText[];
}

/** Descriptive familiarity label. Never a percentage; only set when Emily confirms it. */
export type SkillLevel = "familiarity" | "developing" | "practical";

/** One index card in the Skills catalog. */
export interface SkillEntry {
  /** Catalog reference, e.g. "PRG-01". Unique across the catalog. */
  code: string;
  /** Name as written in the CV (pt). */
  name: string;
  /** English name, when it differs. */
  nameEn?: string;
  description: LocalizedText;
  /** Ids of {@link ExperienceEntry} whose CV bullets name this skill. */
  seeAlso?: string[];
  level?: SkillLevel;
}

/** One catalog drawer. */
export interface SkillCategory {
  id: string;
  code: string;
  label: LocalizedText;
  skills: SkillEntry[];
}
