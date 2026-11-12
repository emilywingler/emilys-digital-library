import { useRouterState } from "@tanstack/react-router";
import type { Locale } from "@/types/content";
import { messages } from "./messages";

export const DEFAULT_LOCALE: Locale = "pt";

/**
 * Derives the locale from a URL path. `/en` (and anything under it) is English;
 * everything else falls back to Portuguese, the default at `/`.
 */
export function getLocaleFromPath(pathname: string): Locale {
  return /^\/en(\/|$)/.test(pathname) ? "en" : DEFAULT_LOCALE;
}

/** Path of the home page for a locale. */
export function homePath(locale: Locale): "/" | "/en" {
  return locale === "en" ? "/en" : "/";
}

/**
 * Current locale + its strings. The URL is the single source of truth, so the
 * language survives refreshes and shared links without any stored state.
 */
export function useLocale() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const locale = getLocaleFromPath(pathname);
  return { locale, t: messages[locale] };
}
