import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export interface FolderItem {
  id: string;
  index: string;
  label: string;
  content: ReactNode;
}

const TONES = ["bg-folder-1", "bg-folder-2", "bg-folder-3", "bg-folder-4"];

/**
 * Archive folder with tabs (WAI-ARIA tabs pattern). Starts closed; the chosen
 * tab rises and merges into the sheet. Arrows/Home/End move focus, Enter/Space open.
 */
export function FolderTabs({ items, label, hint }: { items: FolderItem[]; label: string; hint: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const [focus, setFocus] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const uid = useId();

  const move = (i: number) => { const n = (i + items.length) % items.length; setFocus(n); refs.current[n]?.focus(); };
  const onKey = (e: KeyboardEvent, i: number) => {
    const map: Record<string, number> = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: items.length - 1 };
    const next = map[e.key]; if (next !== undefined) { e.preventDefault(); move(next); }
  };
  const current = open === null ? null : items[open];

  return (
    <div>
      <div className="scroll-fade-right scrollbar-archive overflow-x-auto pr-10 pt-2 md:[mask-image:none] md:pr-0">
        <div role="tablist" aria-label={label} className="flex min-w-max items-end">
          {items.map((it, i) => {
            const active = open === i;
            return (
              <button key={it.id} ref={(el) => { refs.current[i] = el; }} role="tab" type="button"
                id={`${uid}-tab-${i}`} aria-selected={active} aria-controls={`${uid}-panel`}
                tabIndex={i === focus ? 0 : -1}
                onClick={() => { setOpen(i); setFocus(i); }} onKeyDown={(e) => onKey(e, i)}
                className={`relative -mr-2 w-44 shrink-0 rounded-t-lg px-4 pb-3 pt-2.5 text-left text-paper-foreground transition-[transform,filter] duration-200 ease-out motion-reduce:transition-none sm:w-52 ${active ? `z-20 -translate-y-1.5 bg-paper motion-reduce:translate-y-0` : `${TONES[i % TONES.length]} brightness-90 hover:brightness-100`}`}
                style={{ zIndex: active ? 20 : items.length - i }}>
                <span className="block text-[0.6rem] uppercase tracking-[0.25em] opacity-70">{it.index}</span>
                <span className="block truncate font-masthead text-sm uppercase tracking-[0.12em]">{it.label}</span>
                {active && <span aria-hidden className="absolute inset-x-0 -bottom-2 h-3 bg-paper" />}
              </button>
            );
          })}
        </div>
      </div>
      <div id={`${uid}-panel`} role={current ? "tabpanel" : undefined}
        aria-labelledby={current ? `${uid}-tab-${open}` : undefined}
        className="folder-sheet relative z-10 min-h-56 rounded-b-md rounded-tr-md px-6 py-8 sm:px-10">
        {current ? <div key={current.id} className="folder-turn">{current.content}</div>
          : <p className="flex min-h-40 items-center justify-center font-display text-lg italic text-paper-muted">{hint}</p>}
      </div>
    </div>
  );
}
