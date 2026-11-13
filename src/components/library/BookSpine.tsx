import { forwardRef } from "react";
import type { Project } from "@/types/content";

interface Props {
  project: Project;
  label: string;
  lifted: boolean;
  onOpen: () => void;
  onPreload: () => void;
}

/**
 * One real book on the shelf: the uploaded spine artwork inside a button.
 * No text is drawn over the artwork — the title lives in the accessible name.
 * Width comes from the artwork's 137:842 ratio, so it is never stretched.
 */
export const BookSpine = forwardRef<HTMLButtonElement, Props>(({ project, label, lifted, onOpen, onPreload }, ref) => (
  <button
    ref={ref}
    type="button"
    aria-haspopup="dialog"
    aria-label={label}
    data-lifted={lifted || undefined}
    onClick={onOpen}
    onPointerEnter={onPreload}
    onFocus={onPreload}
    className="book-spine relative shrink-0 cursor-pointer"
    style={{ height: `calc(${project.spineHeight}rem * var(--spine-scale))` }}
  >
    <img src={project.spine} alt="" loading="lazy" decoding="async" draggable={false} className="h-full w-full object-fill" />
  </button>
));
BookSpine.displayName = "BookSpine";
