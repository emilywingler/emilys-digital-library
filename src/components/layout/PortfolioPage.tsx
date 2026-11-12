import { HomeFrontPage } from "@/components/home/HomeFrontPage";
import { contactLinks } from "@/content/links";
import { profile } from "@/content/profile";
import { SiteHeader } from "./SiteHeader";
import { SectionPlaceholder } from "./SectionPlaceholder";

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
        <HomeFrontPage profile={profile} links={contactLinks} />
        <SectionPlaceholder id="about" />
        <SectionPlaceholder id="experience" />
        <SectionPlaceholder id="skills" />
        <SectionPlaceholder id="projects" />
        <SectionPlaceholder id="contact" />
      </main>
    </>
  );
}
