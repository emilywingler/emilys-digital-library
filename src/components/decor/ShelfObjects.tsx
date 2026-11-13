/** Small decorative shelf objects. aria-hidden, colored via currentColor. */
type Props = { className?: string };

/** Antique desk globe on a brass stand. */
export function Globe({ className }: Props) {
  return (
    <svg viewBox="0 0 60 80" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="30" cy="30" r="20" fill="currentColor" fillOpacity=".18" />
      <ellipse cx="30" cy="30" rx="9" ry="20" />
      <path d="M10 30h40M13 20h34M13 40h34" opacity=".7" />
      <path d="M8 34a22 22 0 0 0 40 8" strokeWidth="2" />
      <path d="M30 52v14M20 74h20M24 66h12" strokeWidth="2" />
    </svg>
  );
}

/** Potted trailing plant. */
export function Plant({ className }: Props) {
  return (
    <svg viewBox="0 0 60 80" className={className} aria-hidden="true" fill="currentColor">
      <path d="M18 56h24l-3 22H21z" opacity=".85" />
      <path d="M30 56C28 40 18 34 10 34c4 8 10 16 20 22zM30 56c2-18 12-26 22-26-4 10-12 20-22 26zM30 56c-1-20 4-34 10-40 1 14-4 30-10 40z" opacity=".6" />
      <path d="M20 58c-6 6-8 12-6 18M40 58c4 4 8 6 8 12" stroke="currentColor" strokeWidth="1.5" fill="none" opacity=".6" />
    </svg>
  );
}
