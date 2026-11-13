import { manuscripts } from "@/content/manuscripts";
import { ManuscriptGlyph } from "@/components/decor/ManuscriptGlyphs";
import { useLocale } from "@/i18n/locale";
import type { ManuscriptSection } from "@/types/content";
import { cn } from "@/lib/utils";
import { useManuscripts } from "./ManuscriptProvider";
import { ANCHOR_CLASS } from "./placement";
import { formatNo } from "./ManuscriptNoteBody";

/**
 * Renders this section's undiscovered manuscript at its session anchor. Drop
 * inside an existing `relative` container; the marker is absolute, so it never
 * shifts layout. Renders nothing before hydration or once found.
 */
export function ManuscriptSpot({ section }: { section: Exclude<ManuscriptSection, "book"> }) {
  const { ready, found, placements, discover, setDialog, queueLetter } = useManuscripts();
  const { t } = useLocale();
  if (!ready) return null;
  return (
    <>
      {manuscripts.filter((m) => m.section === section && !found.has(m.id) && placements[m.id]).map((m) => (
        <button key={m.id} type="button" data-manuscript={m.id} data-anchor={placements[m.id]}
          aria-label={t.manuscripts.marker.replace("{no}", formatNo(m.number, t.manuscripts))}
          className={cn("ms-marker", ANCHOR_CLASS[placements[m.id]!])}
          onClick={() => { const done = discover(m.id); setDialog({ kind: "note", id: m.id }); if (done) queueLetter(); }}>
          <ManuscriptGlyph variant={m.variant} />
        </button>
      ))}
    </>
  );
}
