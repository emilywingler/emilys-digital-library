import { useRef, useState } from "react";
import { ManuscriptSpot } from "@/components/manuscripts/ManuscriptMarker";
import { useLocale } from "@/i18n/locale";
import type { Project, ShelfDecor } from "@/types/content";
import { Bookshelf } from "./Bookshelf";
import { OpenBook } from "./OpenBook";
import { preloadImage, prefersReducedMotion } from "./useReducedMotion";

/** Lift duration of the spine before the book pops out (ms). */
export const LIFT_MS = 220;

/**
 * "The Project Library" section. Owns which book is open; everything else is
 * data-driven from `projects` and `decor`. Opening: spine lifts while the
 * localized cover preloads, then the floating OpenBook takes over.
 */
export function ProjectLibrary({ projects, decor }: { projects: Project[]; decor: ShelfDecor[] }) {
  const { locale, t } = useLocale();
  const [liftedId, setLiftedId] = useState<string | null>(null);
  const [open, setOpen] = useState<{ id: string; reduce: boolean } | null>(null);
  const spineRefs = useRef(new Map<string, HTMLButtonElement>());
  const active = open ? projects.find((p) => p.id === open.id) : undefined;

  const openBook = async (p: Project) => {
    if (open || liftedId) return;
    const reduce = prefersReducedMotion();
    if (reduce) return setOpen({ id: p.id, reduce });
    setLiftedId(p.id);
    await Promise.all([preloadImage(p.cover[locale]), new Promise((r) => setTimeout(r, LIFT_MS))]);
    setOpen({ id: p.id, reduce });
  };

  return (
    <section data-section="projects" id="projects" aria-labelledby="projects-title" className="relative mx-auto max-w-5xl px-3 py-12 sm:px-6">
      <h2 id="projects-title" className="mb-6 font-display text-3xl italic text-foreground">
        <span className="block font-masthead text-xs not-italic uppercase tracking-[0.3em] text-primary">{t.projects.kicker}</span>
        {t.projects.title}
      </h2>
      <ManuscriptSpot section="projects" />
      <Bookshelf
        projects={projects} decor={decor} locale={locale} openLabel={t.projects.open}
        liftedId={liftedId} spineRefs={spineRefs}
        onOpen={openBook}
        onPreload={(p) => void preloadImage(p.cover[locale])}
      />
      <p className="mt-3 text-center text-sm italic text-muted-foreground">{t.projects.hint}</p>
      {active && open && (
        <OpenBook
          key={active.id}
          project={active} locale={locale} t={t.projects} reduceMotion={open.reduce}
          onClosed={() => {
            const id = active.id;
            setOpen(null); setLiftedId(null);
            // The dialog unmounts instead of animating Radix's own close, so refocus the spine ourselves.
            setTimeout(() => spineRefs.current.get(id)?.focus(), 0);
          }}
          returnFocus={() => spineRefs.current.get(active.id)?.focus()}
          getOrigin={() => spineRefs.current.get(active.id)?.getBoundingClientRect()}
        />
      )}
    </section>
  );
}
