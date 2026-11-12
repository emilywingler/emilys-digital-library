import type { Messages } from "@/i18n/messages";

/**
 * Ordered list of page sections. The header menu and the page body both read
 * from here, so adding a section is one entry (+ its translated label).
 */
export const SECTIONS = ["home", "about", "experience", "skills", "projects", "contact"] as const;
export type SectionId = (typeof SECTIONS)[number];
export type SectionLabelKey = keyof Messages["nav"] & SectionId;
