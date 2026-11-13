import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createMemoryHistory, createRootRoute, createRouter, RouterProvider } from "@tanstack/react-router";
import { ProjectLibrary, LIFT_MS } from "@/components/library/ProjectLibrary";
import { BookPageMedia } from "@/components/library/BookPageMedia";
import { COVER_MS, HINGE_MS, CLOSE_MS } from "@/components/library/OpenBook";
import { projects, shelfDecor } from "@/content/projects";

/** Renders the section inside a router so `useLocale()` reads the URL. */
async function setup(path = "/") {
  const router = createRouter({
    routeTree: createRootRoute({ component: () => <ProjectLibrary projects={projects} decor={shelfDecor} /> }),
    history: createMemoryHistory({ initialEntries: [path] }),
  });
  render(<RouterProvider router={router} />);
  await act(async () => { await router.load(); });
}

function setReducedMotion(on: boolean) {
  window.matchMedia = ((q: string) => ({ matches: on && q.includes("reduce"), media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, onchange: null, dispatchEvent: () => false })) as typeof window.matchMedia;
}

async function openFirst(name = /Olist/) {
  fireEvent.click(screen.getByRole("button", { name }));
  await act(async () => { await vi.advanceTimersByTimeAsync(LIFT_MS + 1000); });
  await act(async () => { await vi.advanceTimersByTimeAsync(COVER_MS + HINGE_MS + 10); });
}

beforeEach(() => { vi.useFakeTimers({ shouldAdvanceTime: true }); setReducedMotion(false); });
afterEach(() => { vi.useRealTimers(); });

describe("ProjectLibrary", () => {
  it("shows four interactive spines; decorative books are not buttons", async () => {
    await setup();
    expect(screen.getAllByRole("button", { name: /^Abrir livro/ })).toHaveLength(4);
    const decor = document.querySelectorAll("[data-decor-book]");
    expect(decor.length).toBeGreaterThan(0);
    decor.forEach((d) => { expect(d.closest("button")).toBeNull(); expect(d.closest('[aria-hidden="true"]')).not.toBeNull(); });
  });

  it("draws no text over the spine artwork", async () => {
    await setup();
    for (const b of screen.getAllByRole("button", { name: /^Abrir livro/ })) expect(b.textContent).toBe("");
  });

  it("opens the book with the localized cover, then reveals the pages", async () => {
    await setup("/en");
    fireEvent.click(screen.getByRole("button", { name: "Open book: Olist E-commerce Analysis" }));
    await act(async () => { await vi.advanceTimersByTimeAsync(LIFT_MS + 1000); });
    const book = screen.getByTestId("open-book");
    expect(book).toHaveAttribute("data-phase", "cover");
    expect(book.querySelector(".book-cover")!.getAttribute("src")).toBe(projects[0]!.cover.en);
    await act(async () => { await vi.advanceTimersByTimeAsync(COVER_MS + HINGE_MS + 10); });
    expect(book).toHaveAttribute("data-phase", "open");
    expect(book.querySelector(".book-cover")).toBeNull();
    const dialog = screen.getByRole("dialog", { name: "Olist E-commerce Analysis" });
    const repo = within(dialog).getByRole("link", { name: /View on GitHub/ });
    expect(repo).toHaveAttribute("href", projects[0]!.repoUrl);
    expect(repo).toHaveAttribute("target", "_blank");
  });

  it("uses the Portuguese cover on /", async () => {
    await setup("/");
    fireEvent.click(screen.getByRole("button", { name: /Sistema de Gestão de Padaria/ }));
    await act(async () => { await vi.advanceTimersByTimeAsync(LIFT_MS + 1000); });
    expect(screen.getByTestId("open-book").querySelector(".book-cover")!.getAttribute("src")).toBe(projects[3]!.cover.pt);
  });

  it("opens from the keyboard and closes with Escape, returning focus to the spine", async () => {
    await setup();
    const spine = screen.getByRole("button", { name: /Pêndulo/ });
    spine.focus();
    fireEvent.keyDown(spine, { key: "Enter" });
    fireEvent.click(spine); // browsers turn Enter on a <button> into click
    await act(async () => { await vi.advanceTimersByTimeAsync(LIFT_MS + COVER_MS + HINGE_MS + 1000); });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.keyDown(document.activeElement!, { key: "Escape" });
    await act(async () => { await vi.advanceTimersByTimeAsync(CLOSE_MS + 10); });
    expect(screen.queryByRole("dialog")).toBeNull();
    await act(async () => { await vi.advanceTimersByTimeAsync(10); });
    expect(document.activeElement).toBe(spine);
  });

  it("closes with the X button", async () => {
    await setup();
    await openFirst();
    fireEvent.click(screen.getByRole("button", { name: "Fechar livro" }));
    await act(async () => { await vi.advanceTimersByTimeAsync(CLOSE_MS + 10); });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes on an outside click but not on a click inside the book", async () => {
    await setup();
    await openFirst();
    fireEvent.pointerDown(screen.getByRole("heading", { name: /Olist/ }));
    await act(async () => { await vi.advanceTimersByTimeAsync(CLOSE_MS + 10); });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.pointerDown(document.querySelector(".book-overlay")!);
    await act(async () => { await vi.advanceTimersByTimeAsync(CLOSE_MS + 10); });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("skips the animation with reduced motion", async () => {
    setReducedMotion(true);
    await setup();
    fireEvent.click(screen.getByRole("button", { name: /Olist/ }));
    await act(async () => { await vi.advanceTimersByTimeAsync(0); });
    expect(screen.getByTestId("open-book")).toHaveAttribute("data-phase", "open");
    fireEvent.click(screen.getByRole("button", { name: "Fechar livro" }));
    await act(async () => { await vi.advanceTimersByTimeAsync(0); });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("shows the review placeholder for unconfirmed contributions", async () => {
    await setup();
    await openFirst();
    expect(document.querySelector("[data-placeholder]")).toHaveTextContent("A confirmar");
  });
});

describe("BookPageMedia", () => {
  const base = projects[1]!;
  it("renders an intentional empty plate without media", () => {
    render(<BookPageMedia project={base} locale="pt" emptyLabel="Ilustrações em preparação" />);
    expect(document.querySelector("[data-media-empty]")).toHaveTextContent("Ilustrações em preparação");
  });
  it("renders each media type", () => {
    const t = { pt: "a", en: "b" };
    render(<BookPageMedia locale="en" emptyLabel="" project={{ ...base, media: [
      { type: "image", src: "/i.png", alt: { pt: "img", en: "Image" } },
      { type: "gif", src: "/g.gif", alt: { pt: "gif", en: "Gif" } },
      { type: "video", src: "/v.mp4", caption: t },
      { type: "video-link", href: "https://x.test", label: { pt: "v", en: "Watch" } },
      { type: "dashboard", embedUrl: "https://d.test", title: { pt: "p", en: "Board" } },
    ] }} />);
    expect(screen.getByRole("img", { name: "Image" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Gif" })).toBeInTheDocument();
    expect(document.querySelector("video")).toHaveAttribute("src", "/v.mp4");
    expect(screen.getByRole("link", { name: /Watch/ })).toHaveAttribute("href", "https://x.test");
    expect(screen.getByTitle("Board")).toBeInTheDocument();
    expect(document.querySelector("[data-media-empty]")).toBeNull();
  });
});
