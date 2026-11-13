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
  const shelves = ([1, 2, 3] as const).filter((n) => projects.some((p) => p.shelf === n) || decor.some((d) => d.shelf === n));
  return (
    <div className="bookshelf-cabinet mx-auto max-w-3xl px-3 pb-3 pt-4 sm:px-6">
      {shelves.map((n) => {
        const slots: Slot[] = [
          ...projects.filter((p) => p.shelf === n).map((p) => ({ order: p.order, project: p })),
          ...decor.filter((d) => d.shelf === n).map((d) => ({ order: d.order, decor: d })),
        ].sort((a, b) => a.order - b.order);
        // Shelves without projects split decor between the two walls.
        const decorOnly = !slots.some((s) => "project" in s);
        const endAt = decorOnly ? slots.findIndex((s) => "decor" in s && s.decor.side === "end") : -1;
        return (
          <div key={n} className="shelf-row">
            {/* Decor-only rows never wrap: extra filler books are simply clipped at the wall on narrow screens. */}
            <ul className={`flex items-end gap-x-1 px-2 sm:gap-x-1.5 ${decorOnly ? "flex-nowrap justify-start overflow-hidden sm:justify-center" : "shelf-projects flex-nowrap justify-center"}`}>
              {slots.flatMap((s, i) => [
                ...(i === endAt ? [<li key="spacer" aria-hidden="true" className="flex-1" />] : []),
                "project" in s ? (
                  <li key={s.project.id} className="flex">
                    <BookSpine
                      ref={(el) => { if (el) spineRefs.current?.set(s.project.id, el); }}
                      project={s.project}
                      title={s.project.title[locale]}
                      label={`${openLabel}: ${s.project.title[locale]}`}
                      lifted={liftedId === s.project.id}
                      onOpen={() => onOpen(s.project)}
                      onPreload={() => onPreload(s.project)}
                    />
                  </li>
                ) : (
                  <li key={s.decor.id} aria-hidden="true" className={`flex ${s.decor.kind === "book" ? "shelf-decor-book" : "shelf-decor-object"}`}>
                    <DecorItem item={s.decor} />
                  </li>
                ),
              ])}
            </ul>
            <div className="shelf-board" aria-hidden="true" />
          </div>
        );
      })}
    </div>
  );
}
