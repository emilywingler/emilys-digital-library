import type { Locale, Project, ProjectMedia } from "@/types/content";

/** Renders one media item by its `type`. Adding a type = one union member + one branch. */
function MediaItem({ item, locale }: { item: ProjectMedia; locale: Locale }) {
  switch (item.type) {
    case "image":
    case "gif":
      return <img src={item.src} alt={item.alt[locale]} loading="lazy" className="w-full rounded-sm object-contain" />;
    case "video":
      return (
        <figure>
          <video src={item.src} poster={item.poster} controls preload="metadata" className="w-full rounded-sm" />
          <figcaption className="mt-1 text-xs italic">{item.caption[locale]}</figcaption>
        </figure>
      );
    case "video-link":
      return <a href={item.href} target="_blank" rel="noopener noreferrer" className="underline decoration-gold underline-offset-4">{item.label[locale]} ↗</a>;
    case "dashboard":
      return <iframe src={item.embedUrl} title={item.title[locale]} loading="lazy" className="aspect-video w-full rounded-sm border-0" allowFullScreen />;
  }
}

/**
 * Right page: the project's visual plate. With no media it shows the cover
 * faintly behind a framed "plates in preparation" note, so it reads as an
 * intentional unfinished plate rather than an error.
 */
export function BookPageMedia({ project, locale, emptyLabel }: { project: Project; locale: Locale; emptyLabel: string }) {
  if (project.media.length === 0) {
    return (
      <div data-media-empty className="relative flex h-full items-center justify-center overflow-hidden">
        <img src={project.cover[locale]} alt="" className="absolute inset-0 h-full w-full object-cover opacity-15 sepia" />
        <p className="relative border border-paper-foreground/30 px-5 py-3 text-center font-masthead text-xs uppercase tracking-[0.25em] text-paper-muted outline outline-1 outline-offset-4 outline-paper-foreground/15">
          {emptyLabel}
        </p>
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col justify-center gap-4 p-5">
      {project.media.map((m, i) => <MediaItem key={i} item={m} locale={locale} />)}
    </div>
  );
}
