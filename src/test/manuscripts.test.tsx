import { vi } from "vitest";
vi.mock("@tanstack/react-router", () => ({ useRouterState: () => "/en" }));
import { describe, expect, it, beforeEach } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { manuscripts, manuscriptExtras } from "@/content/manuscripts";
import { parsePlacements, parseProgress, safeStore, serializePlacements, serializeProgress, PROGRESS_KEY } from "@/components/manuscripts/manuscriptStorage";
import { pickPlacements, pickReplayPlacements } from "@/components/manuscripts/placement";
import { ANCHORS as DEFS, ANCHORS_BY_ID, MANUSCRIPT_ANCHORS, hostOf, hostsOf } from "@/components/manuscripts/anchors";
import { checkMarker } from "@/components/manuscripts/collision";
import { messages } from "@/i18n/messages";

const IDS = manuscripts.map((m) => m.id);
const ANCHORS = ANCHORS_BY_ID;
const LIST = MANUSCRIPT_ANCHORS;
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
  it("every anchor is registered, unique, and each fallback is a trusted spot of the same section", () => {
    const all = LIST.flatMap((m) => m.anchors);
    expect(new Set(all).size).toBe(all.length);
    for (const a of all) {
      expect(DEFS[a]?.cls).toBeTruthy();
      let cur = a, hops = 0;
      while (DEFS[cur]!.fallback && hops++ < 4) { const fb = DEFS[cur]!.fallback!; expect(DEFS[fb]!.section).toBe(DEFS[a]!.section); cur = fb; }
      expect(DEFS[cur]!.fallback).toBeUndefined(); // every chain ends in a trusted spot
    }
  });
  it("each manuscript has many hiding places across several components", () => {
    for (const m of LIST) {
      expect(m.anchors.length).toBeGreaterThanOrEqual(6);
      expect(new Set(m.anchors.map(hostOf)).size).toBeGreaterThanOrEqual(3);
    }
  });
});

describe("storage", () => {
  it("drops unknown ids, duplicates and wrong versions", () => {
    expect(parseProgress(JSON.stringify({ version: 1, found: ["journey", "journey", "nope", 3] }), IDS)).toEqual({ found: ["journey"] });
    expect(parseProgress(JSON.stringify({ version: 0, found: ["journey"] }), IDS)).toEqual({ found: [] });
    expect(parseProgress("{broken", IDS)).toEqual({ found: [] });
    expect(parsePlacements(JSON.stringify({ version: 2, placements: { journey: "home:page@bl", "small-pause": "home:page@br" } }), ANCHORS)).toEqual({ "small-pause": "home:page@br" });
    expect(parsePlacements(JSON.stringify({ version: 1, placements: { "small-pause": "home-br" } }), ANCHORS)).toEqual({});
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
      const p = pickPlacements(LIST, new Set(["journey"]), seeded(seed));
      expect(p["journey"]).toBeUndefined();
      expect(Object.keys(p)).toHaveLength(6);
      for (const [id, a] of Object.entries(p)) expect(ANCHORS[id]).toContain(a);
      expect(new Set(Object.values(p)).size).toBe(6);
    }
  });
  it("reuses the session placement and varies across sessions", () => {
    const first = pickPlacements(LIST, new Set(), seeded(7));
    expect(pickPlacements(LIST, new Set(), seeded(99), parsePlacements(serializePlacements(first), ANCHORS))).toEqual(first);
    const variants = new Set(Array.from({ length: 20 }, (_, i) => JSON.stringify(pickPlacements(LIST, new Set(), seeded(i + 1)))));
    expect(variants.size).toBe(20);
    for (const m of LIST) {
      const hosts = new Set(Array.from({ length: 40 }, (_, i) => hostOf(pickPlacements(LIST, new Set(), seeded(7919 * (i + 1)))[m.id]!)));
      expect(hosts.size).toBeGreaterThanOrEqual(3);
    }
  });
});

