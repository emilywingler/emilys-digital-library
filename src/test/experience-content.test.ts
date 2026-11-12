import { describe, expect, it } from "vitest";
import { experience } from "@/content/experience";

describe("experience content", () => {
  it("keeps the requested tab order", () =>
    expect(experience.map((e) => e.id)).toEqual(["ufes-prppg", "compass", "adapti", "ufes-graduacao"]));
  it("uses CV dates", () => {
    expect(experience[1].period.pt).toBe("Novembro de 2024 – Março de 2025");
    expect(experience[2].period.pt).toBe("Maio de 2023 – Abril de 2024");
  });
  it("marks graduation as education with expected end", () => {
    expect(experience[3].kind).toBe("education");
    expect(experience[3].period.pt).toContain("previsão 12/2027");
  });
  it("has pt and en for every bullet", () =>
    experience.flatMap((e) => e.bullets).forEach((b) => { expect(b.pt).toBeTruthy(); expect(b.en).toBeTruthy(); }));
});
