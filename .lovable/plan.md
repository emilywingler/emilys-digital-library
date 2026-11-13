# Milestone 4 — Project Library refinement

Targeted refinement. Desktop book, artwork, project text, Home/Experience/Skills/Contact stay untouched.

## 1. Bookshelf composition
- Move all four project books onto the main (top) shelf, grouped side by side as the focal point, keeping their current heights and the uploaded spine artwork.
- Second shelf: decorative (non-clickable) books only, placed mainly at the sides, with deliberate empty space — no extra fillers.
- Globe and plant stay exactly as they are (artwork, scale, look).
- Fix the green leaning decorative book: today it leans over the Pendulum spine and covers part of it. It moves so it never overlaps or blocks a project book.
- The small green decorative spine will be placed following the bookshelf reference you are uploading — I will wait for that image and match its position and scale before building this part.

## 2. Spine titles
- Each project title is written on its spine in IM FELL English SC, gold like your name, running vertically in the same direction as "Emily Wingler".
- It sits in the empty band between the top stars and your name, with a clear gap so your name is never touched.
- Title comes from the existing project data, so it switches with PT/EN automatically.
- Long titles wrap to two lines; only if two lines still don't fit legibly does that spine get slightly wider (artwork scaled proportionally, never stretched).
- Artwork files are not modified; the title is a separate text layer. Screen readers keep reading the title once (from the button label).

## 3. Responsive open book
- Desktop (960px+): two-page spread unchanged.
- Tablet/narrow (below 960px): single bound page; mobile spacing below 600px.
- Re-verify the cover reveal on every size, including real touch taps on mobile (the reported "generic popup" case), and fix it if any path skips the cover (e.g. preload timing or a phase reset).
- One scroll area per opened book, using the site scrollbar style; no nested scrolling, no horizontal overflow, close button always visible.

## 4. Verification
- Screenshots at 1440, 1024, 768, 390, 360 in PT and EN: shelf, each spine title, cover phase, open phase, scroll and close.
- Tests updated: four project books on one shelf, decor non-interactive, spine title matches localized title, existing open/close/focus/reduced-motion tests still pass.

## Technical details
- `src/content/projects.ts`: projects `shelf: 1`, reorder decor (data only).
- `BookSpine.tsx`: add an absolutely positioned `writing-mode: vertical-rl` text layer within a measured title band (percent offsets of the 137:842 artwork); optional `spineWidth` override in `Project` type used only when needed.
- `styles.css`: spine-title utility; decor lean origin adjusted.
- `OpenBook.tsx` / `ProjectLibrary.tsx`: only touched if the mobile cover bug reproduces.
- No new dependencies, no backend.
