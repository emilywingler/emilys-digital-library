import { Fleuron } from "@/components/decor/Ornaments";
import { useLocale } from "@/i18n/locale";
import type { SectionId } from "./sections";

/**
 * Discreet stub for sections not built yet: keeps the anchor working for the
 * header links without competing with the Home. Replaced section by section.
 */
export function SectionPlaceholder({ id }: { id: Exclude<SectionId, "home"> }) {
  const { t } = useLocale();
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex items-center gap-4 text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        <Fleuron className="h-3 w-3 text-primary/70" />
        <h2 id={`${id}-title`} className="font-display text-xl italic text-foreground/80">{t.nav[id]}</h2>
        <span className="text-xs uppercase tracking-[0.2em]">· {t.placeholder.soon}</span>
        <span className="h-px flex-1 bg-border" />
      </div>
    </section>
  );
}
