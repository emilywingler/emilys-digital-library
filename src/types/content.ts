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

/** Handwritten-style note in a page margin. `placeholder` marks text awaiting Emily's wording. */
export interface MarginNoteData {
  text: LocalizedText;
  placeholder?: boolean;
}

/** One stop on the About timeline (only facts from the CV). */
export interface TimelineEntry {
  id: string;
  period: LocalizedText;
  role: LocalizedText;
  place: string;
  summary: LocalizedText;
  note?: MarginNoteData;
}

/** A labelled block of text on the About right page. */
export interface AboutBlock {
  items: LocalizedText[];
  placeholder?: boolean;
  note?: MarginNoteData;
}

export interface AboutContent {
  timeline: TimelineEntry[];
  interestAreas: AboutBlock;
  studyAreas: AboutBlock;
  languages: AboutBlock;
  goals: AboutBlock;
}
