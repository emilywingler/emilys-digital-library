# Final Milestone — The Lost Manuscripts

A quiet, optional easter egg: seven small hidden notes across the portfolio, a discreet collection indicator after the first find, and a final letter from Emily. Frontend only, with no new dependencies. Your seven messages, the hint and the final letter are used word for word.

## What visitors will experience

- Seven small parchment symbols (folded note, quill sheet, rolled scroll, open mini-book, star, annotation and sealed letter) in muted gold and brown. They do not glow or move constantly.
- Tapping, clicking or pressing Enter on a symbol opens a small parchment note with its number and message. A short wax-seal style confirmation plays, and the symbol disappears on future visits.
- After the first find, a small indicator appears in the bottom corner: "The Lost Manuscripts · 01/07" with a short line such as "One forgotten story has been recovered…". It opens an overview of Nº 01–07: found notes show their titles, missing ones show only a faded seal.
- On the seventh find, a slightly grander letter unfolds with your final message. You can reread it any time from the overview.
- The hint "A note for curious readers…" goes in the Home newspaper as a small italic aside under the masthead lead line. It is not a banner.

## Where each note hides (2–3 safe spots per section)

Each section offers a few fixed, hand-picked spots next to existing ornaments. A spot never sits over text, links or controls.

- Nº 01 Home: by a corner flourish of the newspaper, or beside the bottom divider.
- Nº 02 Experience: on the folder's back edge beside the section title, or below the folder.
- Nº 03 Skills: on the cabinet's top or bottom edge, away from the drawer buttons.
- Nº 04 Projects: next to the section title, or at the end of the shelf hint line. It never sits on the shelf or the spines.
- Nº 05 Projects: inside the opened book, in the margin of the information page near the fleuron. It is assigned to one project per session, chosen at random, and is never placed on the image controls or the close button.
- Nº 06 Journal: beside the journal masthead or kicker, never inside the carousel controls.
- Nº 07 Contact: on the bookmark beside the monogram sprig, or near the © line. It stays clear of the cord and tassel.

## Technical details

- `src/content/manuscripts.ts`: typed data for all seven entries (id, number, section, variant, anchor candidates, `{pt,en}` title/body/signature) plus the hint, counter phrases and final letter. Types go in `src/types/content.ts`, and UI labels (close, open collection, marker names) go in `messages.ts`.
- `src/components/manuscripts/`:
  - `ManuscriptProvider`: one context that holds the found ids, session placements and the open note, mounted in `PortfolioPage`.
  - `manuscriptStorage.ts`: pure functions with validated read/write. `localStorage` stores `{version, found: id[], completedAt?}`, and `sessionStorage` stores `{version, placements: {id: anchorId}}`. Malformed or outdated data falls back safely, unknown ids are dropped, and storage failures (private mode) are handled.
  - `placement.ts`: `pickPlacements(manuscripts, rng)` picks one valid anchor per section and rejects pairs marked as neighbours. The random number generator is injected so tests are deterministic. It runs after the page loads, so the server and browser render the same markup.
  - `ManuscriptMarker`: a real `<button>` with an accessible name (e.g. "Lost manuscript Nº 03") and a 44px tap area around a small inline SVG (`src/components/decor/ManuscriptGlyphs.tsx`, `currentColor`, `aria-hidden`). It is placed `absolute` inside a `relative` anchor, so it causes no layout shift. It renders nothing until the page has loaded or when the anchor is not chosen this session. Breakpoint-specific anchors use CSS, and each section keeps at least one anchor that is visible at every width.
  - `ManuscriptAnchor`: a tiny wrapper placed at each chosen spot in the existing section components. These are additive one-line insertions; layouts stay unchanged.
  - `ManuscriptNote`, `ManuscriptCollection` and `ManuscriptLetter` use Radix Dialog for focus trapping, Escape, outside click and focus return to the marker or indicator. They are small, centered, kept within the viewport and narrower on mobile. Motion uses the existing motion tokens, and reduced motion means an instant fade.
  - Nº 05 inside the book is rendered inside the book's own dialog, so its focus trap and closing sequence are not affected. The book's phases and geometry are not changed.
