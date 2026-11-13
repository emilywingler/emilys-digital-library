import { forwardRef } from "react";
import type { Project } from "@/types/content";

interface Props {
  project: Project;
  /** Localized title drawn on the spine. */
  title: string;
  label: string;
  lifted: boolean;
  onOpen: () => void;
  onPreload: () => void;
}

/**
 * One real book on the shelf: the uploaded spine artwork inside a button.
 * The localized title is a separate text layer in the artwork's blank band;
 * the printed name and ornaments are never covered.
 * Width comes from the artwork's 137:842 ratio, so it is never stretched.
 */
export const BookSpine = forwardRef<HTMLButtonElement, Props>(({ project, title, label, lifted, onOpen, onPreload }, ref) => (
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
    {/* Title layer over the empty band between the stars and the printed name.
        aria-hidden: the button label already names the book. */}
    <span aria-hidden="true" className="spine-title" data-spine-title>{title.replace(/-/g, "\u2011")}</span>
  </button>
));
BookSpine.displayName = "BookSpine";
