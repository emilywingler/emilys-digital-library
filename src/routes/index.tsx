import { createFileRoute } from "@tanstack/react-router";
import { PortfolioPage } from "@/components/layout/PortfolioPage";
import { localeHead } from "@/i18n/head";

/** Portuguese (default) portfolio at `/`. */
export const Route = createFileRoute("/")({
  head: () => localeHead("pt"),
  component: PortfolioPage,
});
