import { describe, expect, it } from "vitest";
import { sectionProgress } from "@/hooks/useSectionMotion";

describe("sectionProgress", () => {
  it("is 0 enter below the fold and 1 once 60% of the span has entered", () => {
    expect(sectionProgress(1000, 2000, 1000).enter).toBe(0);
    expect(sectionProgress(400, 1400, 1000).enter).toBe(1);
  });
  it("leave reaches 1 only when the section has scrolled out", () => {
    expect(sectionProgress(0, 1200, 1000).leave).toBe(0);
    expect(sectionProgress(-1200, 0, 1000).leave).toBe(1);
  });
});
