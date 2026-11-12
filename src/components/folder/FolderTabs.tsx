import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export interface FolderItem {
  id: string;
  index: string;
  label: string;
  content: ReactNode;
}

const TONES = ["bg-folder-1", "bg-folder-2", "bg-folder-3", "bg-folder-4"];

/**
 * Archive folder with vertically stacked, alternating hanging tabs (WAI-ARIA
 * tabs, vertical). Starts closed; the chosen tab rises and joins the sheet.
 * Arrows/Home/End move focus, Enter/Space open.
 */
export function FolderTabs({ items, label, hint }: { items: FolderItem[]; label: string; hint: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const [focus, setFocus] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const uid = useId();

  const move = (i: number) => { const n = (i + items.length) % items.length; setFocus(n); refs.current[n]?.focus(); };
  const onKey = (e: KeyboardEvent, i: number) => {
    const map: Record<string, number> = { ArrowDown: i + 1, ArrowRight: i + 1, ArrowUp: i - 1, ArrowLeft: i - 1, Home: 0, End: items.length - 1 };
    const next = map[e.key]; if (next !== undefined) { e.preventDefault(); move(next); }
  };
  const current = open === null ? null : items[open];

  return (
    <div>
      <div role="tablist" aria-label={label} aria-orientation="vertical" className="flex flex-col pt-2">
        {items.map((it, i) => {
          const active = open === i;
          return (
            <button key={it.id} ref={(el) => { refs.current[i] = el; }} role="tab" type="button"
              id={`${uid}-tab-${i}`} aria-selected={active} aria-controls={`${uid}-panel`}
              tabIndex={i === focus ? 0 : -1}
              onClick={() => { setOpen(i); setFocus(i); }} onKeyDown={(e) => onKey(e, i)}
              className={`folder-tab relative -mb-2 w-[82%] px-6 pb-5 pt-3 text-left text-paper-foreground transition-[transform,filter] duration-200 ease-out motion-reduce:transition-none sm:w-[60%] ${i % 2 ? "self-end" : "self-start"} ${active ? "-translate-y-1.5 bg-paper motion-reduce:translate-y-0" : `${TONES[i % TONES.length]} brightness-95 hover:brightness-105`}`}
              style={{ zIndex: active ? 20 : i + 1 }}>
              <span className="block text-[0.6rem] uppercase tracking-[0.25em] opacity-70">{it.index}</span>
              <span className="block truncate font-masthead text-sm uppercase tracking-[0.12em] sm:text-base">{it.label}</span>
            </button>
          );
        })}
      </div>
      <div id={`${uid}-panel`} role={current ? "tabpanel" : undefined}
        aria-labelledby={current ? `${uid}-tab-${open}` : undefined}
        className={`folder-sheet relative z-10 min-h-56 rounded-md px-6 py-8 sm:px-10 ${open !== null && open % 2 ? "rounded-tr-none" : open !== null ? "rounded-tl-none" : ""}`}>
        {current ? <div key={current.id} className="animate-folder">{current.content}</div>
          : <p className="flex min-h-40 items-center justify-center font-display text-lg italic text-paper-muted">{hint}</p>}
      </div>
    </div>
  );
}
