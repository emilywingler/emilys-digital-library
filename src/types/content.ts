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

/** Optional visual shown on the right page of an open book. Discriminated by `type`. */
export type ProjectMedia =
  | { type: "image" | "gif"; src: string; alt: LocalizedText }
  | { type: "video"; src: string; poster?: string; caption: LocalizedText }
  | { type: "video-link"; href: string; label: LocalizedText }
  | { type: "dashboard"; embedUrl: string; title: LocalizedText };

/** One real project book on the shelf. */
export interface Project {
  id: string;
  /** Fixed catalog reference — never derived from shelf position or order. */
  catalogNo: string;
  title: LocalizedText;
  intro: LocalizedText;
  description: LocalizedText;
  context: LocalizedText;
  /** Plain string when the name is the same in both languages. */
  technologies: (string | LocalizedText)[];
  /** `null` = not yet confirmed by Emily; the UI shows a review placeholder. */
  contribution: LocalizedText | null;
  repoUrl: string;
  links?: { label: LocalizedText; href: string }[];
  /** Cover artwork URL per locale. */
  cover: Record<Locale, string>;
  /** Spine artwork URL; one version shared by both locales. */
  spine: string;
  media: ProjectMedia[];
  shelf: 1 | 2 | 3;
  order: number;
  featured: boolean;
  /** Rendered spine height in rem; width follows the artwork's 137:842 ratio. */
  spineHeight: number;
}

/** Non-interactive shelf filler (plain book or small object). */
export interface ShelfDecor {
  id: string;
  kind: "book" | "globe" | "plant";
  shelf: 1 | 2 | 3;
  order: number;
  /** Book only: height/width in rem and tone 1–4. */
  height?: number;
  width?: number;
  tone?: 1 | 2 | 3 | 4;
  lean?: boolean;
}
