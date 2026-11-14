/**
 * Initial admin data, mapped from the public content in `src/content/` and the
 * interface strings. Nothing here is new copy: every value is read from those
 * sources. Fields the public data has no equivalent for start empty.
 */
import { experience } from "@/content/experience";
import { journalArticles } from "@/content/journal";
import { contactLinks } from "@/content/links";
import { manuscriptExtras, manuscripts } from "@/content/manuscripts";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { skillCategories } from "@/content/skills";
import { messages } from "@/i18n/messages";
import type { LocalizedText } from "@/types/content";
import type {
  AdminExperience, AdminJournalArticle, AdminManuscript, AdminProject, ExperienceTab,
  FooterLink, FooterSettings, HomeCta, HomeSettings, SkillCard, SkillDrawer,
} from "../types";

const pair = (pick: (l: "pt" | "en") => string): LocalizedText => ({ pt: pick("pt"), en: pick("en") });
const joinParas = (ps: LocalizedText[]): LocalizedText => pair((l) => ps.map((p) => p[l]).join("\n\n"));

export interface AdminSeed {
  home: HomeSettings; ctas: HomeCta[];
  tabs: ExperienceTab[]; experiences: AdminExperience[];
  drawers: SkillDrawer[]; cards: SkillCard[];
  projects: AdminProject[]; journal: AdminJournalArticle[];
  footer: FooterSettings; footerLinks: FooterLink[];
  manuscripts: AdminManuscript[];
}

export function createSeed(): AdminSeed {
  const linkedIn = contactLinks.find((c) => c.id === "linkedin");
  return {
    home: { description: { ...profile.intro }, portraitSrc: profile.portrait.src, portraitAlt: { ...profile.portrait.alt } },
    ctas: [
      { id: "cta-linkedin", label: pair((l) => messages[l].home.connectLinkedIn), href: linkedIn?.href ?? "" },
      { id: "cta-projects", label: pair((l) => messages[l].home.exploreProjects), href: "#projects" },
    ],
    tabs: experience.map((e) => ({ id: `tab-${e.id}`, name: { ...e.tab } })),
    experiences: experience.map((e) => ({
      id: e.id, tabId: `tab-${e.id}`, period: { ...e.period }, role: { ...e.role },
      location: e.organization, description: pair((l) => e.bullets.map((b) => b[l]).join("\n")),
    })),
    drawers: skillCategories.map((c) => ({ id: c.id, name: { ...c.label }, code: c.code, status: "published" })),
    cards: skillCategories.flatMap((c) => c.skills.map((s) => ({
      id: s.code, drawerId: c.id, title: { pt: s.name, en: s.nameEn ?? s.name }, description: { ...s.description },
    }))),
    projects: [...projects].sort((a, b) => a.shelf - b.shelf || a.order - b.order).map((p) => ({
      id: p.id, catalogNo: p.catalogNo, shelf: p.shelf, status: "published",
      cover: { ...p.cover }, spine: p.spine, spineText: { pt: "", en: "" },
      title: { ...p.title }, subtitle: { ...p.intro }, description: { ...p.description }, complement: { ...p.context },
      contribution: p.contribution ? { ...p.contribution } : { pt: "", en: "" },
      technologies: p.technologies.map((t, i) => ({ id: `${p.id}-t${i}`, name: typeof t === "string" ? { pt: t, en: t } : { ...t } })),
      images: p.media.flatMap((m, i) => m.kind === "image"
        ? [{ id: `${p.id}-m${i}`, src: m.src, alt: { ...m.alt }, caption: m.caption ? { ...m.caption } : { pt: "", en: "" } }] : []).slice(0, 3),
      links: [{ label: "GitHub", url: p.repoUrl }, ...(p.links ?? []).map((k) => ({ label: k.label.pt, url: k.href }))]
        .slice(0, 2).map((k, i) => ({ id: `${p.id}-l${i}`, ...k })),
    })),
    journal: journalArticles.map((a) => {
      const pt = a.lang === "pt-BR";
      return {
        id: a.id, lang: a.lang, coverSrc: a.cover.src, url: a.url ?? "",
        status: a.status === "published" ? "published" : "draft",
        title: { pt: pt ? a.title : "", en: pt ? "" : a.title },
        description: { pt: pt ? a.excerpt : "", en: pt ? "" : a.excerpt },
      };
    }),
    footer: { title: pair((l) => messages[l].contact.title), description: pair((l) => messages[l].contact.lead) },
    footerLinks: contactLinks.map((c) => ({
      id: c.id, platform: c.label, url: c.href, active: true, icon: c.id === "email" ? "mail" : c.id,
    })),
    manuscripts: [
      ...manuscripts.map((m) => ({ id: m.id, number: m.number, title: { ...m.title }, description: joinParas(m.paragraphs) })),
      { id: "final-letter", number: null, title: { ...manuscriptExtras.letter.title }, description: joinParas(manuscriptExtras.letter.paragraphs) },
    ],
  };
}
