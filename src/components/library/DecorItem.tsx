import { Globe, Plant } from "@/components/decor/ShelfObjects";
import type { ShelfDecor } from "@/types/content";

/** Non-interactive shelf filler. Hidden from assistive tech: it is not a project. */
export function DecorItem({ item }: { item: ShelfDecor }) {
  if (item.kind === "globe") return <Globe className="h-[calc(6rem*var(--spine-scale))] shrink-0 text-gold" />;
  if (item.kind === "plant") return <Plant className="h-[calc(6.5rem*var(--spine-scale))] shrink-0 text-olive" />;
  return (
    <span
      aria-hidden="true"
      data-decor-book
      className={`decor-book shrink-0 ${item.lean ? "origin-bottom-left rotate-[-7deg]" : ""}`}
      style={{
        height: `calc(${item.height}rem * var(--spine-scale))`,
        width: `calc(${item.width}rem * var(--spine-scale))`,
        backgroundColor: `var(--decor-book-${item.tone ?? 1})`,
      }}
    />
  );
}
