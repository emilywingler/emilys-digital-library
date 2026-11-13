# Targeted refinements: Journal carousel, book closing, custom arrow

The first build step adds these tasks to `roadmap.md`.

## 1. Custom arrow (used everywhere an arrow appears)

- Source checked:
  - The SVG you uploaded is the true vector version of `Seta.png`: same 340x1163 artwork, a single solid fill, pointing up.
  - The PNG is also a clean single-colour silhouette on transparency.
  - Both can be recoloured faithfully, so I'll use the SVG for sharpness.
  - It gets uploaded unchanged. No redrawing, no filters.
- One `OrnateArrow` component in `src/components/decor/`. The artwork works as a CSS mask filled with `currentColor`, so it takes on the button or text colour on both parchment and dark backgrounds.
  - Fixed aspect ratio, with height set by size. Never stretched.
  - `direction` only rotates it: down for Home, left for previous, right for next.
  - The arrow is decorative and hidden from screen readers. Buttons keep their own localized labels, visible gold focus ring and a 44x44px minimum target.
- Replaced on the visible site:
  - Home: the "Explorar a biblioteca" arrow (down).
  - Book plates: previous/next buttons (left/right).
  - Journal: the new carousel buttons.
- Not changed: X, menu, contact icons, and unused UI-kit files that never appear on the site.

## 2. Journal carousel

- Data: `JournalEntry` becomes `{ kind: "article", ...JournalArticle } | { kind: "upcoming", id }`. The upcoming entry has no title, excerpt, date, reading time, URL or status fields at all. SheBuilds stays first and unchanged.
- Rendering by type:
  - Article: the existing `JournalEntry` view, unchanged, with the disabled Medium button.
  - Upcoming: a plate drawn in code (parchment, gold double rule, twin-star ornament) and one localized line, e.g. "Novos ensaios em breve" / "More essays forthcoming". No metadata row, stamp or CTA.
- Stable size: all slides sit in one grid cell, so the carousel keeps the height of the tallest slide. Switching entries causes no layout jump.
- Accessibility:
  - Only the active slide is rendered visible. Inactive slides get `hidden`/`inert`, so they can't be tabbed to or reached by screen readers.
  - The crossfade animates only the incoming slide's opacity. It is skipped with reduced motion.
  - The `01 / 02` counter lives in its own `aria-live="polite"` `aria-atomic` element.
  - The carousel is a `role="region"` with `aria-roledescription="carousel"` and a localized label.
  - Buttons say "Artigo anterior/seguinte" / "Previous/Next article".
- Keyboard: Left/Right work only on keydown inside the carousel, with `preventDefault` there only. They're ignored while focus is in a text field. Navigation wraps both ways (last to first, first to last).
- No autoplay, no new dependencies. To replace the placeholder later, swap the data entry.

## 3. Physical book closing

Phases become `cover | opening | open | folding | returning`.

- Close request by phase:
  - `cover` or `opening`: cancel the opening timers and go straight to `returning`.
  - `open`: `folding` (the cover swings shut, reverse hinge, about 520ms), then `returning` (about 420ms).
  - `folding` or `returning`: ignored.
- This covers X, Escape and outside click (Radix `onOpenChange`). Reduced motion closes immediately, with no timers.
- Return geometry, measured once when `returning` starts:
  - Spine rect from `getOrigin()` and the cover's own current rect (`getBoundingClientRect`).
  - `dx/dy` = spine centre minus cover centre; scale = spine height / cover height.
  - These are applied as CSS vars on the cover (`translate` + `scale`, origin at the centre), so the end state lines up with the spine whatever the layout (spread or single leaf). The overlay fades at the same time.
  - Fallback: if the rect is missing or zero-sized, the cover shrinks and fades in place (current-style) and the sequence still completes.
- Lifecycle:
  - The spine stays lifted until the return ends. Then the dialog unmounts, `liftedId` clears and focus returns to the spine (existing logic).
  - The `open || liftedId` guard blocks any other opening until then.
  - All timers live in one ref and are cleared on unmount and on phase change.
  - A per-open token makes sure a stale callback can't affect a book opened later.
- The opening animation, covers, spines and content are unchanged.

## Technical details

- `OpenBook` exports `FOLD_MS` and `RETURN_MS` (replacing `CLOSE_MS`) and gets a new prop `getOrigin: () => DOMRect | undefined`. The cover `<img>` renders in every phase except `open`. CSS: `cover-fold` keyframes and the `returning` transform vars.
- `ProjectLibrary` passes `getOrigin` from `spineRefs`.
- Tests: `project-library.test.tsx` is updated, plus new journal tests:
  - Book: close via X, Escape and outside click during cover, opening and open; repeated close requests ignored; reopening repeatedly; no other book opens mid-close; spine stays lifted until the end; focus returns; reduced motion is immediate.
  - Journal: two slides, `01 / 02`, wrap both ways via buttons and keys, only the active slide is exposed, the placeholder has no link/CTA/metadata, SheBuilds stays disabled.
- Browser (Playwright, Chromium): PT/EN at 1440, 1024, 768, 390 and 360px.
  - No horizontal overflow; arrows checked on parchment and dark backgrounds; carousel steady between slides.
  - Close animation frames confirm the cover ends on the spine; repeated open/close cycles.
  - The report keeps automated tests and browser checks separate.
- Docs: `AGENTS.md` (arrow rule, journal entry union, close phases) and `docs/ARCHITECTURE.md`, written to match what was actually built.  
  
Additional implementation safeguards
  ### 1. Journal carousel — stable layout
  - Ensure inactive slides remain part of the carousel's layout measurement so the container preserves the height of the tallest slide.
  - Do not use the `hidden` attribute if it applies `display: none` and removes the inactive slide from grid sizing.
  - Keep inactive slides visually hidden, non-interactive, and inaccessible to screen readers using an appropriate combination of visibility, opacity, pointer events, and `inert` or equivalent accessibility handling.
  - Only the active slide may be exposed to assistive technology or receive keyboard focus.
  - Verify that switching between SheBuilds and the upcoming placeholder does not cause the Journal section or surrounding content to jump vertically.
  ### 2. Book closing — coordinate and geometry accuracy
  - Ensure the return translation is converted into the cover element's local coordinate system, accounting for its containing block, positioning context, and existing transforms.
  - Verify both horizontal and vertical alignment at the final animation frame. Do not assume matching heights guarantee matching widths.
  - If the cover and spine aspect ratios differ, prioritize correct alignment and use a visually appropriate scale without distorting the cover artwork.
  - Test the final resting position at desktop, tablet, and mobile sizes, including the spread and single-leaf layouts.
  - Confirm that the cover does not briefly jump between its folding and returning phases.
  ### 3. Custom arrow — asset reliability
  - Use the supplied SVG as an external mask asset, preserving the original file unchanged.
  - Verify that the mask renders correctly in supported browsers and that its color updates through `currentColor` when the surrounding button or text color changes.
  - Provide a graceful fallback if the SVG mask fails to load.
  - Confirm that the arrow retains its original proportions and remains visually legible at all intended button sizes.
  ### 4. Final regression checks
  - Verify that the new Journal carousel does not change the existing section's typography, spacing, or visual hierarchy.
  - Verify that all existing project-book opening and closing behavior remains intact.
  - Check that the SVG arrow replacement does not alter button dimensions, alignment, or interaction areas.
  - Report any browser-specific limitations or tests that could not be executed.