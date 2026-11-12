import { Link } from "@tanstack/react-router";
import { useLocale } from "@/i18n/locale";

/**
 * PT / EN switch. Each option is a real link (`/` or `/en`), so it works
 * without JavaScript and keeps the language in the URL.
 */
export function LanguageToggle() {
  const { locale, t } = useLocale();
  const base = "px-2 py-1 font-masthead text-sm tracking-wider transition-colors";
  return (
    <nav aria-label={t.language.label} className="flex items-center rounded-sm border border-border">
      <Link to="/" aria-current={locale === "pt" ? "true" : undefined}
        className={`${base} ${locale === "pt" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
        <abbr title="Português" className="no-underline">PT</abbr>
      </Link>
      <Link to="/en" aria-current={locale === "en" ? "true" : undefined}
        className={`${base} ${locale === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
        <abbr title="English" className="no-underline">EN</abbr>
      </Link>
    </nav>
  );
}
