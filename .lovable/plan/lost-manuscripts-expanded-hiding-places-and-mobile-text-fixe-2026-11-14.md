# Lost Manuscripts — Expanded Hiding Places and Mobile Text Fixes

## Why the positions repeat today

- Each manuscript has only **two** anchors (Nº 05 has one per book), so a new exploration has at most a 50% chance of moving a note.
- Every anchor is a **corner of one outer section box** (`left/right` + `top/bottom`), so even the "alternative" looks almost the same.
- All markers render from one `ManuscriptSpot` per section, so they can never live inside a tab, a skill drawer, a shelf, an article card or the media page.
- Nº 05 always sits at the same spot beside the info-page fleuron; only the book changes.
- Replay picks randomly and only guarantees that *one* note moves.

## What changes for visitors

- Each manuscript gets roughly 6–12 hiding places spread across different parts of its section; a new exploration moves most notes to visibly different spots.
- Home: newspaper margins, between columns, under the masthead rules, beside ornaments — never on the portrait, buttons, headings or text.
- Experience: inside a chosen tab's content area (empty margin beside the period line or below the list). If that tab isn't open, the note waits there; a fallback spot in the folder frame keeps it reachable when the folder is closed.
- Skills: inside individual drawers/cards (empty corners), in the catalog list background and gaps between cards, across categories. Hidden drawers use the same fallback rule as Experience.
- Projects shelf: on decorative (non-project) books, empty shelf ends, shelf board edges and cabinet background — never on project spines.
- Opened book: info page or media page margins (top/bottom/outer edges), still in a different book each exploration; never on text, screenshots, links or the close button. Book state, geometry and animations untouched.
- Journal: masthead margins, carousel frame, and inside specific article cards (chosen by slide, so it works as articles are added). A note on an inactive slide is reached by paging the carousel; it never changes the carousel height.
- Contact: margins and decorative areas of the bookmark/footer, never on links or text.
- Mobile: manuscript notes, stamp, counter, collection, confirmation box and final letter wrap naturally at 390/360px in PT and EN; buttons stack when needed; boxes fit the screen including notches and scroll inside when long.

## Technical details

- **Anchor registry** (`src/components/manuscripts/anchors.ts`): typed `AnchorDef { id, section, host, cls, needs? }` where `host` names a zone component and `cls` the absolute position inside it. Replaces the flat `ANCHOR_CLASS`; manuscripts reference anchor ids from content data (generated per project/article/skill category so lists stay data-driven).
- **Zones**: new `<ManuscriptZone host="skills:drawer:data" />` drops into existing `relative` containers (adding `relative` only where an element is already a positioned-safe box; no size change). `ManuscriptSpot` becomes a thin wrapper rendering markers whose anchor's host matches. Bookshelf decor `<li>` and empty shelf ends, FolderTabs panels, CardCatalog drawers, Journal slides, OpenBook info/media pages get zones. `BookManuscript` takes the page + anchor class instead of a fixed position.
- **Safety check**: after mount, each marker measures its rect against text nodes, images, and focusables inside its zone (`getClientRects` / `elementsFromPoint` sampling). If it overlaps or the zone is `display:none`/zero-size for a stable reason, it uses its registered fallback anchor for this render only — stored placement and progress unchanged. Same fallback used when the chosen tab/drawer is closed (fallback in the always-visible frame of that section).
- **Selection**: `pickPlacements` groups anchors by host and prefers a host different from the previous exploration's; replay requires every manuscript with alternatives to change anchor (and host when possible). RNG injection kept; sessionStorage/localStorage formats kept (version bump only for placements, old entries discarded and redrawn, progress untouched).
- **Mobile CSS**: `ms-panel`/`ms-letter` use `max-height: calc(100dvh - 2rem - env(safe-area-inset-*))`, width with safe-area insets, padding reduced below 400px; note header switches from `justify-between` nowrap to wrapping flex with `min-w-0`; stamp drops its fixed right margin in favour of header padding that reserves the close button; collection rows and action buttons use `flex-wrap`, `min-w-0`, `text-wrap: pretty`; `overflow-wrap: break-word` only on titles. Exact fixes confirmed from 390/360 screenshots in PT/EN before editing.
- **Tests** (update `src/test/manuscripts.test.tsx`): every anchor is registered and unique; each manuscript has ≥4 anchors over ≥2 hosts; selection over many seeds yields many distinct arrangements; replay moves every manuscript that has an alternative; stored placement survives reload; invalid/old placement redrawn without touching progress; fallback used when a zone is hidden.
- **Browser checks**: several explorations screenshotted per section (both Projects spots, both book pages, Experience tab switch, Skills drawers, Journal paging), overlap audit script (marker rect vs text/images/focusables), horizontal overflow and layout-shift check, keyboard and reduced motion, 1440/1024/768/390/360 in PT and EN. Automated vs manual results reported separately.
- Docs: update `AGENTS.md` manuscripts rule and `docs/ARCHITECTURE.md`.

## Out of scope

## Manuscript texts, glyphs, collection/replay behaviour, book state machine, section layouts and all other interactions stay as they are.  
  
Additional Implementation Requirements — Placement Visibility & Collision Safety

The expanded placement architecture is approved, with the following clarifications:

**1. Inactive tabs and carousel slides**

Do not automatically move a manuscript to its fallback anchor just because its parent tab or carousel slide is temporarily inactive.

- Manuscripts assigned to inactive Experience tabs must remain associated with their original tab and become visible when that tab is opened.
- Manuscripts assigned to inactive Journal slides must remain associated with their original article card and become visible when the visitor navigates to that slide.
- Apply fallbacks only when a placement zone is genuinely unavailable, removed, invalid or permanently unusable.
- Do not treat temporary `display: none` caused by normal tab or carousel behavior as a permanent placement failure.
- Preserve discovery progress and the selected placement when switching tabs, slides or languages.

**2. Collision detection**

The overlap validation must consider the complete marker bounding box, not only its center point.

- Include a reasonable safety margin around readable text and important visual content.
- Check headings, paragraphs, labels, images, links, buttons, form controls and focusable elements.
- Exclude the marker itself from collision checks.
- Avoid relying exclusively on `elementsFromPoint` sampling when it could miss partial overlaps.
- A marker must never obscure readable content or an interactive target.

**3. Randomization constraints**

Replay should maximize placement variation while preserving all placement and collision constraints.

- Prefer a different host and anchor from the previous exploration.
- Change every manuscript's anchor whenever a valid alternative exists.
- If global constraints make that impossible, choose the best valid arrangement instead of forcing an invalid placement.
- Never sacrifice collision safety to satisfy randomization requirements.

**4. Layout preservation**

Manuscript zones must not change the dimensions, flow, spacing or geometry of their host components.

Markers must remain decorative overlays within existing available space.

Preserve all previously approved layouts, artwork, book animations, section transitions, navigation and microinteractions.

**5. Verification**

Include explicit tests for:

- Manuscripts inside inactive Experience tabs becoming visible when the tab is opened.
- Manuscripts inside inactive Journal slides becoming visible when navigating to the corresponding slide.
- No unnecessary fallback when a zone is temporarily hidden.
- No marker/text/image/control overlap.
- Repeated replay with valid placement variation.
- No layout shifts caused by inserting manuscript zones.

Keep the implementation within the existing scope and avoid unnecessary dependencies.