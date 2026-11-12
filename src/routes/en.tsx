import { createFileRoute } from "@tanstack/react-router";
import { PortfolioPage } from "@/components/layout/PortfolioPage";
import { localeHead } from "@/i18n/head";

/** English portfolio at `/en` — same page, English strings. */
export const Route = createFileRoute("/en")({
  head: () => localeHead("en"),
  component: PortfolioPage,
});
