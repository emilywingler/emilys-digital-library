import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { manuscripts } from "@/content/manuscripts";
import {
  PROGRESS_KEY, SESSION_KEY, parsePlacements, parseProgress, safeStore, serializePlacements, serializeProgress,
  type Placements,
} from "./manuscriptStorage";
import { pickPlacements, pickReplayPlacements } from "./placement";
import { ANCHORS as ANCHOR_DEFS, ANCHORS_BY_ID, MANUSCRIPT_ANCHORS } from "./anchors";
import { ManuscriptLayer } from "./ManuscriptLayer";

const IDS = manuscripts.map((m) => m.id);
const local = safeStore(() => (typeof window === "undefined" ? undefined : window.localStorage));
const session = safeStore(() => (typeof window === "undefined" ? undefined : window.sessionStorage));

export type Dialog = { kind: "note"; id: string } | { kind: "collection" } | { kind: "letter" } | null;

interface Ctx {
  /** False during SSR and the first client render, so markup always matches. */
  ready: boolean;
  found: ReadonlySet<string>;
  placements: Placements;
  dialog: Dialog;
  setDialog: (d: Dialog) => void;
  /** Records a discovery once; returns true when it completed the collection. */
  discover: (id: string) => boolean;
  /** Opens the letter as soon as no project book dialog is open. */
  queueLetter: () => void;
  /** True once the visitor restarted in this page session (counter shows 00/07). */
  replayed: boolean;
  /** Clears progress, draws a new arrangement and closes any panel. */
  restart: () => void;
  /** Anchor actually rendered for a manuscript: its placement, or a fallback if that one is blocked. */
  resolve: (id: string) => string | undefined;
  /** Marks an anchor unusable for now (overlap / collapsed host). Stored placement and progress stay. */
  block: (anchor: string) => void;
}

const INERT: Ctx = { ready: false, found: new Set(), placements: {}, dialog: null, setDialog: () => {}, discover: () => false, queueLetter: () => {}, replayed: false, restart: () => {}, resolve: () => undefined, block: () => {} };

const ManuscriptContext = createContext<Ctx | null>(null);

export function useManuscripts() {
  const c = useContext(ManuscriptContext);
  return c ?? INERT; // sections rendered alone (tests, previews) simply show no markers
}

/** Holds discoveries (localStorage), session placements (sessionStorage) and the open panel. */
export function ManuscriptProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [found, setFound] = useState<ReadonlySet<string>>(new Set());
  const [completedAt, setCompletedAt] = useState<string>();
  const [placements, setPlacements] = useState<Placements>({});
  const [dialog, setDialog] = useState<Dialog>(null);
  const [letterQueued, setLetterQueued] = useState(false);
  const [replayed, setReplayed] = useState(false);
  const foundRef = useRef(found);
  foundRef.current = found;
  const placementsRef = useRef<Placements>({});
  placementsRef.current = placements;

  useEffect(() => {
    const progress = parseProgress(local.read(PROGRESS_KEY), IDS);
    const f = new Set(progress.found);
    const prev = parsePlacements(session.read(SESSION_KEY), ANCHORS_BY_ID);
    const next = pickPlacements(MANUSCRIPT_ANCHORS, f, Math.random, prev);
    session.write(SESSION_KEY, serializePlacements(next));
    setFound(f); setCompletedAt(progress.completedAt); setPlacements(next); setReady(true);
  }, []);

  const discover = useCallback((id: string) => {
    const cur = foundRef.current;
    if (cur.has(id) || !IDS.includes(id)) return false;
    const next = new Set(cur).add(id);
    const done = next.size === IDS.length;
    const stamp = done ? (completedAt ?? new Date().toISOString()) : undefined;
    foundRef.current = next;
    setFound(next);
    if (stamp) setCompletedAt(stamp);
    local.write(PROGRESS_KEY, serializeProgress(stamp ? { found: [...next], completedAt: stamp } : { found: [...next] }));
    return done;
  }, [completedAt]);

  const restart = useCallback(() => {
    const next = pickReplayPlacements(MANUSCRIPT_ANCHORS, Math.random, placementsRef.current);
    const empty = new Set<string>();
    foundRef.current = empty;
    setFound(empty); setCompletedAt(undefined); setPlacements(next);
    setLetterQueued(false); setReplayed(true); setDialog(null); setBlocked(new Set());
    local.write(PROGRESS_KEY, serializeProgress({ found: [] }));
    session.write(SESSION_KEY, serializePlacements(next));
  }, []);

  // Runtime-only: anchors that cannot be used at the current size. Cleared on
  // resize so the original spot gets re-evaluated at the new width.
  const [blocked, setBlocked] = useState<ReadonlySet<string>>(new Set());
  const block = useCallback((a: string) => setBlocked((b) => (b.has(a) ? b : new Set(b).add(a))), []);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    let w = window.innerWidth;
    const on = () => { clearTimeout(t); t = setTimeout(() => { if (window.innerWidth !== w) { w = window.innerWidth; setBlocked(new Set()); } }, 250); };
    window.addEventListener("resize", on);
    return () => { clearTimeout(t); window.removeEventListener("resize", on); };
  }, []);
  const resolve = useCallback((id: string) => {
    let a = placements[id];
    for (let i = 0; a && blocked.has(a) && i < 4; i++) a = ANCHOR_DEFS[a]?.fallback;
    return a;
  }, [placements, blocked]);

  const queueLetter = useCallback(() => setLetterQueued(true), []);
  useEffect(() => {
    if (!letterQueued) return;
    const t = setInterval(() => {
      if (!document.querySelector('[data-testid="open-book"]')) { setLetterQueued(false); setDialog({ kind: "letter" }); }
    }, 300);
    return () => clearInterval(t);
  }, [letterQueued]);

  const value = useMemo(() => ({ ready, found, placements, dialog, setDialog, discover, queueLetter, replayed, restart, resolve, block }), [ready, found, placements, dialog, discover, queueLetter, replayed, restart, resolve, block]);
  return (
    <ManuscriptContext.Provider value={value}>
      {children}
      <ManuscriptLayer />
    </ManuscriptContext.Provider>
  );
}
