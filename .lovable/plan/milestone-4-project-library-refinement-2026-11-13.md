# Milestone 4 — Project Library refinement

Targeted refinement. Desktop book, artwork, project text, Home/Experience/Skills/Contact stay untouched.

## 1. Bookshelf composition (following your new reference)

- All four project books stand together in the middle of the main shelf, side by side, as the clear focal point.
- Plain, darker decorative books sit at the left and right ends, on the same shelf and on the other shelf level, with empty space left on purpose.
- Decorative books get small, faint markings (thin gold bands, small numerals or a short word in muted gold) so they look lived-in. Project titles are larger and brighter so the four project books always stand out.
- The green leaning book moves to the end of a group, resting against its neighbour like the leaning book on the right in your reference. It never covers a project spine again.
- Globe and plant stay exactly as they are.
- All decorative books stay non-clickable and are hidden from screen readers.

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

- `src/content/projects.ts`: projects `shelf: 1` grouped in consecutive order; decor reordered to the sides, with an optional faint `label` (data only).
- `DecorItem.tsx`: renders the optional faint label and gold bands; lean now rests against the neighbour instead of overlapping.
- `BookSpine.tsx`: add an absolutely positioned `writing-mode: vertical-rl` text layer within a measured title band (percent offsets of the 137:842 artwork); optional `spineWidth` override in `Project` type used only when needed.
- `styles.css`: spine-title utility; decor lean origin adjusted.
- `OpenBook.tsx` / `ProjectLibrary.tsx`: only touched if the mobile cover bug reproduces.
- No new dependencies, no backend.  
Additional implementation requirements
  ### 5. Spine title orientation and artwork protection
  - Match the exact visual orientation and reading direction of the existing "Emily Wingler" lettering. Do not assume that `writing-mode: vertical-rl` automatically produces the correct visual result.
  - Preserve the original stars, the printed name, and all decorative details exactly as they appear in the artwork.
  - The title must remain entirely within its designated band, with visible spacing above and below. It must never overlap the stars, the name, or other decorative artwork.
  - If the available title area is insufficient, adjust the title layout or spine width rather than reducing readability or compromising the existing artwork.
  - Verify the rendered result against the original spine artwork at actual display size.
  ### 6. Responsive layout precision
  - Treat 960px as the explicit layout breakpoint, but ensure the single-page layout uses the available width effectively and does not retain unnecessary desktop spread spacing.
  - Do not solve narrow layouts by simply shrinking the desktop two-page spread.
  - Keep the book visually recognizable as a physical book in every viewport, preserving its parchment styling, typography, proportions, and reading hierarchy.
  - The close button must remain visible and reachable without requiring the user to scroll to the top or bottom of the opened book.
  ### 7. Interaction and cover transition validation
  - Test the complete interaction sequence in the running application: tap/click spine → book moves forward → localized cover is revealed → cover transitions into the opened book.
  - Test with actual touch interaction on mobile, not only browser emulation or automated component tests.
  - Verify that rapid taps, repeated opening and closing, language switching, and image loading do not cause the cover phase to be skipped or replaced by a generic popup.
  - Preserve the existing desktop interaction and animation unless a specific regression is identified.
  ### 8. Verification evidence and reporting
  - Provide actual screenshots or visual evidence for the requested viewport and language combinations.
  - Verify the bookshelf composition, all four localized spine titles, cover reveal, opened-book layout, scrolling, and close behavior.
  - Report each viewport and language actually tested. Do not mark a test as passed if it was not executed.
  - Distinguish between automated test results and visual/manual interaction checks.
  - If any requested behavior cannot be verified or implemented within the current scope, explain the limitation instead of silently substituting another behavior.
  ### 9. Scope protection
  - This is a targeted refinement of the existing Project Library, not a redesign or rebuild.
  - Inspect the current implementation and existing assets before making changes. Reuse existing components, data structures, styles, and artwork wherever possible.
  - Do not modify project descriptions, project information, cover artwork, or unrelated sections.
  - Do not introduce new dependencies, backend services, APIs, or unrelated refactoring.
  - Before changing `OpenBook.tsx` or `ProjectLibrary.tsx`, confirm that the reported mobile cover issue is reproducible and identify the specific cause.
  - At completion, summarize the files changed, the reason for each change, the responsive behavior implemented, and the tests and visual checks actually performed.