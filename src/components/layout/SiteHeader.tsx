import { useState } from "react";
import { Menu, X } from "lucide-react";
import { TwinStars } from "@/components/decor/Ornaments";
import { useLocale } from "@/i18n/locale";
import { SECTIONS } from "./sections";
import { LanguageToggle } from "./LanguageToggle";

/**
 * Sticky header: two stars, section links (in-page anchors) and language toggle.
 * Below `md` the links collapse into a disclosure menu (button + list), which
 * is simpler and more accessible than a full drawer for six links.
 */
export function SiteHeader() {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);

  const links = SECTIONS.map((id) => (
    <li key={id}>
      <a href={`#${id}`} onClick={() => setOpen(false)}
        className="block px-1 py-2 text-sm tracking-wide text-muted-foreground transition-colors hover:text-primary md:py-1">
        {t.nav[id]}
      </a>
    </li>
  ));

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#home" className="flex items-center gap-2" aria-label="Emily Wingler Gonçalves">
          <span className="flex h-9 w-9 items-center justify-center text-primary" aria-hidden="true">
            <TwinStars className="h-8 w-8 shrink-0" />
          </span>
          <span className="hidden font-display text-lg italic text-foreground sm:inline">Emily Wingler</span>
        </a>
        <nav aria-label={t.nav.label} className="hidden md:block">
          <ul className="flex items-center gap-5">{links}</ul>
        </nav>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <button type="button" className="rounded-sm p-2 text-foreground md:hidden"
            aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen((o) => !o)}>
            <span className="sr-only">{open ? t.nav.closeMenu : t.nav.openMenu}</span>
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label={t.nav.label} className="border-t border-border px-4 pb-3 md:hidden">
          <ul className="divide-y divide-border">{links}</ul>
        </nav>
      )}
    </header>
  );
}
