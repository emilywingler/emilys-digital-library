# Targeted refinements: Journal carousel, book closing, custom arrow

## 1. Custom arrow (used everywhere an arrow appears)
- Upload `Seta.png` as-is (341x1164, pale ornate arrow pointing up) and wrap it in one reusable `OrnateArrow` component in `src/components/decor/`, with a `direction` prop (up/down/left/right) that only rotates it. Proportions are never stretched.
- The arrow takes on the surrounding text colour, so it stays readable on parchment and dark backgrounds. It is decorative and hidden from screen readers. Buttons keep their own labels.
- Note: the file is a PNG image, not a true vector. It will look sharp at button sizes, but it isn't infinitely scalable.
- Arrows it replaces on the visible site:
  - Home: the down arrow in "Explorar a biblioteca".
  - Project books: the previous/next plate buttons (currently chevrons).
  - Journal: the new carousel's previous/next buttons.
- Not changed: close (X), menu, contact icons, and the unused built-in UI kit files. Those kit files never appear on the site.

## 2. Journal carousel
- Data: the journal list gets a second entry type, `upcoming`, which has no title, excerpt, date, reading time or link. SheBuilds stays exactly as it is now (first entry, in progress, Medium button visible but disabled).
- New small `JournalCarousel` shows one entry at a time, with no autoplay and a plain crossfade. Animation is skipped when reduced motion is on.
  - Subtle round previous/next buttons with the ornate arrow and labels such as "Artigo anterior" / "Previous article". They wrap around.
  - Position counter `01 / 02`, announced politely to screen readers.
  - Left/Right arrow keys work while focus is inside the carousel.
  - Touch targets are 44px. Nothing scrolls sideways on mobile.
- Upcoming placeholder: a designed plate drawn in code (no generated image). It has parchment, a gold double rule, the twin-star ornament and a short line like "Novos ensaios em breve" / "More essays forthcoming". It has no stamp, no CTA and no fake metadata.
- The title area stays the same. The single-article "feature" layout is reused for every slide.
- Later, swap the placeholder for a real article by replacing the data entry. The carousel itself doesn't change.

## 3. Physical book closing
Current behaviour: closing fades the pages out in 220ms, like a modal. New sequence, reusing the existing cover image and phases:
1. `folding`: the page content fades and the cover swings back closed (the opening hinge played in reverse), about 520ms.
2. `returning`: the closed cover shrinks and moves toward the spine's real position on the shelf, while the overlay fades, about 420ms. The position is measured from the spine at close time; the dialog sets a CSS transform to it.
3. The dialog unmounts, the spine's "lifted" state clears, and focus returns to the spine (existing logic).
- X, Escape and outside click all use this sequence. Repeat close requests during it are ignored, and other spines can't open until it ends (the existing `open || liftedId` guard already covers this).
- Closing during the opening cover phase jumps straight to `returning`.
- Reduced motion: closes immediately, as now.
- The opening animation, covers, spines and content are untouched.

## Technical details
- `OpenBook`: phases become `cover | opening | open | folding | returning`. `FOLD_MS` and `RETURN_MS` are exported and replace `CLOSE_MS`. A new prop `getOrigin(): DOMRect | undefined` comes from `ProjectLibrary` (the spine ref). The cover `<img>` also renders during folding/returning.
- CSS: `cover-fold` keyframes (reverse of `cover-hinge`), plus a `book-return` transform using the `--ret-x/--ret-y/--ret-s` vars. This works in both the 960px+ spread and the single-leaf layout.
- Tests: update `project-library.test.tsx` for the new phases and timings, covering:
  - close via X, Escape and outside click, with focus returning;
  - reopening repeatedly;
  - no other book opening mid-close;
  - reduced motion.
- Add journal tests: two slides, `01 / 02`, next/prev and arrow keys, the placeholder has no link/CTA, SheBuilds stays disabled.
- Browser check: PT/EN at 1440, 1024, 768, 390 and 360px, plus the open/close cycle repeated.
- Update `AGENTS.md` (arrow rule, journal carousel rule) and `docs/ARCHITECTURE.md`.
