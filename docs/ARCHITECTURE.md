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
- Components (`src/components/library/`): `ProjectLibrary` (open state + spine lift/preload) → `Bookshelf` → `BookSpine` / `DecorItem`; `OpenBook` (Radix Dialog) → `BookPageInfo` + `BookPageMedia`.
- Opening phases: spine lifts (220 ms, cover preloads) → `cover` (380 ms) → `opening` hinge (620 ms) → `open`; `closing` 220 ms. Durations live in `OpenBook.tsx` and match the CSS in `styles.css`. Reduced motion skips straight to `open`.
- Media: add items to `media` (`image`, `gif`, `video`, `video-link`, `dashboard`). Empty list = faint-cover "plates in preparation" page.
- Responsive book: at 960px+ two leaves have at least 434px each, with 12px binding and 80px viewport clearance; below 960px one bound leaf is capped at 560px. Below 600px mobile spacing reserves room for the always-visible 44px close button. Width, not viewport height, sizes the spread, so short screens scroll instead of compressing text.
- Scrolling: `.book-scroll.scrollbar-archive` is the only overflow surface, limited to viewport height minus 64px. Both pages grow with their content; there is no per-page scrolling. Radix locks the background. Single-leaf modes omit empty media and unconfirmed contribution placeholders but retain confirmed contribution and all real media. The localized cover retains its 595:842 ratio in every mode; reduced motion still skips the sequence.
