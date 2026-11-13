import { useLocale } from "@/i18n/locale";
import type { Profile } from "@/types/content";

/**
 * Archival photograph in the newspaper's side column. The photo itself is never
 * altered: only a light CSS sepia/contrast treatment and a framed 4:5 crop.
 */
export function NewspaperPortrait({ portrait }: { portrait: Profile["portrait"] }) {
  const { locale, t } = useLocale();
  return (
    <figure className="mx-auto w-full max-w-[17rem] md:max-w-none">
      <p className="mb-2 text-center font-masthead text-xs uppercase tracking-[0.25em] text-paper-muted">{t.home.portraitLabel}</p>
      <div className="border border-paper-foreground p-1">
        <div className="relative overflow-hidden border border-rule">
          <img src={portrait.src} alt={portrait.alt[locale]} width={768} height={1024}
            className="portrait-archival aspect-[4/5] w-full object-cover object-[50%_55%]" />
        </div>
      </div>
      <figcaption className="mt-2 text-center font-display text-sm italic text-paper-muted">{portrait.caption[locale]}</figcaption>
    </figure>
  );
}