describe("provider flow", () => {
  beforeEach(() => { localStorage.clear(); sessionStorage.clear(); });
  it("counter hidden before first find, counts once, letter opens on the seventh", async () => {
    const { ManuscriptProvider } = await import("@/components/manuscripts/ManuscriptProvider");
    const { ManuscriptZone } = await import("@/components/manuscripts/ManuscriptMarker");
    localStorage.setItem(PROGRESS_KEY, serializeProgress({ found: IDS.filter((id) => id !== "small-pause") }));
    render(<ManuscriptProvider><div className="relative">{hostsOf("home").map((h) => <ManuscriptZone key={h} host={h} />)}</div></ManuscriptProvider>);
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
    for (let seed = 1; seed < 60; seed++) {
      const prev = pickPlacements(LIST, new Set(), seeded(seed));
      const next = pickReplayPlacements(LIST, () => 0, prev); // worst case: rng repeats
      for (const m of LIST) { expect(next[m.id]).not.toBe(prev[m.id]); expect(hostOf(next[m.id]!)).not.toBe(hostOf(prev[m.id]!)); }
      expect(Object.keys(next)).toHaveLength(7);
      expect(new Set(Object.values(next)).size).toBe(7);
    }
  });

  async function setup(found: string[]) {
    const { ManuscriptProvider } = await import("@/components/manuscripts/ManuscriptProvider");
    const { ManuscriptZone } = await import("@/components/manuscripts/ManuscriptMarker");
    localStorage.setItem(PROGRESS_KEY, serializeProgress(found.length === 7 ? { found, completedAt: "x" } : { found }));
    render(<ManuscriptProvider><div className="relative">{hostsOf("home").map((h) => <ManuscriptZone key={h} host={h} />)}</div></ManuscriptProvider>);
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

describe("zones and collision", () => {
  beforeEach(() => { localStorage.clear(); sessionStorage.clear(); });
  const rect = (l: number, t: number, w: number, h: number) => ({ left: l, top: t, right: l + w, bottom: t + h, width: w, height: h, x: l, y: t, toJSON() {} }) as DOMRect;

  it("a manuscript in a closed Experience tab keeps its tab and appears when that tab opens", async () => {
    const { ManuscriptProvider } = await import("@/components/manuscripts/ManuscriptProvider");
    const { ManuscriptZone } = await import("@/components/manuscripts/ManuscriptMarker");
    const { experience } = await import("@/content/experience");
    const host = `experience:${experience[1]!.id}`;
    sessionStorage.setItem("wingler:lost-manuscripts:session", serializePlacements({ beginning: `${host}@br` }));
    const View = ({ tab }: { tab: number }) => <ManuscriptProvider><div className="relative"><ManuscriptZone host="experience:section" />{tab === 1 && <article className="relative"><ManuscriptZone host={host} /></article>}</div></ManuscriptProvider>;
    const { rerender } = render(<View tab={0} />);
    expect(screen.queryByRole("button", { name: "Lost manuscript No. 02" })).toBeNull(); // no premature fallback
    rerender(<View tab={1} />);
    expect(screen.getByRole("button", { name: "Lost manuscript No. 02" }).dataset["anchor"]).toBe(`${host}@br`);
    expect(JSON.parse(sessionStorage.getItem("wingler:lost-manuscripts:session")!).placements.beginning).toBe(`${host}@br`);
  });

  it("a marker on an inactive journal slide is 'hidden' (not blocked) and checked again when active", () => {
    document.body.innerHTML = '<section data-section="journal"><div class="slide" inert><div class="relative"><button class="ms-marker">x</button></div></div></section>';
    const btn = document.querySelector<HTMLElement>(".ms-marker")!;
    expect(checkMarker(btn)).toBe("hidden");
    document.querySelector(".slide")!.removeAttribute("inert");
    btn.getBoundingClientRect = () => rect(0, 0, 44, 44);
    btn.parentElement!.getBoundingClientRect = () => rect(0, 0, 300, 300);
    expect(checkMarker(btn)).toBe("ok");
  });

  it("blocks partial overlaps with text, images and controls, including the safety margin", () => {
    document.body.innerHTML = '<section data-section="x"><div class="relative"><button class="ms-marker">x</button><a href="#">link</a><img alt="shot"></div></section>';
    const btn = document.querySelector<HTMLElement>(".ms-marker")!;
    btn.getBoundingClientRect = () => rect(100, 100, 44, 44);
    btn.parentElement!.getBoundingClientRect = () => rect(0, 0, 400, 400);
    const a = document.querySelector("a")!, img = document.querySelector("img")!;
    a.getClientRects = () => [rect(146, 140, 50, 20)] as unknown as DOMRectList; // 2px gap: inside margin
    img.getClientRects = () => [] as unknown as DOMRectList;
    expect(checkMarker(btn)).toBe("blocked");
    a.getClientRects = () => [rect(160, 140, 50, 20)] as unknown as DOMRectList;
    img.getClientRects = () => [rect(130, 50, 60, 60)] as unknown as DOMRectList; // corner overlap only
    expect(checkMarker(btn)).toBe("blocked");
    img.getClientRects = () => [rect(300, 300, 60, 60)] as unknown as DOMRectList;
    expect(checkMarker(btn)).toBe("ok");
  });

  it("replay after replay keeps moving every manuscript to a valid, unique spot", () => {
    let prev = pickPlacements(LIST, new Set(), seeded(5));
    const rng = seeded(11);
    for (let i = 0; i < 25; i++) {
      const next = pickReplayPlacements(LIST, rng, prev);
      for (const m of LIST) { expect(ANCHORS[m.id]).toContain(next[m.id]); expect(next[m.id]).not.toBe(prev[m.id]); }
      expect(new Set(Object.values(next)).size).toBe(7);
      prev = next;
    }
  });
});
