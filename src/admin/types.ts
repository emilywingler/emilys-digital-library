/**
 * Admin-side content models. They reuse the public types in
 * `@/types/content` and are flattened so each one maps 1:1 to a future table
 * row. Array order in a collection is the display order.
 */
import type { Locale, LocalizedText, Project } from "@/types/content";

/** Administrative label only — it never publishes anything to the public site. */
export type PublishStatus = "draft" | "published";

export interface Entity { id: string }

export interface HomeSettings { description: LocalizedText; portraitSrc: string; portraitAlt: LocalizedText }
export interface HomeCta extends Entity { label: LocalizedText; href: string }

export interface ExperienceTab extends Entity { name: LocalizedText }
export interface AdminExperience extends Entity {
  tabId: string;
  period: LocalizedText;
  role: LocalizedText;
  location: string;
  description: LocalizedText;
}

export interface SkillDrawer extends Entity { name: LocalizedText; code: string; status: PublishStatus }
export interface SkillCard extends Entity { drawerId: string; title: LocalizedText; description: LocalizedText }

export interface TechTag extends Entity { name: LocalizedText }
export interface ProjectImage extends Entity { src: string; alt: LocalizedText; caption: LocalizedText }
export interface ProjectLink extends Entity { label: string; url: string }
export interface AdminProject extends Entity {
  catalogNo: string;
  /** Only the existing shelves; shelves are never created here. */
  shelf: Project["shelf"];
  status: PublishStatus;
  cover: Record<Locale, string>;
  spine: string;
  spineText: LocalizedText;
  title: LocalizedText;
  subtitle: LocalizedText;
  description: LocalizedText;
  complement: LocalizedText;
  contribution: LocalizedText;
  technologies: TechTag[];
  images: ProjectImage[];
  links: ProjectLink[];
}

export interface AdminJournalArticle extends Entity {
  title: LocalizedText;
  description: LocalizedText;
  coverSrc: string;
  lang: "pt-BR" | "en";
  status: PublishStatus;
  url: string;
}

export interface FooterSettings { title: LocalizedText; description: LocalizedText }
export const FOOTER_ICONS = ["github", "linkedin", "mail", "youtube", "rss", "globe"] as const;
export type FooterIcon = (typeof FOOTER_ICONS)[number];
export interface FooterLink extends Entity { platform: string; url: string; icon: FooterIcon; active: boolean }

export interface AdminManuscript extends Entity {
  /** 1–7 for manuscripts, `null` for the final letter. */
  number: number | null;
  title: LocalizedText;
  description: LocalizedText;
}

export const emptyText = (): LocalizedText => ({ pt: "", en: "" });
