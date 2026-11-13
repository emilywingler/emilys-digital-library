import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/i18n/locale";
import { resolveCursor } from "./cursorLabel";

/** Media query that enables the star; touch-first devices never see it. */
export const FINE_POINTER = "(hover: hover) and (pointer: fine)";

/**
 * Site-wide contextual cursor: a small gold star that trails the (always
 * visible) native cursor. Grows on controls and shows a localized action label
 * on specific ones (see `resolveCursor`). Hidden while the keyboard is in use;
 * reduced motion disables the easing. Purely decorative (aria-hidden).
 */
export function StarCursor() {
  const { t } = useLocale();
  const tRef = useRef(t.cursor);
  tRef.current = t.cursor;
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<{ visible: boolean; interactive: boolean; label?: string | undefined }>({ visible: false, interactive: false });
  const node = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia(FINE_POINTER);
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener?.("change", sync);
    return () => mq.removeEventListener?.("change", sync);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let x = -100, y = -100, cx = x, cy = y, raf = 0;
    const tick = () => {
      cx += (x - cx) * 0.45; cy += (y - cy) * 0.45;
      if (node.current) node.current.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.3 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX; y = e.clientY;
      if (reduce || !node.current?.dataset["visible"]) { cx = x; cy = y; if (node.current) node.current.style.transform = `translate3d(${x}px, ${y}px, 0)`; }
      else if (!raf) raf = requestAnimationFrame(tick);
      const r = resolveCursor(e.target as Element, tRef.current);
      setState((s) => (s.visible && s.interactive === r.interactive && s.label === r.label ? s : { visible: true, ...r }));
    };
    const hide = () => setState((s) => ({ ...s, visible: false }));
    const onOut = (e: PointerEvent) => { if (!e.relatedTarget) hide(); };
    window.addEventListener("pointermove", onMove, { passive: true });
    // A click usually changes what is under the pointer (a book opens): drop the label until the next move.
    const onDown = () => setState((s) => ({ visible: s.visible, interactive: false }));
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerout", onOut);
    window.addEventListener("keydown", hide);
    window.addEventListener("blur", hide);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerout", onOut);
      window.removeEventListener("keydown", hide);
      window.removeEventListener("blur", hide);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div ref={node} aria-hidden="true" className="star-cursor" data-testid="star-cursor"
      data-visible={state.visible || undefined} data-interactive={state.interactive || undefined}>
      <span className="star-cursor-mark">✦</span>
      {state.label && <span key={state.label} className="star-cursor-label">{state.label}</span>}
    </div>
  );
}
