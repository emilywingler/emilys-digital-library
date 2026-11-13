# Milestone 4 — The Project Library

## Asset inventory (confirmed)


| Project             | Cover PT                                           | Cover EN                | Spine (shared PT/EN)         |
| ------------------- | -------------------------------------------------- | ----------------------- | ---------------------------- |
| 01 Olist            | PROJETO_OLIST_-_PT                                 | PROJETO_OLIST_-_EN      | LOMBADA_-_PROJETO_OLIST      |
| 02 Bimotor pendulum | Pendulo_Bi_Motor_-_PT                              | Pendulo_Bi_Motor_-_EN   | LOMBADA_-_PENDULO_BI_MOTOR   |
| 03 ML & DS studies  | MEUS_ESTUDOS_-_PT                                  | MEUS_ESTUDOS_-_en       | LOMBADA_-_MEUS_ESTUDOS       |
| 04 Bakery system    | sistema_de_padaria_-_EN-1 (= PT, as you confirmed) | sistema_de_padaria_-_EN | LOMBADA_-_SISTEMA_DE_PADARIA |


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

## Additional requirements and clarifications

### 1. Asset integrity and loading

- Preserve all uploaded artwork exactly as provided.
- Do not recreate, recolor, crop, stretch, or modify the covers and spines.
- Maintain the original aspect ratios: 595:842 for covers and 137:842 for spines.
- Do not force all books to have the same physical height. The artwork must preserve its proportions, while the rendered book dimensions may vary consistently.
- Verify that the `.svg.asset.json` pointers resolve correctly before integrating them.
- Since the assets are relatively large, inspect their loading behavior and avoid downloading every cover unnecessarily.
- Lazy-load assets where appropriate, but prioritize the selected book's cover so the opening animation does not reveal a blank or unloaded image.
- Do not treat the open-book reference screenshot as a website asset.

### 2. Book opening animation

The animation sequence is important and should feel intentional:

1. The selected spine moves forward and reveals the corresponding front cover.
2. The cover remains visible briefly.
3. The cover rotates around its vertical edge, simulating a physical book opening.
4. The two-page spread appears as a floating overlay.

Avoid showing the two-page content before the opening animation has completed.

The animation must not cause layout shifts in the bookshelf or move the other books.

Make sure the selected book's cover and spine correspond to the same project and language.

### 3. Open-book layout and scrolling

- Keep the two-page spread centered in the viewport on desktop.
- Preserve the visual proportions of the reference screenshot.
- The left page should prioritize readable project information.
- The right page should be a dedicated visual/media area.
- The thin central gutter should visually connect the two pages.
- The book must remain within the viewport without being clipped.
- On mobile, the vertically stacked layout may scroll internally, but the background page must remain locked.
- The close button must remain accessible even when the content is scrolled.

Do not let the empty media state dominate the page. The placeholder should look like an intentional unfinished visual plate, not an error message.

### 4. Project content and reviewability

- Keep descriptions concise and editorial, rather than reproducing README sections.
- Preserve factual accuracy and avoid implying production deployment or results that do not exist.
- Do not invent personal contributions when the repository does not establish them.
- For unclear contribution details, use an explicit placeholder in the data and flag it in the final implementation report for my review.
- Keep PT-BR and EN content structurally consistent.

### 5. Project data and future extensibility

- Keep all project-specific information in `src/content/projects.ts`.
- Keep decorative books separate from real projects.
- Use stable project IDs and catalog numbers.
- Do not derive catalog numbers, shelf assignments, or project identity from array indexes.
- Keep cover, spine, and media paths configurable per project.
- The media component should support optional media without requiring changes to the book layout.
- Do not introduce database abstractions, API layers, or unnecessary architectural complexity at this stage.

### 6. Modal behavior and accessibility

- Use the existing Radix Dialog implementation.
- Ensure focus moves into the dialog when it opens and returns to the selected book when it closes.
- Ensure clicking inside the book does not close the dialog.
- Ensure the outside-click handler does not interfere with links or controls inside the book.
- Keep the close button visible and keyboard accessible.
- Test keyboard navigation and screen-reader labels.

### 7. Visual verification before completion

Before considering the milestone complete, inspect actual rendered screenshots at desktop and mobile sizes.

Pay particular attention to:

- Whether the bookshelf looks like a physical cabinet rather than a row of cards.
- Whether the books have believable proportions and depth.
- Whether the uploaded spine artwork is legible.
- Whether the cover-reveal and opening animation look like one continuous interaction.
- Whether the two-page spread resembles the supplied reference.
- Whether the book remains centered and readable at different viewport sizes.
- Whether the empty media page looks intentional.

Do not consider the milestone complete based on tests alone. Visual inspection is required.

### 8. Scope protection

Do not add features beyond this milestone.

Do not implement:

- Supabase or another backend.
- Authentication or administration panels.
- Project editing interfaces.
- New portfolio sections.
- Unrequested transitions or scroll animations.
- Additional decorative interactions that compete with the books.

Prioritize a polished bookshelf and a convincing book-opening experience over adding more functionality.