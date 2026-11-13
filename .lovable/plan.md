# Section Transitions & Navigation Experience

Refines only the passage between sections. Sections, microinteractions, cursor, bookshelf and the book state machine stay untouched.

## What the reference does (translated, not copied)
- Sections feel like stacked layers: the next one slides up over the previous, which recedes slightly.
- Scroll position drives a gentle, continuous progression instead of on/off fades.
- Each hand-off has its own character rather than one repeated effect.

## Strategy: "rooms of one library"
One scroll-driven progress value per section (`--enter` / `--leave`, 0 to 1), written by a single passive scroll listener in the existing `useRevealOnce` area (renamed role: section motion hook). CSS reads the values; native scroll is never intercepted. Where the browser supports CSS scroll-driven animations (`animation-timeline: view()`), CSS does it alone and the script is skipped.

Hand-offs, each tied to the section's metaphor (transform/opacity only, max ~24px movement, less on mobile):
1. Home -> Experience: the newspaper sinks a few px and dims slightly as the folder rises over it, like a page set down on the desk.
2. Experience -> Skills: the folder recedes back while the catalog cabinet arrives with a short rise; a faint shadow line on the cabinet edge reads as depth.
3. Skills -> Projects: the bookshelf's top edge is revealed by a soft "curtain" (clip-path from a warm shadow band) as it enters, like walking into a darker aisle.
4. Projects -> Journal: the journal pages rise with a tiny paper rotation settling to 0.
5. Journal -> Contact: the bookmark drops in from above its tassel point, ending the page.

Background continuity: a fixed atmospheric gradient behind `<main>` shifts warmth slightly by active section (one CSS variable), so the page reads as one continuous room.

## Safety rules
- Existing one-shot `data-reveal` entrances are replaced by these progress-driven ones only on section wrappers; inner microinteractions untouched.
- Projects section transforms are disabled while a book is open or a spine is lifted, so `getBoundingClientRect()` return measurement is unaffected (verified against the spine rect).
- No sticky/pinned sections, no scroll snapping, no layout shifts (transforms only, no height changes).
- Reduced motion: all progress effects off, content static and fully visible.
- Intensity halved below 768px; no clip-path curtain below 600px.

## Files
Edit: `src/styles.css` (motion block), `src/hooks/useRevealOnce.ts` (progress variables), section wrappers in `HomeFrontPage`, `ExperienceFolder`, `SkillsCatalog`, `ProjectLibrary`, `WinglerJournal`, `ContactBookmark` (data attribute only), `docs/ARCHITECTURE.md`, `AGENTS.md`.
New test: progress computation and reduced-motion bypass.

## Verification
Vitest (existing + new). Playwright PT/EN at 1440/1024/768/390/360: screenshots mid-transition for each of the 5 hand-offs scrolling down and up, overflow check, layout-shift check, book open/close with return-position comparison, reduced-motion run, console errors. Safari/Firefox/real touch reported as unverified.
