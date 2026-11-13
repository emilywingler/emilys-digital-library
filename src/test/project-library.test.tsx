import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createMemoryHistory, createRootRoute, createRouter, RouterProvider } from "@tanstack/react-router";
import { ProjectLibrary, LIFT_MS } from "@/components/library/ProjectLibrary";
import { BookPageMedia, videoEmbedUrl } from "@/components/library/BookPageMedia";
import { messages } from "@/i18n/messages";
import { COVER_MS, HINGE_MS, FOLD_MS, RETURN_MS } from "@/components/library/OpenBook";
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

const CLOSE_MS = FOLD_MS + RETURN_MS;

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

  it("groups the four project books together on the main shelf", async () => {
    await setup();
    const rows = document.querySelectorAll(".shelf-row");
    expect(within(rows[0] as HTMLElement).getAllByRole("button", { name: /^Abrir livro/ })).toHaveLength(4);
    expect(within(rows[1] as HTMLElement).queryAllByRole("button")).toHaveLength(0);
  });

  it("writes the localized title on each spine", async () => {
    await setup("/en");
    for (const p of projects) {
      const b = screen.getByRole("button", { name: `Open book: ${p.title.en}` });
      expect(b.querySelector("[data-spine-title]")).toHaveTextContent(p.title.en.replace(/-/g, "\u2011"));
    }
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

  it("can close during the cover reveal without the opening timers restoring the book", async () => {
    await setup();
    const spine = screen.getByRole("button", { name: /Olist/ });
    fireEvent.click(spine);
    await act(async () => { await vi.advanceTimersByTimeAsync(LIFT_MS + 1000); });
    expect(screen.getByTestId("open-book")).toHaveAttribute("data-phase", "cover");
    fireEvent.click(screen.getByRole("button", { name: "Fechar livro" }));
    await act(async () => { await vi.advanceTimersByTimeAsync(CLOSE_MS + COVER_MS + HINGE_MS + 10); });
    expect(screen.queryByRole("dialog")).toBeNull();
    await act(async () => { await vi.advanceTimersByTimeAsync(10); });
    expect(document.activeElement).toBe(spine);
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

  it("closing folds, then returns, keeping the spine lifted until unmount", async () => {
    await setup();
    const spine = screen.getByRole("button", { name: /Olist/ });
    await openFirst();
    fireEvent.click(screen.getByRole("button", { name: "Fechar livro" }));
    const book = screen.getByTestId("open-book");
    expect(book).toHaveAttribute("data-phase", "folding");
    expect(book.querySelector(".book-cover")).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Fechar livro" })); // ignored
    fireEvent.keyDown(document.activeElement!, { key: "Escape" }); // ignored
    await act(async () => { await vi.advanceTimersByTimeAsync(FOLD_MS + 5); });
    expect(book).toHaveAttribute("data-phase", "returning");
    expect(spine).toHaveAttribute("data-lifted");
    await act(async () => { await vi.advanceTimersByTimeAsync(RETURN_MS + 5); });
    expect(screen.queryByRole("dialog")).toBeNull();
    await act(async () => { await vi.advanceTimersByTimeAsync(10); });
    expect(spine).not.toHaveAttribute("data-lifted");
    expect(document.activeElement).toBe(spine);
  });

  it("closing during the opening hinge skips the fold", async () => {
    await setup();
    fireEvent.click(screen.getByRole("button", { name: /Olist/ }));
    await act(async () => { await vi.advanceTimersByTimeAsync(LIFT_MS + 1000); });
    await act(async () => { await vi.advanceTimersByTimeAsync(COVER_MS + 10); });
    const book = screen.getByTestId("open-book");
    expect(book).toHaveAttribute("data-phase", "opening");
    fireEvent.click(screen.getByRole("button", { name: "Fechar livro" }));
    expect(book).toHaveAttribute("data-phase", "returning");
    await act(async () => { await vi.advanceTimersByTimeAsync(RETURN_MS + 5); });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("aims the return at the spine and survives repeated open/close cycles", async () => {
    await setup();
    for (let i = 0; i < 3; i++) {
      await openFirst();
      fireEvent.click(screen.getByRole("button", { name: "Fechar livro" }));
      await act(async () => { await vi.advanceTimersByTimeAsync(FOLD_MS + 5); });
      expect(document.querySelector(".book-cover")!.getAttribute("data-return")).toMatch(/spine|fallback/);
      await act(async () => { await vi.advanceTimersByTimeAsync(RETURN_MS + 20); });
      expect(screen.queryByRole("dialog")).toBeNull();
      expect(document.querySelectorAll("[data-lifted]")).toHaveLength(0);
    }
  });

  it("shows the review placeholder for unconfirmed contributions", async () => {
    await setup();
    await openFirst();
    expect(document.querySelector("[data-placeholder]")).toHaveTextContent("A confirmar");
  });
});

describe("BookPageMedia", () => {
  const base = { ...projects[1]!, media: [] };
  const t = (l: "pt" | "en") => messages[l].projects;
  const img = (n: number, extra = {}) => ({ kind: "image" as const, src: `/i${n}.png`, width: 4, height: 3, alt: { pt: `imagem ${n}`, en: `image ${n}` }, ...extra });

  it("renders an intentional empty plate without media", () => {
    render(<BookPageMedia project={base} locale="pt" t={t("pt")} />);
    expect(document.querySelector("[data-media-empty]")).toHaveTextContent("Ilustrações em preparação");
  });
  it("renders a single image with localized alt and no gallery controls", () => {
    render(<BookPageMedia project={{ ...base, media: [img(1)] }} locale="en" t={t("en")} />);
    expect(screen.getByRole("img", { name: "image 1" })).toHaveAttribute("src", "/i1.png");
    expect(screen.queryByRole("button", { name: "Next plate" })).toBeNull();
    expect(document.querySelector("figcaption")).toBeNull();
  });
  it("pages through several media in PT and EN", () => {
    const { unmount } = render(<BookPageMedia project={{ ...base, media: [img(1), img(2, { caption: { pt: "legenda", en: "caption" } })] }} locale="pt" t={t("pt")} />);
    expect(screen.getByText("1 de 2")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Próxima ilustração" }));
    expect(screen.getByText("2 de 2")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "imagem 2" })).toBeInTheDocument();
    expect(screen.getByText("legenda")).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole("button", { name: "Ilustração anterior" }), { key: "ArrowLeft" });
    expect(screen.getByText("1 de 2")).toBeInTheDocument();
    unmount();
    render(<BookPageMedia project={{ ...base, media: [img(1), img(2)] }} locale="en" t={t("en")} />);
    fireEvent.click(screen.getByRole("button", { name: "Previous plate" }));
    expect(screen.getByText("2 of 2")).toBeInTheDocument();
  });
  it("renders local video with poster and hosted video as an embed", () => {
    const { unmount } = render(<BookPageMedia locale="en" t={t("en")} project={{ ...base, media: [
      { kind: "video", source: { provider: "file", src: "/v.mp4" }, poster: "/p.jpg", title: { pt: "v", en: "Demo" } },
    ] }} />);
    const v = document.querySelector("video")!;
    expect(v).toHaveAttribute("src", "/v.mp4");
    expect(v).toHaveAttribute("poster", "/p.jpg");
    expect(v).toHaveAttribute("controls");
    unmount();
    render(<BookPageMedia locale="pt" t={t("pt")} project={{ ...base, media: [
      { kind: "video", source: { provider: "youtube", id: "abc" }, title: { pt: "Demonstração", en: "Demo" } },
    ] }} />);
    expect(screen.getByTitle("Demonstração")).toHaveAttribute("src", "https://www.youtube-nocookie.com/embed/abc");
    expect(document.querySelector("video")).toBeNull();
  });
  it("builds Vimeo embeds", () => {
    expect(videoEmbedUrl({ provider: "vimeo", id: "42" })).toBe("https://player.vimeo.com/video/42");
    expect(videoEmbedUrl({ provider: "file", src: "/x.mp4" })).toBeNull();
  });
  it("enlarges an image and Escape closes only the enlarged view", async () => {
    await setup();
    await openFirst();
    const trigger = screen.getByRole("button", { name: /^Ampliar imagem/ });
    fireEvent.click(trigger);
    expect(screen.getByRole("button", { name: "Fechar imagem ampliada" })).toBeInTheDocument();
    fireEvent.keyDown(document.activeElement!, { key: "Escape" });
    await act(async () => { await vi.advanceTimersByTimeAsync(50); });
    expect(screen.queryByRole("button", { name: "Fechar imagem ampliada" })).toBeNull();
    expect(screen.getByTestId("open-book")).toBeInTheDocument();
    expect(document.activeElement).toBe(trigger);
  });
  it("marks the plate available when a project has media", async () => {
    await setup("/en");
    await openFirst();
    expect(document.querySelector(".book-page-right")).toHaveAttribute("data-media-state", "available");
  });
});
