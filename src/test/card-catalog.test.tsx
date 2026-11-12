import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CardCatalog } from "@/components/skills/CardCatalog";
import { skillCategories } from "@/content/skills";

const labels = { seeAlso: "Ver em", levels: { familiarity: "F", developing: "D", practical: "P" } };
const setup = (locale: "pt" | "en" = "pt") =>
  render(<CardCatalog categories={skillCategories} locale={locale} label="Gavetas" cardLabels={labels} experienceNames={{ compass: "Compass UOL" }} />);

describe("CardCatalog", () => {
  it("opens the first drawer by default", () => {
    setup();
    expect(screen.getAllByRole("tab")).toHaveLength(4);
    expect(screen.getAllByRole("tab")[0]).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Python")).toBeInTheDocument();
  });
  it("switches cards on click", () => {
    setup();
    fireEvent.mouseDown(screen.getAllByRole("tab")[3]!, { button: 0 });
    expect(screen.getAllByRole("tab")[3]).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("MLOps e MLflow")).toBeInTheDocument();
  });
  it("renders English names and descriptions", () => {
    setup("en");
    expect(screen.getByText("Git & GitHub")).toBeInTheDocument();
    expect(screen.getByText("Version control and code hosting.")).toBeInTheDocument();
  });
});