- The existing star cursor labels the markers through `resolveCursor`'s generic link/button handling. The cursor code itself is not modified.
- Tests (`src/test/manuscripts.test.ts(x)`): counts once per id, storage validation and fallback, session reuse and reshuffle with a seeded generator, no collisions, a valid anchor in every section, PT/EN content complete, counter hidden before the first find, letter opens on the seventh unique find, completion persists.
- Browser checks: all seven found in PT/EN at 1440, 1024, 768, 390 and 360 (counter, overview, letter, keyboard, touch emulation, reduced motion, overflow, console). Two sessions compared for different placements, plus a reload. Books opened and closed with Nº 05 present.
- Docs: one `AGENTS.md` rule, an `ARCHITECTURE.md` section and a roadmap entry.

## Open copy (written by me, for your review)

Counter lines for 1–7 ("One forgotten story has been recovered…", etc.), marker names and overview labels. I will flag these in the final report.  
  
Additional Requirements — Placement, Book Integration & Accessibility

The proposed architecture is approved in principle. Please incorporate the following clarifications before implementation.

### 1. Placement algorithm

The portfolio has seven manuscripts distributed across six sections, with two manuscripts in Projects.

The placement algorithm must select one valid anchor for each undiscovered manuscript, not merely one anchor per section.

Requirements:

- Both Projects manuscripts must receive independent valid anchors.
- No two markers may collide or overlap.
- Each selected position must remain stable throughout the current session.
- Responsive layouts must not cause a selected marker to disappear.
- If an anchor needs different positioning at different breakpoints, preserve the same logical placement through responsive variants rather than generating a new random placement.
- Revalidate placements when the viewport changes, without unnecessarily reshuffling the entire collection.

### 2. Manuscript No. 05 — Book integration

Manuscript No. 05 must remain inside the information page of the opened project book, as originally specified.

However, avoid introducing a second modal Radix Dialog nested inside the existing book Dialog.

Prefer a small inline parchment panel or an equivalent non-modal presentation within the book's existing interaction context.

Ensure:

- Opening the manuscript does not close or alter the book.
- Escape closes the manuscript note first, without unexpectedly closing the book.
- The book's close button remains functional.
- Outside-click behavior does not accidentally trigger the book's closing sequence while the note is open.
- Focus remains correctly managed.
- The existing book state machine, geometry, page layout, and return measurements remain untouched.

### 3. Focus restoration

Because discovered markers disappear, do not attempt to restore focus to a marker that has been unmounted.

After closing a manuscript note, restore focus to an appropriate stable element:

- The original section's heading or another nearby stable element.
- For Manuscript No. 05, an appropriate stable element inside the opened book.

Preserve keyboard navigation and predictable focus behavior throughout the experience.

### 4. Storage fallback

The proposed `localStorage` and `sessionStorage` separation is approved.

Additionally:

- If storage is unavailable or throws an exception, the feature must still work during the current page session using in-memory state.
- Do not let storage failures break the portfolio or prevent manuscript discovery.
- Do not repeatedly retry failed storage operations in a way that causes errors.
- Keep the existing version validation and safe fallback behavior.

### 5. Collection indicator

Ensure the bottom-corner collection indicator:

- Does not cover important content, navigation, book controls, or other interactive elements.
- Adapts to mobile safe areas and smaller viewports.
- Remains accessible by keyboard.
- Does not interfere with the existing footer bookmark or section transitions.

### 6. Copy review

Before implementation, provide the complete proposed copy for:

- All seven progress messages.
- Collection overview labels.
- Marker accessible names.
- Open and close labels.
- Any discovery confirmation text.

Provide both Portuguese and English versions.

Keep the supplied seven manuscript messages, initial hint, and final letter exactly as provided. Do not rewrite them.

### 7. Final regression checks

In addition to the existing verification plan, explicitly test:

- Resizing the viewport during a session without losing undiscovered markers.
- Opening and closing Manuscript No. 05 repeatedly.
- Escape behavior when both the book and manuscript note are open.
- Focus restoration after discovering and closing each type of manuscript.
- Storage unavailable or malformed data scenarios.
- No interference with existing book interactions or section navigation.

These changes are implementation safeguards only. They do not authorize changes to the approved visual concept or portfolio sections.