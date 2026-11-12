import { describe, expect, it } from "vitest";
import { skillCategories } from "@/content/skills";
import { experience } from "@/content/experience";

const skills = skillCategories.flatMap((c) => c.skills);

describe("skills content", () => {
  it("has exactly four drawers, no web development", () =>
    expect(skillCategories.map((c) => c.id)).toEqual(["programming", "data", "ml", "tools"]));
  it("uses unique catalog codes", () => expect(new Set(skills.map((s) => s.code)).size).toBe(skills.length));
  it("has pt and en descriptions", () => skills.forEach((s) => { expect(s.description.pt).toBeTruthy(); expect(s.description.en).toBeTruthy(); }));
  it("assigns no proficiency levels yet", () => skills.forEach((s) => expect(s.level).toBeUndefined()));
  it("links seeAlso only to real experiences", () => {
    const ids = new Set(experience.map((e) => e.id));
    skills.flatMap((s) => s.seeAlso ?? []).forEach((id) => expect(ids.has(id)).toBe(true));
  });
  it("does not tie AWS to Compass automatically", () =>
    expect(skills.find((s) => s.code === "FER-01")!.seeAlso).toBeUndefined());
});
