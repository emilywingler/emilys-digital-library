/**
 * Validated persistence for the Lost Manuscripts. Discoveries live in
 * localStorage, the session's placements in sessionStorage. Every read
 * validates shape + version and drops unknown ids; any storage failure
 * (private mode, quota, disabled) flips a flag so we never retry and the
 * feature keeps working from in-memory state.
 */
export const STORAGE_VERSION = 1;
export const PROGRESS_KEY = "wingler:lost-manuscripts";
export const SESSION_KEY = "wingler:lost-manuscripts:session";

export interface Progress { found: string[]; completedAt?: string }
export type Placements = Record<string, string>;

export function parseProgress(raw: string | null, knownIds: readonly string[]): Progress {
  try {
    const v = raw ? JSON.parse(raw) : null;
    if (!v || v.version !== STORAGE_VERSION || !Array.isArray(v.found)) return { found: [] };
    const found: string[] = [...new Set<string>((v.found as unknown[]).filter((id: unknown): id is string => typeof id === "string" && knownIds.includes(id)))];
    const completedAt = typeof v.completedAt === "string" && found.length === knownIds.length ? v.completedAt : undefined;
    return completedAt ? { found, completedAt } : { found };
  } catch { return { found: [] }; }
}

export function parsePlacements(raw: string | null, anchorsById: Readonly<Record<string, readonly string[]>>): Placements {
  try {
    const v = raw ? JSON.parse(raw) : null;
    if (!v || v.version !== STORAGE_VERSION || typeof v.placements !== "object" || !v.placements) return {};
    const out: Placements = {};
    for (const [id, anchor] of Object.entries(v.placements)) {
      if (typeof anchor === "string" && anchorsById[id]?.includes(anchor)) out[id] = anchor;
    }
    return out;
  } catch { return {}; }
}

export const serializeProgress = (p: Progress) => JSON.stringify({ version: STORAGE_VERSION, ...p });
export const serializePlacements = (placements: Placements) => JSON.stringify({ version: STORAGE_VERSION, placements });

/** Storage wrapper that disables itself after the first failure. */
export function safeStore(get: () => Storage | undefined) {
  let broken = false;
  return {
    read(key: string): string | null {
      if (broken) return null;
      try { return get()?.getItem(key) ?? null; } catch { broken = true; return null; }
    },
    write(key: string, value: string) {
      if (broken) return;
      try { get()?.setItem(key, value); } catch { broken = true; }
    },
  };
}
