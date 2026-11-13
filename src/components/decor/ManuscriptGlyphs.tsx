import type { ManuscriptVariant } from "@/types/content";

/** Tiny line-art symbols for the Lost Manuscripts (16px viewBox, currentColor, decorative). */
const PATHS: Record<ManuscriptVariant, string> = {
  note: "M3 3h7l3 3v7H3z M10 3v3h3 M5 8h6 M5 10.5h4",
  quill: "M3 2h7v12H3z M5 6h3 M5 8.5h3 M14 2c-3 1-5 4-6 8l1 .5c1-3 3-6 5-8.5z",
  scroll: "M4 3h8a2 2 0 0 1 0 4H4 M4 3a2 2 0 0 0 0 4v6h8v-6 M6 10h4",
  book: "M8 4C6.5 3 4.5 2.8 2 3v9c2.5-.2 4.5 0 6 1 1.5-1 3.5-1.2 6-1V3c-2.5-.2-4.5 0-6 1z M8 4v9",
  star: "M8 1.8l1.6 4.1 4.4.3-3.4 2.8 1.1 4.3L8 10.9l-3.7 2.4 1.1-4.3L2 6.2l4.4-.3z",
  annotation: "M2 12c2-1 3-5 5-5s1 4 3 4 2-3 4-4 M2 14h12 M11 2l2 2-5 5H6V7z",
  seal: "M2 4h12v9H2z M2 4l6 5 6-5 M8 9m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0",
};

export function ManuscriptGlyph({ variant, className }: { variant: ManuscriptVariant; className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" focusable="false">
      <path d={PATHS[variant]} />
    </svg>
  );
}
