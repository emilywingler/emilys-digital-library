import { useLayoutEffect, useRef } from "react";
import { manuscripts } from "@/content/manuscripts";
import { ManuscriptGlyph } from "@/components/decor/ManuscriptGlyphs";
import { useLocale } from "@/i18n/locale";
import type { Manuscript } from "@/types/content";
import { cn } from "@/lib/utils";
import { useManuscripts } from "./ManuscriptProvider";
import { ANCHORS, hostOf } from "./anchors";
import { checkMarker } from "./collision";
import { formatNo } from "./ManuscriptNoteBody";
import { BookManuscriptPanel } from "./BookManuscript";

/**
 * A hiding place host. Drop inside an existing positioned container; markers
 * are absolute overlays, so the host's size and flow never change. Renders the
 * undiscovered manuscripts whose resolved anchor belongs to `host`. Hosts in
 * unmounted tabs or inactive slides simply wait until they are shown again.
 */
export function ManuscriptZone({ host }: { host: string }) {
  const { ready, found, resolve } = useManuscripts();
  if (!ready) return null;
  // Book notes stay mounted after discovery so their inline panel can stay open.
  const here = manuscripts.filter((m) => (m.section === "book" || !found.has(m.id)) && (() => { const a = resolve(m.id); return a && hostOf(a) === host; })());
  return <>{here.map((m) => m.section === "book" ? <BookManuscriptPanel key={m.id} m={m} anchor={resolve(m.id)!} /> : <PageMarker key={m.id} m={m} anchor={resolve(m.id)!} />)}</>;
}

function PageMarker({ m, anchor }: { m: Manuscript; anchor: string }) {
  const { discover, setDialog, queueLetter } = useManuscripts();
  return <MarkerButton m={m} anchor={anchor} onActivate={() => { const done = discover(m.id); setDialog({ kind: "note", id: m.id }); if (done) queueLetter(); }} />;
}

/** The marker itself; re-validates its spot whenever its section resizes or toggles state. */
export function MarkerButton({ m, anchor, onActivate }: { m: Manuscript; anchor: string; onActivate: () => void }) {
  const { block } = useManuscripts();
  const { t } = useLocale();
  const ref = useRef<HTMLButtonElement>(null);
  const def = ANCHORS[anchor];
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !def?.fallback) return; // trusted original spots are never re-validated
    let frame = 0;
    const run = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => { if (checkMarker(el) === "blocked") block(anchor); }); };
    if (checkMarker(el) === "blocked") { block(anchor); return; }
    const scope = el.closest("[data-section],[role='dialog']") ?? document.body;
    const ro = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(run);
    ro?.observe(scope);
    const mo = new MutationObserver(run);
    mo.observe(scope, { subtree: true, attributes: true, attributeFilter: ["inert", "data-state", "data-phase", "data-active"] });
    return () => { cancelAnimationFrame(frame); ro?.disconnect(); mo.disconnect(); };
  }, [anchor, def, block]);
  return (
    <button ref={ref} type="button" data-manuscript={m.id} data-anchor={anchor}
      aria-label={t.manuscripts.marker.replace("{no}", formatNo(m.number, t.manuscripts))}
      className={cn("ms-marker", def?.cls)} onClick={onActivate}>
      <ManuscriptGlyph variant={m.variant} />
    </button>
  );
}
