/**
 * Overlap guard for manuscript markers. Compares the marker's full bounding
 * box (plus a safety margin) with every readable text line, image and
 * interactive target in its section (or book dialog). Decorative
 * (`aria-hidden`) and inactive (`inert`) content is ignored, as is the marker.
 */
export type Verdict = "ok" | "blocked" | "hidden";

const MARGIN = 4;
const OBSTACLES = "img,video,iframe,canvas,picture,a[href],button,input,select,textarea,label,summary,[role=tab],[role=button],[tabindex]:not([tabindex='-1']):not([role=tabpanel])";

type R = { left: number; top: number; right: number; bottom: number };
const hit = (a: R, b: R) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
const ignored = (el: Element) => !!el.closest("[aria-hidden='true'],[inert],.sr-only,.ms-marker,.ms-book-panel");

export function checkMarker(marker: HTMLElement): Verdict {
  if (marker.closest("[inert]")) return "hidden"; // inactive slide: re-checked when it becomes active
  // Opening/closing book: pages are fading or transformed, so geometry is not final yet.
  const phase = marker.closest("[data-phase]")?.getAttribute("data-phase");
  if (phase && phase !== "open") return "hidden";
  const box = marker.getBoundingClientRect();
  if (box.width === 0 || box.height === 0) {
    // Mounted but not rendered (e.g. a filler book hidden at this width) is a genuine
    // failure. Environments without layout (`checkVisibility` missing) are left alone.
    return typeof marker.checkVisibility === "function" && !marker.checkVisibility() ? "blocked" : "hidden";
  }
  const r = { left: box.left - MARGIN, top: box.top - MARGIN, right: box.right + MARGIN, bottom: box.bottom + MARGIN };
  const scope = marker.closest<HTMLElement>("[data-section],[role='dialog']") ?? document.body;

  // Clipped by an overflow container between the marker and its section.
  for (let el = marker.parentElement; el && el !== scope; el = el.parentElement) {
    const s = getComputedStyle(el);
    if (/hidden|clip|auto|scroll/.test(`${s.overflowX} ${s.overflowY}`)) {
      const c = el.getBoundingClientRect();
      if (box.left < c.left || box.right > c.right || box.top < c.top || box.bottom > c.bottom) return "blocked";
    }
  }
  for (const el of scope.querySelectorAll(OBSTACLES)) {
    if (el === marker || el.contains(marker) || ignored(el)) continue;
    for (const c of el.getClientRects()) if (c.width && c.height && hit(r, c)) return "blocked";
  }
  const walk = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  for (let n = walk.nextNode(); n; n = walk.nextNode()) {
    if (!n.textContent?.trim() || !n.parentElement || ignored(n.parentElement)) continue;
    range.selectNodeContents(n);
    for (const c of range.getClientRects?.() ?? []) if (c.width && c.height && hit(r, c)) return "blocked";
  }
  return "ok";
}
