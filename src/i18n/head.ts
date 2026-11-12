import type { Locale } from "@/types/content";
import { messages } from "./messages";

/** Builds per-locale page metadata for a route's `head()`. */
export function localeHead(locale: Locale) {
  const m = messages[locale].meta;
  return {
    meta: [
      { title: m.title },
      { name: "description", content: m.description },
      { property: "og:title", content: m.title },
      { property: "og:description", content: m.description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: locale === "pt" ? "pt_BR" : "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}
