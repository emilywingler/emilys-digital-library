import type { Manuscript, ManuscriptSection } from "@/types/content";
import type { Placements } from "./manuscriptStorage";

/**
 * Safe page anchors: absolute positions inside an existing `relative` section
 * container, always in empty padding/corners (never over text or controls).
 * Every anchor is valid at every breakpoint, so a viewport change never needs
 * a reshuffle. `book:*` anchors are rendered by `BookManuscript` instead.
 */
export const ANCHOR_CLASS: Record<string, string> = {
  "home-bl": "left-10 bottom-0", "home-br": "right-10 bottom-0",
  "experience-tr": "right-3 top-2", "experience-br": "right-3 bottom-0",
  "skills-tr": "right-3 top-2", "skills-bl": "left-0 bottom-0",
  "projects-tr": "right-3 top-2", "projects-bl": "left-0 bottom-0",
  "journal-tl": "left-3 top-3", "journal-tr": "right-3 top-3",
  "contact-tr": "right-3 top-2", "contact-br": "right-3 bottom-1",
};

/** Heading that receives focus when a section's note closes (the marker is gone by then). */
export const SECTION_HEADING: Record<ManuscriptSection, string> = {
  home: "home-title", experience: "experience-title", skills: "skills-title", projects: "projects-title",
  book: "projects-title", journal: "journal-heading", contact: "contact-title",
};

/**
 * One anchor per undiscovered manuscript. Valid previous choices are kept (stable
 * within a session); missing/invalid ones are drawn with the injected `rng`.
 * Anchors are never shared between manuscripts, so markers cannot collide.
 */
export function pickPlacements(list: readonly Manuscript[], found: ReadonlySet<string>, rng: () => number, previous: Placements = {}): Placements {
  const out: Placements = {};
  const used = new Set<string>();
  for (const m of list) {
    if (found.has(m.id)) continue;
    const prev = previous[m.id];
    if (prev && m.anchors.includes(prev) && !used.has(prev)) { out[m.id] = prev; used.add(prev); continue; }
    const free = m.anchors.filter((a) => !used.has(a));
    if (!free.length) continue;
    const pick = free[Math.min(free.length - 1, Math.floor(rng() * free.length))]!;
    out[m.id] = pick; used.add(pick);
  }
  return out;
}
