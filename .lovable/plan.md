# Remove "Sobre" and redesign "Experiência" as a tabbed archive folder

## What the reference shows
- Several file sheets overlap one another, each in a different muted paper tone: parchment, taupe, slate grey, kraft brown, dark olive and black.
- Each sheet has one **tab** with notched, rounded shoulders, placed at a staggered height, so all the tabs can be seen at once.
- The tab labels are small and technical: an index ("CODE_001 //") above a short title in capitals.
- Each sheet has a fine paper grain and a soft shadow on the edge it overlaps.
- There are no icons and no extra ornaments.

## 1. Remove "Sobre"
- Delete the whole open book: the timeline, interests, areas of study, languages and margin notes, along with the code, styles, texts and test that only it used.
- Remove "Sobre / About" from the menu.
- The Home's "Explorar a biblioteca" link now points to Experiência.
- The Home's short introduction stays as it is.

## 2. Experiência as a folder with tabs
**Wide screens.** A folder lies across the dark background. Along its top edge there are 4 tabs, one per CV role, slightly overlapping and in alternating paper tones (parchment, taupe, olive, dark brown):
- Each tab shows a small index, "Nº 01 //" to "Nº 04 //", and a short title in IM Fell English SC capitals: UFES · PRPPG, Compass UOL, Adapti, UFES · Graduação.
- **At first** no tab is open. The folder area shows only a quiet line: "Selecione uma pasta / Select a folder".
- **Clicking a tab:** it rises about 6px, takes on the colour of the folder and joins it seamlessly, so it looks pulled out. The others stay in place and turn a little darker. The content fades in over about 200ms.
- **Clicking another tab:** the previous tab drops back down and the new one rises.

**Open folder content.** Only what is already recorded from your CV:
- period, role and organisation
- the CV bullet points for that role, with no new responsibilities or results

**Phone.** The tabs sit in a row you can swipe sideways, in the same style, and the open content appears below them at full width. Nothing is shrunk.

**Keyboard and accessibility:**
- Left and right arrows move between tabs, Home and End jump to the first and last, and Enter or Space opens one.
- Focus is shown with the gold outline already used on the site.
- Screen readers announce the tabs as tabs.
- If reduced motion is turned on, the tab changes without moving.

## Technical details
**Delete:** `src/components/about/*`, `src/content/about.ts`, `src/test/about-content.test.ts`, the About types in `src/types/content.ts`, the `about` strings in `src/i18n/messages.ts`, and the `book-spine`, `leaf-edge` and `ink-note` utilities in `src/styles.css`. Remove `"about"` from `SECTIONS`. Update the `#about` link in `HomeFrontPage`. Replace the BookPage rule in `AGENTS.md`.

**Create:**
- `src/content/experience.ts`: typed `{ pt, en }` data per role (index, tab label, period, role, organisation, bullets), taken from the CV.
- `src/components/folder/FolderTabs.tsx`: a generic, reusable tabbed folder (items with label, index and content). It handles the WAI-ARIA tabs pattern (`role="tablist"`, `tab` and `tabpanel`), roving tabindex and the arrow-key, Home and End shortcuts. It starts with nothing selected.
- `src/components/folder/FolderTab.tsx`: the tab shape, drawn as an SVG notched-shoulder outline in `currentColor` under `decor/`, with the raised state shown through `translate-y` and a `transition`.
- `src/components/experience/ExperienceFolder.tsx`: maps the experience data into FolderTabs.
- `src/test/experience-content.test.ts`: checks the CV dates for each role and that every entry has both pt and en text.

**Modify:**
- `src/styles.css`: add `folder-sheet` (the existing paper grain at a lower contrast) and tab tone tokens taken from the current palette.
- `src/i18n/messages.ts`: add the experience strings.
- `PortfolioPage.tsx`: replace the Experiência placeholder.

No new dependencies.
