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
