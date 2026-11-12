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

/** Two outlined sparkle stars — header brand mark. */
export function TwinStars({ className }: Props) {
  return (
    <svg viewBox="0 0 26 26" className={className} aria-hidden="true" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 3.5c.2 0 .4.1.5.4l1.9 6.3 5.8 2.1c.4.2.4.8 0 .9l-5.7 2.3-2 6.6c-.1.5-.9.5-1 0l-2-6.6-5.7-2.3c-.4-.1-.4-.7 0-.9l5.8-2.1 1.9-6.3c.1-.3.3-.4.5-.4zm0 2.2-1.5 5c-.1.2-.2.3-.4.3l-4.7 1.8 4.7 1.9c.2.1.3.2.3.3l1.6 5.3 1.6-5.3c.1-.1.2-.2.3-.3l4.7-1.9-4.8-1.7c-.1-.1-.3-.2-.3-.4L12 5.7z" />
      <path d="M19.75 22.12c-.1 0-.19-.08-.2-.18-.18-1.82-.32-2.4-1.99-2.56a.2.2 0 0 1 0-.4c1.71-.16 1.81-.6 1.99-2.42 0-.1.1-.18.2-.18s.19.08.2.18c.18 1.82.29 2.26 1.99 2.42a.2.2 0 0 1 0 .4c-1.68.16-1.81.74-1.99 2.57 0 .1-.09.18-.2.18z" />
    </svg>
  );
}
