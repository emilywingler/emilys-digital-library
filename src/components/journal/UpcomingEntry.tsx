import { TwinStars } from "@/components/decor/Ornaments";

/** Temporary "more to come" slide. Deliberately has no metadata, stamp or CTA. */
export function UpcomingEntry({ title, note }: { title: string; note: string }) {
  return (
    <article className="journal-entry grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-10" aria-label={title}>
      <div className="journal-plate journal-upcoming-plate" aria-hidden="true">
        <TwinStars className="h-10 w-24 text-gold" />
        <span className="font-masthead text-xs uppercase tracking-[0.35em]">Vol. II</span>
      </div>
      <div className="min-w-0">
        <h3 className="font-display text-2xl font-semibold italic leading-tight sm:text-3xl">{title}</h3>
        <p className="mt-3 text-paper-muted">{note}</p>
      </div>
    </article>
  );
}
