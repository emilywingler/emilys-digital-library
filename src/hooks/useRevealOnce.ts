import { useEffect, type RefObject } from "react";

/**
 * One-shot entrance reveal for every `[data-reveal]` element inside `root`.
 * Progressive: content is visible by default (SSR / no JS / no observer).
 * Only elements still below the fold at mount are marked `pending`; each
 * becomes `shown` on first entry and is then unobserved, so scrolling back
 * never replays it. Reduced motion skips straight to `shown`.
 */
export function useRevealOnce(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const els = Array.from(root.current?.querySelectorAll<HTMLElement>("[data-reveal]") ?? []);
    const show = (el: HTMLElement) => { el.dataset["reveal"] = "shown"; };
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") { els.forEach(show); return; }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { show(e.target as HTMLElement); io.unobserve(e.target); }
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    for (const el of els) {
      if (el.getBoundingClientRect().top < window.innerHeight) show(el);
      else { el.dataset["reveal"] = "pending"; io.observe(el); }
    }
    // Never leave content hidden: on unmount, anything still pending is shown.
    return () => { io.disconnect(); els.forEach((el) => { if (el.dataset["reveal"] === "pending") show(el); }); };
  }, [root]);
}
