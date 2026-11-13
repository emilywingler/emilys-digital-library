import arrow from "@/assets/decor/ornate-arrow.svg.asset.json";

/** Native artwork ratio (width / height) of the supplied upward-pointing SVG. */
const RATIO = 340.07333 / 1163.2013;

export type ArrowDirection = "up" | "down" | "left" | "right";

/**
 * The portfolio's only arrow: Emily's ornate SVG used unchanged as a CSS mask
 * filled with `currentColor`. `length` is the size along the pointing axis;
 * the cross axis follows the native ratio, so it never stretches. Rotation only
 * changes direction. Always decorative — the parent control owns the label.
 */
export function OrnateArrow({ direction = "up", length = "1.5rem", className = "" }: { direction?: ArrowDirection; length?: string; className?: string }) {
  const across = `calc(${length} * ${RATIO})`;
  const horizontal = direction === "left" || direction === "right";
  const rotate = { up: 0, right: 90, down: 180, left: 270 }[direction];
  return (
    <span aria-hidden="true" data-arrow={direction} className={`ornate-arrow ${className}`}
      style={{ width: horizontal ? length : across, height: horizontal ? across : length }}>
      <span className="ornate-arrow-glyph"
        style={{ width: across, height: length, transform: `translate(-50%, -50%) rotate(${rotate}deg)`, ["--arrow-src" as string]: `url("${arrow.url}")` }} />
    </span>
  );
}
