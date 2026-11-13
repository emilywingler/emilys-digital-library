# Architecture

## Stack
TanStack Start (React 19 + TypeScript), Tailwind CSS v4, existing shadcn/Radix primitives, lucide icons. No extra libraries; animations are CSS.

## Folders
- `src/routes/` — `/` (Portuguese) and `/en` (English). Routes only set metadata and render `PortfolioPage`.
- `src/components/layout/` — header, language toggle, section list, placeholders, page assembly.
- `src/components/home/` — newspaper front page (masthead, intro, classifieds links).
- `src/components/skills/` — card catalog (drawers = Radix tabs, index cards).
- `src/components/decor/` — decorative SVG ornaments (no meaning, `aria-hidden`).
- `src/content/` — editable static content with `{ pt, en }` fields.
- `src/i18n/` — interface strings, locale detection, per-locale `<head>` metadata.
- `src/types/` — shared content models.
- `src/styles.css` — the whole design system (colors, fonts, paper texture, utilities).

## Data flow
`src/content/*.ts` → `PortfolioPage` → section components (props) → `profile.intro[locale]`.
The locale comes from the URL via `useLocale()`; components never store language state.

## Language
`/` = pt, `/en` = en. `messages.ts` types English against Portuguese, so missing translations fail the build.

## Scrollbars
Styled in `styles.css`: `html` + `.scrollbar-archive` only, fine pointers only. WebKit/Blink get a star thumb; Firefox gets `scrollbar-color`.

## Future Supabase
Replace imports from `src/content` in `PortfolioPage` with a loader/query that returns the same types. Components stay unchanged.

## Project Library
- Data: `src/content/projects.ts` (`Project[]` + `ShelfDecor[]`). Shelf, order and `catalogNo` are explicit fields — never derived from array position.
- Artwork: `src/assets/projects/<id>/{cover-pt,cover-en,spine}.svg.asset.json` (CDN pointers to the untouched uploads). Covers switch with the locale; spines are shared.
- Spine titles: `BookSpine` draws the localized `title` as a vertical IM Fell text layer in the artwork's blank band (18%–71% of height), never over the printed name. A title too long for two lines gets a taller `spineHeight` (proportional widening), never a smaller font. Decorative books take optional faint `label` and `side` (decor-only shelves split between walls).
- Components (`src/components/library/`): `ProjectLibrary` (open state + spine lift/preload) → `Bookshelf` → `BookSpine` / `DecorItem`; `OpenBook` (Radix Dialog) → `BookPageInfo` + `BookPageMedia`.
- Opening phases: spine lifts (220 ms, cover preloads) → `cover` (380 ms) → `opening` hinge (620 ms) → `open`; `closing` 220 ms. Durations live in `OpenBook.tsx` and match the CSS in `styles.css`. Reduced motion skips straight to `open`.
- Media: `media` is an ordered `ProjectMedia[]` = `ImageMedia` (`src`, localized `alt`, `width`/`height`, optional `caption`/`description`) | `VideoMedia` (`source` = `file` src or `youtube`/`vimeo` id, localized `title`, optional `poster`). Files are `.asset.json` pointers in `src/assets/projects/<id>/media/`, imported only in `src/content/projects.ts`; components receive plain URLs, so storage URLs can replace pointers later (future `project_media` rows: project_id, position, kind, src, alt_pt/en…). `BookPageMedia` renders: empty → faint-cover "plates in preparation"; one item → framed plate; several → one plate with prev/next + live "n of total" (arrow keys). Images open a nested Radix Dialog (Escape/outside closes only the zoom, focus returns to the image). No embed type for dashboards until a real embed exists.
- Responsive book: at 960px+ two leaves have at least 434px each, with 12px binding and 80px viewport clearance; below 960px one bound leaf is capped at 560px. Below 600px mobile spacing reserves room for the always-visible 44px close button. Width, not viewport height, sizes the spread, so short screens scroll instead of compressing text.
- Scrolling: `.book-scroll.scrollbar-archive` is the only overflow surface, limited to viewport height minus 64px. Both pages grow with their content; there is no per-page scrolling. Radix locks the background. Single-leaf modes omit empty media and unconfirmed contribution placeholders but retain confirmed contribution and all real media. The localized cover retains its 595:842 ratio in every mode; reduced motion still skips the sequence.

## Contact & portrait (Milestone 5)
- `ContactBookmark` is the final section and footer; links come from `content/links.ts`.
- The Home portrait is `profile.portrait` (asset pointer in `src/assets/profile/`), framed by `NewspaperPortrait`.

## The Wingler Journal (Milestone 7)
- Data: `src/content/journal.ts` (`JournalArticle[]`), covers as `.asset.json` pointers in `src/assets/journal/<id>/`. Title/excerpt stay in the article's own `lang`; never auto-translated.
- Components (`src/components/journal/`): `WinglerJournal` → `JournalEntry` → `JournalCta`.
- CTA rule: `in-progress` → native disabled button (any URL ignored); `published` + https URL → new-tab link with `rel="noopener noreferrer"`; `published` without valid URL → no action.
- Future DB: one `journal_articles` row per entry with the same flat fields.

## Refinements (Nov 2026)
- **OrnateArrow**: the uploaded SVG (unchanged, CDN pointer) is a CSS mask filled with `currentColor`; `length` sets the pointing axis and the other axis follows the native 340:1163 ratio. Used for Home "explore" (down), book plate prev/next and Journal prev/next. Without mask support a thin stroke shows instead.
- **Journal carousel**: `src/content/journal.ts` exports `journalSlots`. `WinglerJournal` shows one slot; inactive slides stay in layout (visibility hidden, `inert`, `aria-hidden`), so height = tallest slide. Counter `01 / 02` is a polite live region; Left/Right work inside the carousel and wrap. `upcoming` renders `UpcomingEntry` (no metadata, stamp or CTA). Replace it by adding an `article` slot.
- **Book closing**: `FOLD_MS`/`RETURN_MS` in `OpenBook`. From `open`, the cover folds shut, then (`returning`) translates/scales so its centre and height match the spine rect from `getOrigin()`; missing rect → shrink-and-fade in place. Close requests during folding/returning are ignored; the spine stays lifted and other books are blocked until unmount, then focus returns to the spine. Reduced motion closes immediately.
