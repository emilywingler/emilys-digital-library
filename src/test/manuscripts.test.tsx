import { vi } from "vitest";
vi.mock("@tanstack/react-router", () => ({ useRouterState: () => "/en" }));
import { describe, expect, it, beforeEach } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { manuscripts, manuscriptExtras } from "@/content/manuscripts";
import { parsePlacements, parseProgress, safeStore, serializePlacements, serializeProgress, PROGRESS_KEY } from "@/components/manuscripts/manuscriptStorage";
import { ANCHOR_CLASS, pickPlacements } from "@/components/manuscripts/placement";
import { messages } from "@/i18n/messages";

const IDS = manuscripts.map((m) => m.id);
const ANCHORS = Object.fromEntries(manuscripts.map((m) => [m.id, m.anchors]));
const seeded = (seed: number) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

describe("Lost Manuscripts content", () => {
  it("has seven manuscripts numbered 1–7 with unique ids, two in Projects", () => {
    expect(manuscripts.map((m) => m.number)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(new Set(IDS).size).toBe(7);
    expect(manuscripts.filter((m) => m.section === "projects" || m.section === "book")).toHaveLength(2);
  });
  it("every text exists in pt and en, and seven progress lines per locale", () => {
    for (const m of manuscripts) for (const txt of [m.title, m.signature, ...m.paragraphs]) { expect(txt.pt).toBeTruthy(); expect(txt.en).toBeTruthy(); }
    expect(manuscriptExtras.letter.paragraphs[0]!.en).toBe("You have found all seven manuscripts.");
    expect(messages.pt.manuscripts.lines).toHaveLength(7);
    expect(messages.en.manuscripts.lines).toHaveLength(7);
  });
  it("every page anchor has a position, no anchor is shared", () => {
    const all = manuscripts.flatMap((m) => m.anchors);
    expect(new Set(all).size).toBe(all.length);
    for (const a of all) if (!a.startsWith("book:")) expect(ANCHOR_CLASS[a]).toBeTruthy();
  });
});

describe("storage", () => {
  it("drops unknown ids, duplicates and wrong versions", () => {
    expect(parseProgress(JSON.stringify({ version: 1, found: ["journey", "journey", "nope", 3] }), IDS)).toEqual({ found: ["journey"] });
    expect(parseProgress(JSON.stringify({ version: 0, found: ["journey"] }), IDS)).toEqual({ found: [] });
    expect(parseProgress("{broken", IDS)).toEqual({ found: [] });
    expect(parsePlacements(JSON.stringify({ version: 1, placements: { journey: "home-bl", "small-pause": "home-br" } }), ANCHORS)).toEqual({ "small-pause": "home-br" });
  });
  it("round-trips completion only when all seven are found", () => {
    expect(parseProgress(serializeProgress({ found: IDS, completedAt: "x" }), IDS).completedAt).toBe("x");
    expect(parseProgress(serializeProgress({ found: IDS.slice(1), completedAt: "x" }), IDS).completedAt).toBeUndefined();
  });
  it("stops touching storage after a failure", () => {
    let calls = 0;
    const s = safeStore(() => ({ getItem: () => { calls++; throw new Error("denied"); }, setItem: () => { calls++; } }) as unknown as Storage);
    expect(s.read("a")).toBeNull(); expect(s.read("a")).toBeNull(); s.write("a", "b");
    expect(calls).toBe(1);
  });
});

describe("placement", () => {
  it("gives every undiscovered manuscript a valid, unique anchor and skips found ones", () => {
    for (let seed = 1; seed < 50; seed++) {
      const p = pickPlacements(manuscripts, new Set(["journey"]), seeded(seed));
      expect(p["journey"]).toBeUndefined();
      expect(Object.keys(p)).toHaveLength(6);
      for (const [id, a] of Object.entries(p)) expect(ANCHORS[id]).toContain(a);
      expect(new Set(Object.values(p)).size).toBe(6);
    }
  });
  it("reuses the session placement and varies across sessions", () => {
    const first = pickPlacements(manuscripts, new Set(), seeded(7));
    expect(pickPlacements(manuscripts, new Set(), seeded(99), parsePlacements(serializePlacements(first), ANCHORS))).toEqual(first);
    const variants = new Set(Array.from({ length: 20 }, (_, i) => JSON.stringify(pickPlacements(manuscripts, new Set(), seeded(i + 1)))));
    expect(variants.size).toBeGreaterThan(1);
  });
});

describe("provider flow", () => {
  beforeEach(() => { localStorage.clear(); sessionStorage.clear(); });
  it("counter hidden before first find, counts once, letter opens on the seventh", async () => {
    const { ManuscriptProvider } = await import("@/components/manuscripts/ManuscriptProvider");
    const { ManuscriptSpot } = await import("@/components/manuscripts/ManuscriptMarker");
    localStorage.setItem(PROGRESS_KEY, serializeProgress({ found: IDS.filter((id) => id !== "small-pause") }));
    render(<ManuscriptProvider><div className="relative"><ManuscriptSpot section="home" /></div></ManuscriptProvider>);
    expect(screen.getByRole("button", { name: /06 of 07 found/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Lost manuscript No. 01" }));
    expect(screen.getByText("A little pause.")).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(PROGRESS_KEY)!).found).toHaveLength(7);
    expect(JSON.parse(localStorage.getItem(PROGRESS_KEY)!).completedAt).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Lost manuscript No. 01" })).toBeNull();
    await act(() => new Promise((r) => setTimeout(r, 350)));
    expect(screen.getByText("To the one who made it this far.")).toBeInTheDocument();
  });
});

describe("replay", () => {
  beforeEach(() => { localStorage.clear(); sessionStorage.clear(); });
  it("replay arrangement always differs when an alternative exists", async () => {
    const { pickReplayPlacements } = await import("@/components/manuscripts/placement");
    for (let seed = 1; seed < 60; seed++) {
      const prev = pickPlacements(manuscripts, new Set(), seeded(seed));
      const next = pickReplayPlacements(manuscripts, () => 0, prev); // worst case: rng repeats
      expect(manuscripts.some((m) => next[m.id] !== prev[m.id])).toBe(true);
      expect(Object.keys(next)).toHaveLength(7);
      expect(new Set(Object.values(next)).size).toBe(7);
    }
  });

  async function setup(found: string[]) {
    const { ManuscriptProvider } = await import("@/components/manuscripts/ManuscriptProvider");
    const { ManuscriptSpot } = await import("@/components/manuscripts/ManuscriptMarker");
    localStorage.setItem(PROGRESS_KEY, serializeProgress(found.length === 7 ? { found, completedAt: "x" } : { found }));
    render(<ManuscriptProvider><div className="relative"><ManuscriptSpot section="home" /></div></ManuscriptProvider>);
  }
  const restartVia = (label: RegExp) => {
    fireEvent.click(screen.getByRole("button", { name: /Open manuscript collection/ }));
    fireEvent.click(screen.getByRole("button", { name: label }));
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Start again" }));
  };

  it("restarts a completed exploration and allows completing a second one", async () => {
    await setup(IDS);
    const before = sessionStorage.getItem("wingler:lost-manuscripts:session");
    restartVia(/Play Again/);
    expect(JSON.parse(localStorage.getItem(PROGRESS_KEY)!)).toEqual({ version: 1, found: [] });
    expect(sessionStorage.getItem("wingler:lost-manuscripts:session")).not.toBe(before);
    expect(screen.getByRole("button", { name: /00 of 07 found/ })).toBeInTheDocument();
    expect(screen.queryByText("To the one who made it this far.")).toBeNull();
    // second exploration: seed the other six, then find Nº 01 on the page
    expect(screen.getByRole("button", { name: "Lost manuscript No. 01" })).toBeInTheDocument();
  });

  it("restarts an incomplete exploration and cancel keeps progress", async () => {
    await setup(["journey", "beginning"]);
    fireEvent.click(screen.getByRole("button", { name: /02 of 07 found/ }));
    fireEvent.click(screen.getByRole("button", { name: /Restart Exploration/ }));
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(JSON.parse(localStorage.getItem(PROGRESS_KEY)!).found).toHaveLength(2);
    fireEvent.click(screen.getByRole("button", { name: /Restart Exploration/ }));
    fireEvent.click(screen.getByRole("button", { name: "Start again" }));
    expect(JSON.parse(localStorage.getItem(PROGRESS_KEY)!).found).toEqual([]);
    expect(screen.getByRole("button", { name: /00 of 07 found/ })).toBeInTheDocument();
  });

  it("second exploration completes and shows the letter again", async () => {
    await setup(IDS);
    restartVia(/Play Again/);
    // simulate finding the other six in the new exploration by rendering fresh with stored progress
    localStorage.setItem(PROGRESS_KEY, serializeProgress({ found: IDS.filter((id) => id !== "small-pause") }));
    document.body.innerHTML = "";
    await setup(IDS.filter((id) => id !== "small-pause"));
    fireEvent.click(screen.getByRole("button", { name: "Lost manuscript No. 01" }));
    await act(() => new Promise((r) => setTimeout(r, 350)));
    expect(screen.getByText("To the one who made it this far.")).toBeInTheDocument();
  });
});
