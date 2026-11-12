import { describe, expect, it } from "vitest";
import { about } from "@/content/about";

describe("about content", () => {
  it("keeps graduation as expected 12/2027, not confirmed", () => {
    const ufes = about.timeline.find((e) => e.id === "ufes")!;
    expect(ufes.period.pt).toContain("previsão 12/2027");
    expect(ufes.period.en).toContain("expected 12/2027");
  });
  it("keeps professional goals as a placeholder", () => expect(about.goals.placeholder).toBe(true));
  it("uses CV dates for Compass UOL", () =>
    expect(about.timeline.find((e) => e.id === "compass")!.period.en).toBe("Nov 2024 – Mar 2025"));
  it("has at most two margin notes", () => {
    const notes = [...about.timeline.map((e) => e.note), about.goals.note, about.interestAreas.note].filter(Boolean);
    expect(notes.length).toBeLessThanOrEqual(2);
  });
});
