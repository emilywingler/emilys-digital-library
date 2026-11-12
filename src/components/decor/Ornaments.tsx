/**
 * Decorative SVG ornaments. They use `currentColor`, so color comes from the
 * parent's text token, and are `aria-hidden` because they carry no meaning.
 */
type Props = { className?: string };

/** Small eight-point star used as a typographic separator. */
export function Fleuron({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M12 1l2 7.2L21 6l-4.6 6L21 18l-7-2.2L12 23l-2-7.2L3 18l4.6-6L3 6l7 2.2z" />
    </svg>
  );
}

/** Horizontal rule with a central diamond — section divider. */
export function Divider({ className }: Props) {
  return (
    <svg viewBox="0 0 400 16" preserveAspectRatio="none" className={className} aria-hidden="true" fill="none" stroke="currentColor">
      <path d="M0 8h180M220 8h180" strokeWidth="1" />
      <path d="M200 2l6 6-6 6-6-6z" fill="currentColor" stroke="none" />
      <circle cx="186" cy="8" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="214" cy="8" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Corner flourish for engraved frames. Rotate via className for other corners. */
export function Flourish({ className }: Props) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      <path d="M2 46V14C2 7 7 2 14 2h32" />
      <path d="M8 46V18c0-6 4-10 10-10h28" opacity=".6" />
      <path d="M14 14c6 0 8 4 6 8s-8 2-6-3" />
    </svg>
  );
}
