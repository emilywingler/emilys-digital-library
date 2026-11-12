import { Github, Linkedin, Mail } from "lucide-react";
import type { ContactLink } from "@/types/content";
import { useLocale } from "@/i18n/locale";

const ICONS = { github: Github, linkedin: Linkedin, email: Mail } as const;

/** Professional links presented as a newspaper "classifieds" box. */
export function ClassifiedLinks({ links }: { links: ContactLink[] }) {
  const { t } = useLocale();
  return (
    <aside aria-labelledby="classifieds-title" className="border border-paper-foreground p-1">
      <div className="border border-rule p-4">
        <h2 id="classifieds-title" className="text-center font-masthead text-xl">{t.home.linksHeading}</h2>
        <p className="mt-1 text-center text-xs uppercase tracking-[0.2em] text-paper-muted">{t.home.linksNote}</p>
        <ul className="mt-4 divide-y divide-rule">
          {links.map((l) => {
            const Icon = ICONS[l.id];
            const external = l.href.startsWith("http");
            return (
              <li key={l.id}>
                <a href={l.href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex items-center gap-3 py-3 transition-colors hover:text-olive">
                  <Icon className="h-4 w-4 shrink-0" aria-hidden />
                  <span className="flex min-w-0 flex-col">
                    <span className="font-display text-lg font-semibold leading-tight">{l.label}</span>
                    <span className="truncate text-sm text-paper-muted group-hover:text-olive">{l.display}</span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
