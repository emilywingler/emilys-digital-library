import * as D from "@radix-ui/react-dialog";
import { Fleuron } from "@/components/decor/Ornaments";
import type { Locale, Project } from "@/types/content";
import type { Messages } from "@/i18n/messages";

/** Left page: editorial presentation of a project. Title/intro double as the dialog's accessible name/description. */
export function BookPageInfo({ project, locale, t }: { project: Project; locale: Locale; t: Messages["projects"] }) {
  const tech = project.technologies.map((x) => (typeof x === "string" ? x : x[locale]));
  return (
    <div className="flex h-full flex-col px-6 py-7 sm:px-8">
      <div className="flex items-baseline justify-between pr-12 font-masthead md:pr-0 text-[0.7rem] uppercase tracking-[0.25em] text-paper-muted">
        <span>{t.title}</span>
        <span>{project.catalogNo}</span>
      </div>
      <D.Title className="mt-5 font-display text-3xl leading-tight text-paper-foreground">{project.title[locale]}</D.Title>
      <D.Description className="mt-2 font-display text-lg italic text-paper-muted">{project.intro[locale]}</D.Description>
      <Fleuron className="my-4 h-3 w-3 text-paper-muted" />
      <p className="text-sm leading-relaxed">{project.description[locale]}</p>
      <p className="mt-3 text-sm italic leading-relaxed text-paper-muted">{project.context[locale]}</p>

      <h3 className="mt-5 font-masthead text-xs uppercase tracking-[0.2em] text-paper-muted">{t.tech}</h3>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {tech.map((n) => <li key={n} className="border border-paper-foreground/25 px-2 py-0.5 text-xs">{n}</li>)}
      </ul>

      <h3 className="mt-5 font-masthead text-xs uppercase tracking-[0.2em] text-paper-muted">{t.role}</h3>
      {project.contribution
        ? <p className="mt-1 text-sm">{project.contribution[locale]}</p>
        : <p data-placeholder className="mt-1 text-sm italic text-paper-muted">[{t.rolePending}]</p>}

      <div className="mt-6 flex flex-wrap md:mt-auto gap-x-5 gap-y-2 border-t border-paper-foreground/20 pt-4 text-sm">
        <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="font-semibold underline decoration-gold decoration-2 underline-offset-4 hover:text-paper-muted">
          {t.repo} ↗<span className="sr-only"> {t.newTab}</span>
        </a>
        {project.links?.map((l) => (
          <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="underline decoration-paper-foreground/40 underline-offset-4">
            {l.label[locale]} ↗<span className="sr-only"> {t.newTab}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
