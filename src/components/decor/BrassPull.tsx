/** Brass drawer pull (cup handle) for catalog drawers. Decorative only. */
export function BrassPull({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 16" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M4 3h32" />
      <path d="M8 3c0 7 5 10 12 10s12-3 12-10" />
      <circle cx="20" cy="13" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}
