import { useEffect, type RefObject } from "react";

/** Progress of a section entering (0→1) and leaving (0→1) the viewport. */
export function sectionProgress(top: number, bottom: number, vh: number) {
  const span = Math.max(1, Math.min(bottom - top, vh));
  const clamp = (n: number) => Math.min(1, Math.max(0, n));
  return { enter: clamp((vh - top) / (span * 0.6)), leave: clamp((span - bottom) / span) };
}

/** True when CSS scroll-driven timelines and animatable custom properties exist. */
export function supportsCssScrollMotion() {
  return typeof CSS !== "undefined" && "registerProperty" in CSS &&
    CSS.supports("animation-timeline: view()") && CSS.supports("animation-range: entry 0% exit 100%");
}

/**
 * Section hand-off motion for every `[data-section]` inside `root`.
 * Sets `data-motion` on root: `css` (scroll-driven keyframes do it all),
 * `js` (one passive, rAF-batched listener writes `--enter`/`--leave`), or
 * nothing under reduced motion (static). No React renders on scroll.
 */
export function useSectionMotion(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    if (supportsCssScrollMotion()) { el.dataset["motion"] = "css"; return () => { delete el.dataset["motion"]; }; }
    const sections = Array.from(el.querySelectorAll<HTMLElement>("[data-section]"));
    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      for (const s of sections) {
        const r = s.getBoundingClientRect();
        const p = sectionProgress(r.top, r.bottom, vh);
        s.style.setProperty("--enter", p.enter.toFixed(3));
        s.style.setProperty("--leave", p.leave.toFixed(3));
      }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    el.dataset["motion"] = "js";
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
      delete el.dataset["motion"];
      for (const s of sections) { s.style.removeProperty("--enter"); s.style.removeProperty("--leave"); }
    };
  }, [root]);
}
