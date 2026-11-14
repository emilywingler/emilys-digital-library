/** Dashboard figures, derived from the current admin data (never hard-coded). */
import type { AdminJournalArticle, AdminProject, FooterLink, PublishStatus, SkillDrawer } from "../types";

const byStatus = (items: readonly { status: PublishStatus }[]) => ({
  total: items.length,
  published: items.filter((i) => i.status === "published").length,
  draft: items.filter((i) => i.status === "draft").length,
});

export interface StatsInput {
  projects: readonly AdminProject[]; experiences: readonly unknown[]; tabs: readonly unknown[];
  drawers: readonly SkillDrawer[]; cards: readonly unknown[]; journal: readonly AdminJournalArticle[];
  footerLinks: readonly FooterLink[]; manuscripts: readonly unknown[];
}
export function computeStats(d: StatsInput) {
  return {
    projects: byStatus(d.projects), journal: byStatus(d.journal), drawers: byStatus(d.drawers),
    experiences: d.experiences.length, tabs: d.tabs.length, cards: d.cards.length,
    activeLinks: d.footerLinks.filter((l) => l.active).length, links: d.footerLinks.length,
    manuscripts: d.manuscripts.length,
  };
}
