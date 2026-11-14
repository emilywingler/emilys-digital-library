/**
 * The admin data layer. Components only talk to `adminRepository` through the
 * hooks below; replacing the in-memory stores with database-backed ones keeps
 * the same `AdminRepository` shape and leaves the UI untouched.
 *
 * Local only: data lives in this tab's memory, resets on reload and is never
 * read by the public site.
 */
import { useSyncExternalStore } from "react";
import type {
  AdminExperience, AdminJournalArticle, AdminManuscript, AdminProject, Entity, ExperienceTab,
  FooterLink, FooterSettings, HomeCta, HomeSettings, SkillCard, SkillDrawer,
} from "../types";
import { createSeed } from "./seed";
import { CollectionStore, DocStore } from "./store";

export interface AdminRepository {
  home: DocStore<HomeSettings>; ctas: CollectionStore<HomeCta>;
  tabs: CollectionStore<ExperienceTab>; experiences: CollectionStore<AdminExperience>;
  drawers: CollectionStore<SkillDrawer>; cards: CollectionStore<SkillCard>;
  projects: CollectionStore<AdminProject>; journal: CollectionStore<AdminJournalArticle>;
  footer: DocStore<FooterSettings>; footerLinks: CollectionStore<FooterLink>;
  manuscripts: CollectionStore<AdminManuscript>;
}

export function createMemoryRepository(): AdminRepository {
  const s = createSeed();
  return {
    home: new DocStore(s.home), ctas: new CollectionStore(s.ctas),
    tabs: new CollectionStore(s.tabs), experiences: new CollectionStore(s.experiences),
    drawers: new CollectionStore(s.drawers), cards: new CollectionStore(s.cards),
    projects: new CollectionStore(s.projects), journal: new CollectionStore(s.journal),
    footer: new DocStore(s.footer), footerLinks: new CollectionStore(s.footerLinks),
    manuscripts: new CollectionStore(s.manuscripts),
  };
}

export const adminRepository: AdminRepository = createMemoryRepository();

export function useCollection<T extends Entity>(store: CollectionStore<T>) {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
}
export function useDoc<T>(store: DocStore<T>) {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
}
