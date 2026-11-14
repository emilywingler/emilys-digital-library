import type { ManuscriptSection } from "@/types/content";
import { hostOf } from "./anchors";
import type { Placements } from "./manuscriptStorage";

/** Heading that receives focus when a section's note closes (the marker is gone by then). */
export const SECTION_HEADING: Record<ManuscriptSection, string> = {
  home: "home-title", experience: "experience-title", skills: "skills-title", projects: "projects-title",
  book: "projects-title", journal: "journal-heading", contact: "contact-title",
};

type Entry = { id: string; anchors: readonly string[] };
const pick = <T,>(xs: readonly T[], rng: () => number) => xs[Math.min(xs.length - 1, Math.floor(rng() * xs.length))]!;

/**
 * One anchor per undiscovered manuscript. Valid `previous` choices are kept
 * (stable within a session). New choices draw a *host* first, then a position
 * in it, so variation spreads across components instead of corners of one
 * box. `avoid` (the last exploration) is excluded whenever an alternative
 * exists: first its host, then its exact anchor. Anchors are never shared.
 */
export function pickPlacements(list: readonly Entry[], found: ReadonlySet<string>, rng: () => number, previous: Placements = {}, avoid: Placements = {}): Placements {
  const out: Placements = {};
  const used = new Set<string>();
  for (const m of list) {
    if (found.has(m.id)) continue;
    const prev = previous[m.id];
    if (prev && m.anchors.includes(prev) && !used.has(prev)) { out[m.id] = prev; used.add(prev); continue; }
    const free = m.anchors.filter((a) => !used.has(a));
    if (!free.length) continue;
    const old = avoid[m.id];
    const otherHost = old ? free.filter((a) => hostOf(a) !== hostOf(old)) : free;
    const otherAnchor = old ? free.filter((a) => a !== old) : free;
    const pool = otherHost.length ? otherHost : otherAnchor.length ? otherAnchor : free;
    const host = pick([...new Set(pool.map(hostOf))], rng);
    const choice = pick(pool.filter((a) => hostOf(a) === host), rng);
    out[m.id] = choice; used.add(choice);
  }
  return out;
}

/** Fresh arrangement for a replay: every manuscript moves (host first, then anchor) whenever it can. */
export function pickReplayPlacements(list: readonly Entry[], rng: () => number, previous: Placements): Placements {
  return pickPlacements(list, new Set(), rng, {}, previous);
}
