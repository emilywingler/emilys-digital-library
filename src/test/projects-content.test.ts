import { describe, expect, it } from "vitest";
import { projects, shelfDecor } from "@/content/projects";
import olistPt from "@/assets/projects/olist/cover-pt.svg.asset.json";
import olistEn from "@/assets/projects/olist/cover-en.svg.asset.json";
import bakeryPt from "@/assets/projects/bakery/cover-pt.svg.asset.json";
import bakerySpine from "@/assets/projects/bakery/spine.svg.asset.json";

const byId = Object.fromEntries(projects.map((p) => [p.id, p]));

describe("project library content", () => {
  it("has exactly the four real projects with fixed catalog numbers", () => {
    expect(projects.map((p) => [p.id, p.catalogNo])).toEqual([
      ["olist", "PRJ-001"], ["pendulum", "PRJ-002"], ["ml-studies", "PRJ-003"], ["bakery", "PRJ-004"],
    ]);
  });
  it("has PT and EN text for every field", () => {
    for (const p of projects) for (const k of ["title", "intro", "description", "context"] as const) {
      expect(p[k].pt.length).toBeGreaterThan(5);
      expect(p[k].en.length).toBeGreaterThan(5);
      expect(p[k].pt).not.toBe(p[k].en);
    }
  });
  it("assigns each project its own cover per language and its own spine", () => {
    for (const p of projects) {
      expect(p.cover.pt).toContain(`/${p.id}-cover-pt.svg`);
      expect(p.cover.en).toContain(`/${p.id}-cover-en.svg`);
      expect(p.spine).toContain(`/${p.id}-spine.svg`);
    }
    expect(byId["olist"]!.cover).toEqual({ pt: olistPt.url, en: olistEn.url });
    // The bakery PT cover is the upload named "…EN-1.svg", as confirmed by Emily.
    expect(bakeryPt.original_filename).toBe("bakery-cover-pt.svg");
    expect(byId["bakery"]!.cover.pt).toBe(bakeryPt.url);
    expect(byId["bakery"]!.spine).toBe(bakerySpine.url);
  });
  it("links each repository on GitHub", () => {
    for (const p of projects) expect(p.repoUrl).toMatch(/^https:\/\/github\.com\/emilywingler\//);
  });
  it("leaves unconfirmed contributions empty instead of inventing them", () => {
    expect(projects.every((p) => p.contribution === null)).toBe(true);
  });
  it("keeps every shelf within 1–3 and decor separate from projects", () => {
    expect(new Set(projects.map((p) => p.shelf)).size).toBeLessThanOrEqual(3);
    const ids = new Set(projects.map((p) => p.id));
    expect(shelfDecor.some((d) => ids.has(d.id))).toBe(false);
  });
  it("gives every project at least one media item with PT and EN alt text", () => {
    for (const p of projects) {
      expect(p.media.length).toBeGreaterThan(0);
      for (const m of p.media) if (m.kind === "image") {
        expect(m.alt.pt.length).toBeGreaterThan(5); expect(m.alt.en.length).toBeGreaterThan(5);
        expect(m.src).toMatch(/^\/__l5e\/assets-v1\//);
      }
    }
    expect(byId["bakery"]!.media).toHaveLength(2);
  });
  it("presents the Olist image without implying the dashboard is finished", () => {
    const c = byId["olist"]!.media[0]!.caption!;
    expect(c.pt).toMatch(/em desenvolvimento/);
    expect(c.en).toMatch(/in progress/);
  });
});
