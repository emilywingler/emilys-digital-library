import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createMemoryHistory, createRootRoute, createRouter, RouterProvider } from "@tanstack/react-router";
import { act } from "react";
import { WinglerJournal } from "@/components/journal/WinglerJournal";
import { journalSlots } from "@/content/journal";

async function setup(path = "/") {
  const router = createRouter({
    routeTree: createRootRoute({ component: () => <WinglerJournal slots={journalSlots} /> }),
    history: createMemoryHistory({ initialEntries: [path] }),
  });
  render(<RouterProvider router={router} />);
  await act(async () => { await router.load(); });
}
const slides = () => Array.from(document.querySelectorAll(".journal-slide"));
const active = () => slides().find((s) => s.getAttribute("data-active") === "true")!;

describe("Journal carousel", () => {
  it("has SheBuilds first and an upcoming slot with no article fields", () => {
    expect(journalSlots).toHaveLength(2);
    expect(journalSlots[0]).toMatchObject({ kind: "article", id: "shebuilds", status: "in-progress" });
    expect(journalSlots[1]).toEqual({ kind: "upcoming", id: "upcoming" });
  });
  it("starts at 01 / 02 with only the active slide exposed", async () => {
    await setup();
    expect(screen.getByText("01 / 02")).toHaveAttribute("aria-live", "polite");
    expect(slides()[1]).toHaveAttribute("aria-hidden", "true");
    expect(slides()[1]!.hasAttribute("inert")).toBe(true);
    expect(screen.getByRole("button", { name: "Ler no Medium" })).toBeDisabled();
  });
  it("wraps both ways with buttons and arrow keys", async () => {
    await setup("/en");
    fireEvent.click(screen.getByRole("button", { name: "Previous article" }));
    expect(screen.getByText("02 / 02")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Next article" }));
    expect(screen.getByText("01 / 02")).toBeInTheDocument();
    const next = screen.getByRole("button", { name: "Next article" });
    fireEvent.keyDown(next, { key: "ArrowRight" });
    expect(screen.getByText("02 / 02")).toBeInTheDocument();
    fireEvent.keyDown(next, { key: "ArrowRight" });
    expect(screen.getByText("01 / 02")).toBeInTheDocument();
  });
  it("the upcoming slide has no link, CTA, stamp or metadata", async () => {
    await setup("/en");
    fireEvent.click(screen.getByRole("button", { name: "Next article" }));
    const s = active();
    expect(s).toHaveTextContent("More essays forthcoming");
    expect(s.querySelector("a, .journal-cta, .journal-stamp, time")).toBeNull();
    expect(s.querySelectorAll("button")).toHaveLength(0);
  });
});
