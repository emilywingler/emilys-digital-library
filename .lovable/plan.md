# Milestone 6 — Project Media Integration

The five images you uploaded with this message will be the first media: one each for Olist, Pendulum and ML Studies, and two for Bakery (main screen + "contas a pagar"), which also exercises the gallery. Nothing else is generated or searched.

## What exists today (reused, not replaced)
- `Project.media: ProjectMedia[]` in `src/types/content.ts` already exists (image/gif/video/video-link/dashboard), every project has `media: []`.
- `BookPageMedia.tsx` already renders the right page ("plate"): empty state = faint cover + "Plates in preparation"; otherwise stacks all items vertically.
- `OpenBook.tsx` marks the right page `data-media-state="available|empty"`. CSS: at 960px+ it is the right page of the spread; below 960px it becomes a section under the text in the same single leaf (empty plates are hidden there). One shared `.book-scroll` — no nested scrolling.
- Open/close phases, cover reveal, Radix focus/Escape handling stay untouched.

## 1. Media model (small extension of the existing union)
`src/types/content.ts` — replace the loose union with:
- `ImageMedia { kind: "image"; src; alt: LocalizedText; width; height; caption?: LocalizedText; description?: LocalizedText }` (gif is just an image src).
- `VideoMedia { kind: "video"; source: { provider: "file"; src } | { provider: "youtube" | "vimeo"; id }; title: LocalizedText; poster?; caption?; description? }`.
- `ProjectMedia = ImageMedia | VideoMedia`; order = array order (explicit, editable).
- `dashboard` / `video-link` variants are unused by any project and are dropped; the Power BI embed returns as a video/iframe-style variant only when it actually exists.
- `src` stays a plain URL string, so a Supabase Storage public URL can replace the asset pointer URL later with no component change. Physical files = `.asset.json` pointers in `src/assets/projects/<id>/media/`; metadata = media entries; project info = the rest of the `Project` row (maps to a future `project_media` table with `project_id, position, kind, src, alt_pt, alt_en, ...`).

## 2. Content
`src/content/projects.ts`: add one `media` entry per project (two for Bakery), with PT/EN alt text describing only what is visible in the screenshot. Olist caption: "Painel em desenvolvimento — prévia" / "Dashboard in progress — preview" (no claim of completion). Captions are short and factual; I will flag them for your review. Descriptions, covers, spines untouched.

## 3. Rendering in the existing plate (`BookPageMedia.tsx`)
- 0 items: current empty plate, unchanged.
- 1 item: shown framed on the plate (`object-contain`, fixed aspect from width/height to avoid layout shift), caption beneath in the existing italic small style.
- 2+ items: same frame shows one item at a time, with a small row below: previous / "1 de 2" / next, in the masthead typography and paper colors (no carousel library). Buttons have localized labels; arrow keys work when the controls are focused; live region announces the position.
- Video: `file` → native `<video controls preload="metadata" poster>`; `youtube`/`vimeo` → lazy `iframe` (youtube-nocookie) in a 16:9 frame with localized title.
- Enlarge: image is a button opening a nested Radix Dialog (already a dependency) showing the full image + caption; Escape closes only the enlarged view and returns focus to the image; the book stays open. Disabled transitions under reduced motion.

## 4. Mobile / tablet
- Below 960px the plate stays in its current spot below the text inside the single bound leaf; with media present it now shows (existing `data-media-state="available"` rule). Frame width = page width, max-height capped (~60dvh) so tall screenshots don't dominate; controls ≥44px touch targets; no horizontal scroll, no inner scroll.
- Desktop: frame fills the right page vertically centered, as today's layout intends.

## 5. i18n (`src/i18n/messages.ts`)
New `projects` keys PT/EN: previous, next, position ("{n} de {total}" / "{n} of {total}"), enlarge, closeEnlarged, videoLabel.

## Risks
- Nested dialog vs book Escape/outside-click: verify Escape closes only the zoom.
- Media must stay hidden during the cover phase (already guaranteed by `.book-page-content` visibility rule).
- Tall images could lengthen the mobile leaf; mitigated by max-height.
- iframes inside the Radix focus trap: check tab order.

## Tests & docs
- Update `src/test/project-library.test.tsx` "renders each media type" to the new model; add: single image (alt per locale), gallery next/prev + position text PT/EN, video file vs YouTube embed, optional caption/poster absent, empty plate still rendered, `data-media-state` toggling.
- `src/test/projects-content.test.ts`: every project has ≥1 media item, each image has PT+EN alt, Olist caption mentions in-progress.
- Browser check PT/EN at 1440/1024/768/390/360: open each book, gallery, zoom, no horizontal overflow.
- Update `docs/ARCHITECTURE.md` media section and the AGENTS.md Project Library rule.

## Files
Modified: `src/types/content.ts`, `src/content/projects.ts`, `src/components/library/BookPageMedia.tsx`, `src/styles.css` (plate/gallery rules only), `src/i18n/messages.ts`, two test files, docs. New: asset pointers only (possibly a small `MediaLightbox` inside `BookPageMedia.tsx`, no new file unless it grows). No new dependencies; `OpenBook.tsx` only passes `t` instead of `emptyLabel`.
