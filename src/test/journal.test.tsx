import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { JournalEntry } from "@/components/journal/JournalEntry";
import { journalArticles } from "@/content/journal";
import { messages } from "@/i18n/messages";
import type { JournalArticle } from "@/types/content";

const base = journalArticles[0]!;
const r = (a: JournalArticle, l: "pt" | "en" = "pt") => render(<JournalEntry article={a} locale={l} labels={messages[l].journal} />);

describe("Wingler Journal", () => {
  it("first entry is the in-progress SheBuilds article with no URL", () => {
    expect(base.status).toBe("in-progress");
    expect(base.url).toBeUndefined();
    expect(base.title).toBe("Como foi a experiência de participar do SheBuilds: Learning Edition da Lovable?");
  });
  it("in-progress shows stamp and a disabled button, no link", () => {
    r(base);
    expect(screen.getByText("Em desenvolvimento")).toBeInTheDocument();
    const b = screen.getByRole("button", { name: "Ler no Medium" });
    expect(b).toBeDisabled();
    fireEvent.click(b);
    expect(screen.queryByRole("link")).toBeNull();
  });
  it("in-progress ignores a URL", () => {
    r({ ...base, url: "https://medium.com/x" });
    expect(screen.queryByRole("link")).toBeNull();
  });
  it("published with https URL opens safely in a new tab", () => {
    r({ ...base, status: "published", url: "https://medium.com/@e/post" }, "en");
    const a = screen.getByRole("link", { name: /Read on Medium/ });
    expect(a).toHaveAttribute("href", "https://medium.com/@e/post");
    expect(a).toHaveAttribute("target", "_blank");
    expect(a).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.queryByText("In progress")).toBeNull();
  });
  it.each([undefined, "", "javascript:alert(1)", "http://medium.com/x"])("published with bad URL %s renders no action", (url) => {
    r({ ...base, status: "published", url });
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
  });
  it("EN labels localize but article text is not translated", () => {
    r(base, "en");
    expect(screen.getByText("In progress")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Read on Medium" })).toBeDisabled();
    expect(screen.getByRole("heading", { level: 3 })).toHaveAttribute("lang", "pt-BR");
    expect(screen.getByText(base.title)).toBeInTheDocument();
  });
});
