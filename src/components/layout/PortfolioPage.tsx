import { HomeFrontPage } from "@/components/home/HomeFrontPage";
import { contactLinks } from "@/content/links";
import { profile } from "@/content/profile";
import { experience } from "@/content/experience";
import { ExperienceFolder } from "@/components/experience/ExperienceFolder";
import { skillCategories } from "@/content/skills";
import { SkillsCatalog } from "@/components/skills/SkillsCatalog";
import { SiteHeader } from "./SiteHeader";
import { projects, shelfDecor } from "@/content/projects";
import { ProjectLibrary } from "@/components/library/ProjectLibrary";
import { journalArticles } from "@/content/journal";
import { WinglerJournal } from "@/components/journal/WinglerJournal";
import { ContactBookmark } from "@/components/contact/ContactBookmark";

/**
 * The whole one-page portfolio, shared by `/` (pt) and `/en` (en). The routes
 * only set metadata; the locale is read from the URL inside components, so no
 * page is duplicated per language.
 */
export function PortfolioPage() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        <HomeFrontPage profile={profile} />
        <ExperienceFolder entries={experience} />
        <SkillsCatalog categories={skillCategories} experience={experience} />
        <ProjectLibrary projects={projects} decor={shelfDecor} />
        <WinglerJournal articles={journalArticles} />
        <ContactBookmark links={contactLinks} />
      </main>
    </>
  );
}
