import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { manuscripts } from "@/content/manuscripts";
import {
  PROGRESS_KEY, SESSION_KEY, parsePlacements, parseProgress, safeStore, serializePlacements, serializeProgress,
  type Placements,
} from "./manuscriptStorage";
import { pickPlacements } from "./placement";
import { ManuscriptLayer } from "./ManuscriptLayer";

const IDS = manuscripts.map((m) => m.id);
const ANCHORS = Object.fromEntries(manuscripts.map((m) => [m.id, m.anchors]));
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
}

const INERT: Ctx = { ready: false, found: new Set(), placements: {}, dialog: null, setDialog: () => {}, discover: () => false, queueLetter: () => {} };

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
  const foundRef = useRef(found);
  foundRef.current = found;

  useEffect(() => {
    const progress = parseProgress(local.read(PROGRESS_KEY), IDS);
    const f = new Set(progress.found);
    const prev = parsePlacements(session.read(SESSION_KEY), ANCHORS);
    const next = pickPlacements(manuscripts, f, Math.random, prev);
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

  const queueLetter = useCallback(() => setLetterQueued(true), []);
  useEffect(() => {
    if (!letterQueued) return;
    const t = setInterval(() => {
      if (!document.querySelector('[data-testid="open-book"]')) { setLetterQueued(false); setDialog({ kind: "letter" }); }
    }, 300);
    return () => clearInterval(t);
  }, [letterQueued]);

  const value = useMemo(() => ({ ready, found, placements, dialog, setDialog, discover, queueLetter }), [ready, found, placements, dialog, discover, queueLetter]);
  return (
    <ManuscriptContext.Provider value={value}>
      {children}
      <ManuscriptLayer />
    </ManuscriptContext.Provider>
  );
}
