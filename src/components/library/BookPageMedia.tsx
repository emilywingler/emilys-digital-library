import { useState, type KeyboardEvent } from "react";
import * as D from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { OrnateArrow } from "@/components/decor/OrnateArrow";
import type { ImageMedia, Locale, Project, ProjectMedia, VideoMedia } from "@/types/content";
import type { Messages } from "@/i18n/messages";

type T = Messages["projects"];

/** Embed URL for hosted video providers; `null` for local files. */
export function videoEmbedUrl(source: VideoMedia["source"]): string | null {
  if (source.provider === "youtube") return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(source.id)}`;
  if (source.provider === "vimeo") return `https://player.vimeo.com/video/${encodeURIComponent(source.id)}`;
  return null;
}

/**
 * Image plate. The image is a button that opens a nested Radix Dialog with the
 * enlarged picture; Radix layers make Escape/outside-click close only that view
 * and return focus to this button, leaving the book open.
 */
function PlateImage({ item, locale, t }: { item: ImageMedia; locale: Locale; t: T }) {
  return (
    <D.Root>
      <D.Trigger className="plate-frame plate-zoom" aria-label={`${t.enlarge}: ${item.alt[locale]}`} style={{ aspectRatio: `${item.width} / ${item.height}` }}>
        <img src={item.src} alt={item.alt[locale]} width={item.width} height={item.height} loading="lazy" decoding="async" className="h-full w-full object-contain" />
      </D.Trigger>
      <D.Portal>
        <D.Overlay className="plate-lightbox-overlay fixed inset-0 z-[60]" />
        <D.Content className="plate-lightbox fixed left-1/2 top-1/2 z-[60] -translate-x-1/2 -translate-y-1/2 outline-none">
          <D.Title className="sr-only">{item.alt[locale]}</D.Title>
          <D.Description className="sr-only">{item.caption?.[locale] ?? item.alt[locale]}</D.Description>
          <img src={item.src} alt={item.alt[locale]} className="plate-lightbox-img" />
          {item.caption && <p className="mt-2 text-center text-sm italic text-paper">{item.caption[locale]}</p>}
          <D.Close aria-label={t.closeEnlarged} className="book-close"><X className="h-5 w-5" aria-hidden="true" /></D.Close>
        </D.Content>
      </D.Portal>
    </D.Root>
  );
}

function PlateVideo({ item, locale }: { item: VideoMedia; locale: Locale }) {
  const embed = videoEmbedUrl(item.source);
  if (embed) {
    return (
      <div className="plate-frame aspect-video">
        <iframe src={embed} title={item.title[locale]} loading="lazy" className="h-full w-full border-0" allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen />
      </div>
    );
  }
  return (
    <div className="plate-frame aspect-video">
      <video src={(item.source as { src: string }).src} poster={item.poster} controls playsInline preload="metadata" aria-label={item.title[locale]} className="h-full w-full bg-paper-foreground object-contain" />
    </div>
  );
}

/** One media item plus its optional caption/description. */
function Plate({ item, locale, t }: { item: ProjectMedia; locale: Locale; t: T }) {
  return (
    <figure className="plate m-0" data-media-kind={item.kind}>
      {item.kind === "image" ? <PlateImage item={item} locale={locale} t={t} /> : <PlateVideo item={item} locale={locale} />}
      {(item.caption || item.description) && (
        <figcaption className="mt-3 text-center">
          {item.caption && <span className="block text-xs italic text-paper-muted">{item.caption[locale]}</span>}
          {item.description && <span className="mt-1 block text-xs">{item.description[locale]}</span>}
        </figcaption>
      )}
    </figure>
  );
}

/**
 * Right page: the project's visual plate. No media → faint cover behind a
 * "plates in preparation" note. One item → framed plate. Several → one plate
 * at a time with previous/next controls and a live position counter.
 */
export function BookPageMedia({ project, locale, t }: { project: Project; locale: Locale; t: T }) {
  const [index, setIndex] = useState(0);
  const media = project.media;
  if (media.length === 0) {
    return (
      <div data-media-empty className="relative flex h-full items-center justify-center overflow-hidden">
        <img src={project.cover[locale]} alt="" className="absolute inset-0 h-full w-full object-contain opacity-15 sepia" />
        <p className="relative border border-paper-foreground/30 px-5 py-3 text-center font-masthead text-xs uppercase tracking-[0.25em] text-paper-muted outline outline-1 outline-offset-4 outline-paper-foreground/15">
          {t.plateEmpty}
        </p>
      </div>
    );
  }
  const total = media.length;
  const go = (d: number) => setIndex((i) => (i + d + total) % total);
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
  };
  const current = media[Math.min(index, total - 1)]!;
  return (
    <div className="plate-page flex h-full flex-col justify-center">
      <Plate key={index} item={current} locale={locale} t={t} />
      {total > 1 && (
        <div className="plate-nav" role="group" aria-label={t.plateLabel} onKeyDown={onKey}>
          <button type="button" className="plate-nav-btn" aria-label={t.prev} onClick={() => go(-1)}><OrnateArrow direction="left" length="2.25rem" /></button>
          <span className="plate-nav-pos" aria-live="polite" aria-atomic="true">
            {t.position.replace("{n}", String(index + 1)).replace("{total}", String(total))}
          </span>
          <button type="button" className="plate-nav-btn" aria-label={t.next} onClick={() => go(1)}><OrnateArrow direction="right" length="2.25rem" /></button>
        </div>
      )}
    </div>
  );
}
