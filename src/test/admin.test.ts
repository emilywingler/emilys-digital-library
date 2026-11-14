import { beforeAll, describe, expect, it } from "vitest";
import { createSeed } from "@/admin/data/seed";
import { CollectionStore, latency } from "@/admin/data/store";
import { computeStats } from "@/admin/data/stats";
import { cardNumber, validateDrawer, validateJournal, validateProject } from "@/admin/validation";
import { experience } from "@/content/experience";
import { projects } from "@/content/projects";
import { skillCategories } from "@/content/skills";
import { contactLinks } from "@/content/links";

beforeAll(() => { latency.ms = 0; });

describe("admin seed", () => {
  const s = createSeed();
  it("reuses the real content counts", () => {
    expect(s.projects).toHaveLength(projects.length);
    expect(s.experiences).toHaveLength(experience.length);
    expect(s.drawers).toHaveLength(skillCategories.length);
    expect(s.cards).toHaveLength(skillCategories.flatMap((c) => c.skills).length);
    expect(s.footerLinks.map((l) => l.id)).toEqual(contactLinks.map((l) => l.id));
    expect(s.manuscripts).toHaveLength(8);
  });
  it("keeps SheBuilds as a draft with its Portuguese text", () => {
    expect(s.journal[0]!.status).toBe("draft");
    expect(s.journal[0]!.title.pt).toContain("SheBuilds");
  });
  it("never seeds a phone link", () => expect(s.footerLinks.some((l) => l.url.startsWith("tel:"))).toBe(false));
  it("dashboard counts derive from data", () => {
    const st = computeStats(s);
    expect(st.projects.total).toBe(4);
    expect(st.journal.draft).toBe(1);
  });
});

describe("admin rules", () => {
  const base = createSeed().projects[0]!;
  it("allows at most 3 images", () => {
    const img = base.images[0]!;
    const p = { ...base, images: [0, 1, 2, 3].map((i) => ({ ...img, id: `i${i}` })) };
    expect(validateProject(p)["images"]).toBeDefined();
    expect(validateProject({ ...p, images: p.images.slice(0, 3) })["images"]).toBeUndefined();
  });
  it("allows at most 2 links", () => {
    const l = { id: "x", label: "Site", url: "https://example.com" };
    expect(validateProject({ ...base, links: [l, { ...l, id: "y" }, { ...l, id: "z" }] })["links"]).toBeDefined();
  });
  it("a published drawer needs a card", () => {
    const d = { id: "d", name: { pt: "A", en: "A" }, code: "ABC", status: "published" as const };
    expect(validateDrawer(d, 0)["status"]).toBeDefined();
    expect(validateDrawer(d, 1)["status"]).toBeUndefined();
    expect(validateDrawer({ ...d, status: "draft" }, 0)["status"]).toBeUndefined();
  });
  it("a published article needs an https link", () => {
    const a = createSeed().journal[0]!;
    expect(validateJournal({ ...a, status: "published", url: "" })["url"]).toBeDefined();
    expect(validateJournal({ ...a, status: "published", url: "https://medium.com/x" })["url"]).toBeUndefined();
  });
  it("card numbers follow position", () => expect(cardNumber("PRG", 0)).toBe("PRG-01"));
});

describe("collection store", () => {
  it("notifies and replaces the snapshot on every mutation", async () => {
    const s = new CollectionStore([{ id: "a" }, { id: "b" }, { id: "c" }]);
    let calls = 0; s.subscribe(() => calls++);
    const before = s.getSnapshot();
    await Promise.all([s.move("a", 1), s.remove("c"), s.save({ id: "d" })]);
    expect(s.getSnapshot()).not.toBe(before);
    expect(s.getSnapshot().map((i) => i.id)).toEqual(["b", "a", "d"]);
    expect(calls).toBe(3);
  });
  it("rejects removing a missing record without changing state", async () => {
    const s = new CollectionStore([{ id: "a" }]);
    await expect(s.remove("zz")).rejects.toThrow();
    expect(s.getSnapshot()).toHaveLength(1);
  });
});
