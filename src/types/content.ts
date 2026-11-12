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
