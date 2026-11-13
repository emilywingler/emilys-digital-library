/** Braided cord loop + tassel for the contact bookmark. Decorative, currentColor. */
export function Tassel({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 120" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round">
      <path d="M20 2c-8 10 8 18 0 28s8 18 0 26" strokeWidth="2.4" strokeDasharray="3 2" />
      <path d="M20 2c8 10-8 18 0 28s-8 18 0 26" strokeWidth="1.4" opacity=".7" />
      <ellipse cx="20" cy="62" rx="6" ry="7" fill="currentColor" stroke="none" />
      <path d="M14 66h12" strokeWidth="2" />
      {Array.from({ length: 9 }, (_, i) => (
        <path key={i} d={`M${16 + i} 70 L${8 + i * 3} 118`} strokeWidth=".9" opacity={0.6 + (i % 3) * 0.15} />
      ))}
    </svg>
  );
}
