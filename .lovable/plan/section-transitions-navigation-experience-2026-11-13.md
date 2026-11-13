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
  
Additional Implementation Requirements

### 1. Section motion hook

Do not repurpose `useRevealOnce` without first inspecting all its existing usages.

The previous hook was designed for one-time entrance reveals, while this milestone requires continuous scroll-progress tracking. Prefer creating a dedicated `useSectionMotion` hook and keeping `useRevealOnce` available for existing inner-element animations.

If replacing the old hook is considered necessary, inspect every usage and ensure no existing behavior is lost.

The scroll-progress system must have:

- A single centralized scroll listener, mounted at the `PortfolioPage` level, not one listener per section.
- Passive native scroll handling.
- `requestAnimationFrame` batching to avoid excessive DOM updates.
- Direct updates to CSS custom properties rather than triggering React renders on every scroll event.
- Proper cleanup of listeners and pending animation frames.

### 2. CSS and JavaScript fallback consistency

Implement two equivalent execution paths:

- **CSS path:** use CSS scroll-driven animations where browser support is sufficient.
- **JavaScript fallback:** calculate section progress and update the corresponding CSS custom properties through the centralized motion hook.

Do not rely solely on `@supports` to assume the complete animation behavior is available. Verify that the required timeline and custom-property behavior are actually implemented.

Both paths must produce equivalent visual results, including scrolling in both directions.

Avoid running CSS-driven and JavaScript-driven animations simultaneously on the same properties.

### 3. Bookshelf curtain isolation

The Skills → Projects curtain must be implemented on an independent decorative layer, not by clipping the actual `ProjectLibrary` content wrapper.

Do not let `clip-path` cut off:

- Book covers and spines.
- Shelf artwork and decorative objects.
- Shadows and interactive elements.
- Focus outlines or content that extends beyond the section boundary.

The effect must remain purely decorative and must not affect layout, hit testing, accessibility, or book positioning.

Keep it disabled below 600px as specified in the original plan.

### 4. Atmospheric background

Keep the background transition optional and lightweight.

If implemented:

- Use one centralized CSS custom property to control the subtle warmth shift.
- Keep the atmospheric layer independent of section content and interactive elements.
- Avoid modifying individual section backgrounds.
- Avoid frequent state changes or unnecessary repaints.
- Ensure the active-section calculation does not flicker when two sections overlap in the viewport.

If the effect requires disproportionate complexity, omit it rather than introducing unnecessary architecture.

### 5. Book interaction regression protection

In addition to the original verification plan, test the book system under active scroll transitions.

Verify:

- Opening a book while a section transition is in progress.
- Closing a book while the page is at an intermediate scroll position.
- Closing a lifted spine after navigating between sections.
- Repeated opening and closing after scrolling to another section.
- No inherited transforms or altered measurements on the book spine or return animation.

Compare the book's return position before and after implementation under identical viewport, scroll, and interaction conditions.

The section motion system must never interfere with the existing book state machine, spine measurements, or return geometry.

### 6. Strict scope preservation

These requirements do not authorize additional redesign or new animations inside the sections.

Preserve all previously approved:

- Section layouts and content.
- Existing microinteractions.
- Contextual cursor behavior.
- Bookshelf and decorative artwork.
- Book opening, closing, and description panel behavior.
- Existing typography, illustrations, and visual assets.

This milestone is exclusively about the transitions between sections and the continuity of the overall navigation experience.