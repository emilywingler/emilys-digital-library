import type { Messages } from "@/i18n/messages";

/** Interactive targets the star reacts to. Text fields are deliberately excluded. */
export const INTERACTIVE = 'a[href], button:not(:disabled), [role="tab"], summary, .book-overlay';

/**
 * Resolves the contextual label for the element under the pointer, from the
 * actual control (its role/state), never from decoration. Returns
 * `{ interactive: false }` for anything that is not a real control.
 */
export function resolveCursor(target: Element | null, t: Messages["cursor"]): { interactive: boolean; label?: string } {
  const el = target?.closest(INTERACTIVE);
  if (!el || el.closest("[aria-hidden='true']") || el.getAttribute("aria-disabled") === "true") return { interactive: false };
  const label = labelFor(el, t);
  return { interactive: true, label };
}

function labelFor(el: Element, t: Messages["cursor"]): string | undefined {
  if (el.classList.contains("book-spine")) return t.openBook;
  if (el.classList.contains("book-close") || el.classList.contains("book-overlay")) return t.close;
  if (el.classList.contains("plate-zoom")) return t.viewImage;
  if (el.classList.contains("plate-nav-btn") || el.classList.contains("journal-nav-btn")) return el.getAttribute("aria-label") ?? undefined;
  if (el.getAttribute("role") === "tab") {
    if (el.getAttribute("aria-selected") === "true") return undefined; // already open: no false promise
    return el.closest(".catalog-cabinet") ? t.openDrawer : t.openTab;
  }
  if (el instanceof HTMLAnchorElement) {
    const href = el.getAttribute("href") ?? "";
    if (href.startsWith("mailto:")) return t.email;
    if (el.target === "_blank") return t.newTab;
    if (href.startsWith("#")) return t.explore;
  }
  return undefined;
}
