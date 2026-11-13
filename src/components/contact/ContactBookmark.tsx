import { Github, Linkedin, Mail } from "lucide-react";
import { Sprig, TwinStars } from "@/components/decor/Ornaments";
import { Tassel } from "@/components/decor/Tassel";
import { useLocale } from "@/i18n/locale";
import type { ContactLink } from "@/types/content";

const ICONS = { github: Github, linkedin: Linkedin, email: Mail } as const;

/**
 * Final section: a parchment bookmark (cord + tassel, monogram, sprig) that
 * holds the contact links and doubles as the site's closing line. Horizontal
 * from `md`, vertical below. Links come from `src/content/links.ts`.
 */
export function ContactBookmark({ links }: { links: ContactLink[] }) {
  const { t } = useLocale();
  return (
    <footer id="contact" aria-labelledby="contact-title" className="px-4 pb-14 pt-10 sm:px-6">
      <div className="bookmark-wrap relative mx-auto max-w-sm md:max-w-4xl" data-reveal>
        <Tassel className="tassel-sway pointer-events-none absolute -top-6 left-5 z-10 h-28 w-9 text-gold md:-left-12 md:top-1/2 md:-translate-y-1/2 md:rotate-90" />
        <div className="bookmark paper relative rounded-t-[1.5rem] px-6 pb-6 pt-12 md:rounded-l-[1.5rem] md:rounded-tr-none md:px-12 md:py-8">
          <span className="bookmark-hole" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-2 rounded-t-[1.1rem] border border-gold/60 md:rounded-l-[1.1rem] md:rounded-tr-none" aria-hidden="true" />
          <div className="relative grid items-center gap-6 text-center md:grid-cols-[auto_1fr_auto] md:gap-10 md:text-left">
            <div className="flex flex-col items-center gap-1 text-paper-muted">
              <TwinStars className="h-6 w-6 text-gold" />
              <span className="font-display text-6xl leading-none text-paper-foreground" aria-hidden="true">E</span>
              <Sprig className="h-4 w-20" />
            </div>
            <div>
              <h2 id="contact-title" className="font-display text-3xl font-semibold leading-tight sm:text-4xl">{t.contact.title}</h2>
              <p className="mt-2 text-paper-muted">{t.contact.lead}</p>
            </div>
            <ul aria-label={t.contact.linksLabel} className="divide-y divide-rule text-left">
              {links.map((l) => {
                const Icon = ICONS[l.id];
                const external = l.href.startsWith("http");
                return (
                  <li key={l.id}>
                    <a href={l.href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group flex min-h-11 items-center gap-3 py-2 transition-colors hover:text-olive">
                      <Icon className="h-4 w-4 shrink-0" aria-hidden />
                      <span className="flex min-w-0 flex-col">
                        <span className="font-masthead text-xs uppercase tracking-[0.2em] text-paper-muted">{l.label}</span>
                        <span className="link-draw-gold break-all font-display text-lg leading-tight">{l.display}</span>
                      </span>
                      {external && <span className="sr-only">{t.contact.newTab}</span>}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
          <p className="relative mt-6 border-t border-rule pt-3 text-center font-display text-sm italic text-paper-muted">
            © {new Date().getFullYear()} Emily Wingler Gonçalves
          </p>
        </div>
      </div>
    </footer>
  );
}
