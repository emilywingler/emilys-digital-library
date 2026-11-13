# Milestone 4 — The Project Library

## Asset inventory (confirmed)

| Project | Cover PT | Cover EN | Spine (shared PT/EN) |
|---|---|---|---|
| 01 Olist | PROJETO_OLIST_-_PT | PROJETO_OLIST_-_EN | LOMBADA_-_PROJETO_OLIST |
| 02 Bimotor pendulum | Pendulo_Bi_Motor_-_PT | Pendulo_Bi_Motor_-_EN | LOMBADA_-_PENDULO_BI_MOTOR |
| 03 ML & DS studies | MEUS_ESTUDOS_-_PT | MEUS_ESTUDOS_-_en | LOMBADA_-_MEUS_ESTUDOS |
| 04 Bakery system | sistema_de_padaria_-_EN-1 (= PT, as you confirmed) | sistema_de_padaria_-_EN | LOMBADA_-_SISTEMA_DE_PADARIA |

- Open-book reference: image-4.png. Used as a reference only, not added to the site.
- Every cover is 595×842 and every spine is 137×842. Spines come in one version for both languages, so only covers switch with the language.
- Each file is 2.5–3.8 MB (they have embedded images). The files go up unchanged to Lovable's file hosting. Covers load only when a book opens, and spines load lazily.

## What you will see

- **Bookshelf:** a dark wooden cabinet with up to three shelves, holding your 4 real books as spines. A few plain decorative books (not clickable, hidden from screen readers) and 1–2 small SVG objects balance the shelves. Books have slightly different heights for a natural look, while each spine keeps its 137:842 proportions.
- **Opening a book:** click a spine, or focus it and press Enter.
  1. The book lifts out and shows its front cover (~350 ms).
  2. The cover swings open on a short CSS 3D hinge (~450 ms).
  3. The two-page spread floats over a dimmed page, with the shelf still visible behind.
- **Closing:** click outside the book, press the X button, or press Escape. A short reverse animation plays, then focus returns to the spine. With reduced motion, the book opens and closes instantly.
- **Left page:** catalog number, title, short intro, description, technologies (as small catalog tags), your role, and a "View on GitHub ↗" link that opens in a new tab.
- **Right page:** project media when it exists. Supported types are image, gif, video, a video link and an embedded dashboard. For now all four are empty: the page shows the cover artwork faintly, with a small note "Ilustrações em preparação / Plates in preparation". No invented screenshots.
- **Mobile:** the shelf books wrap, with no sideways scrolling. The open book becomes one tall sheet with the info page on top and the visual page below, scrolling inside the sheet. The X button stays fixed in the top corner.
- The open-book look follows your screenshot: a light left page, a full-bleed visual right page and a thin spine gutter, restyled in parchment to match the site.

## Content (PT + EN, written from the repos, nothing invented)

Before writing, I will read each repository's README and file layout. Wording rules:
- **Olist:** an exploratory/descriptive analysis. The Power BI dashboard is described as in progress.
- **Pendulum:** an academic project. Mentions the firmware, technical report and video as described in the repo.
- **Studies:** presented as a learning repository.
- **Bakery:** a collaborative OOP course project, not a deployed product.

The "My contribution" line only states what the repo shows. Where it's unclear, I'll mark it as a placeholder for you to review.

## Technical details

New files:
- `src/types/content.ts`: adds `Project`, `ProjectMedia` (a union by `type`), `LocalizedAsset`, and `shelf`/`order`/`featured` fields. The `catalogNo` field is fixed per project and never derived from shelf position.
- `src/content/projects.ts`: the 4 projects, plus the decorative-book data kept separately.
- `src/assets/projects/<slug>/{cover-pt,cover-en,spine}.svg.asset.json`: one pointer per uploaded file, created with `lovable-assets`.
- `src/components/library/`:
  - `ProjectLibrary.tsx`: the section.
  - `Bookshelf.tsx`: groups books by shelf.
  - `BookSpine.tsx`: a button showing the spine artwork, with no extra text on top.
  - `DecorBook.tsx`
  - `OpenBook.tsx`: built on the existing Radix Dialog for focus trap, Escape, outside click, scroll lock and labelling.
  - `BookPageInfo.tsx`
  - `BookPageMedia.tsx`: renders by media type, with an empty fallback.
- `src/components/decor/`: shelf ornaments.
- `styles.css`: new tokens and utilities for wood, page, gutter and the book-open/close keyframes.

Changes to existing files:
- `PortfolioPage.tsx`: replaces the "projects" placeholder.
- `messages.ts`: new interface strings.

Docs to update: ARCHITECTURE, README and AGENTS.

The animation is a small state machine (`lifting → open → closing`) driven by CSS classes. No new libraries.

Tests (vitest + Testing Library):
- exactly 4 projects
- PT/EN fields present
- cover chosen per language
- spine per project
- unique catalog numbers
- decorative books are not interactive
- opens on click and Enter
- closes on Escape, X and outside click, and focus returns to the spine
- empty-media fallback and each media type render
- reduced motion skips the animation

Playwright checks:
- desktop and mobile
- PT and EN
- no horizontal page overflow
- Home, Experience and Skills unchanged

## Out of scope

No backend. No real media yet. Home, Experience and Skills are not redesigned.
