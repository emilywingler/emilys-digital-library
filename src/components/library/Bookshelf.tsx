import type { RefObject } from "react";
import type { Locale, Project, ShelfDecor } from "@/types/content";
import { BookSpine } from "./BookSpine";
import { DecorItem } from "./DecorItem";

interface Props {
  projects: Project[];
  decor: ShelfDecor[];
  locale: Locale;
  openLabel: string;
  liftedId: string | null;
  spineRefs: RefObject<Map<string, HTMLButtonElement>>;
  onOpen: (p: Project) => void;
  onPreload: (p: Project) => void;
}

type Slot = { order: number } & ({ project: Project } | { decor: ShelfDecor });

/**
 * Wooden cabinet with one board per used shelf (max 3). Projects and decor
 * share an `order` space within each shelf, so arrangement is pure data.
 */
export function Bookshelf({ projects, decor, locale, openLabel, liftedId, spineRefs, onOpen, onPreload }: Props) {
  const shelves = ([1, 2, 3] as const).filter((n) => projects.some((p) => p.shelf === n));
  return (
    <div className="bookshelf-cabinet mx-auto max-w-3xl px-3 pb-3 pt-4 sm:px-6">
      {shelves.map((n) => {
        const slots: Slot[] = [
          ...projects.filter((p) => p.shelf === n).map((p) => ({ order: p.order, project: p })),
          ...decor.filter((d) => d.shelf === n).map((d) => ({ order: d.order, decor: d })),
        ].sort((a, b) => a.order - b.order);
        return (
          <div key={n} className="shelf-row">
            <ul className="flex flex-wrap items-end justify-center gap-x-1 px-2 sm:gap-x-1.5">
              {slots.map((s) =>
                "project" in s ? (
                  <li key={s.project.id} className="flex">
                    <BookSpine
                      ref={(el) => { if (el) spineRefs.current?.set(s.project.id, el); }}
                      project={s.project}
                      label={`${openLabel}: ${s.project.title[locale]}`}
                      lifted={liftedId === s.project.id}
                      onOpen={() => onOpen(s.project)}
                      onPreload={() => onPreload(s.project)}
                    />
                  </li>
                ) : (
                  <li key={s.decor.id} aria-hidden="true" className="flex">
                    <DecorItem item={s.decor} />
                  </li>
                ),
              )}
            </ul>
            <div className="shelf-board" aria-hidden="true" />
          </div>
        );
      })}
    </div>
  );
}
