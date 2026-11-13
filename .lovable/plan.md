# Milestone 7 — The Wingler Journal

A new section between the Project Library and the Contact Bookmark, styled as a small literary journal ("periodical index"). No other section is changed.

## What you will see
- Masthead in the existing newspaper style: "The Wingler Journal" with a kicker ("Periódico" / "Periodical") and a thin gold rule.
- Each article is an "entry" in the journal: the cover framed like a tipped-in plate (16:9, matching your banner), then title, language tag as text ("PT-BR" / "EN"), optional date and reading time, and the excerpt.
- In-progress articles get a small rotated archival stamp: "Em desenvolvimento" / "In progress" (text + border, not color alone).
- A restrained button "Ler no Medium" / "Read on Medium": real disabled button while in progress (no link, no hover, not focusable as a link); a real new-tab link only when published with a valid https URL; published without URL shows no action.
- One entry today: a wide feature layout on desktop, stacked on tablet/mobile. Multiple entries flow into a two-column index on wide screens.
- Header menu gains "Journal" / "Diário"; hover lifts the plate slightly; reduced motion disables it.

## First entry (in progress, no Medium URL)
- Cover: your uploaded SheBuilds banner, stored as an asset, unaltered.
- Language: PT-BR. Title and description kept in Portuguese only (not auto-translated).
- Title: the banner reads "SheBuilds — Como foi participar?". I will use this only as a clearly marked pending field unless you confirm it is the real title.
- Description: I will draft one neutral sentence (about taking part in SheBuilds and building this portfolio, "em escrita") for you to approve; marked for review.

## Technical details
- Types in `src/types/content.ts`: `JournalArticle { id, title, excerpt, lang: "pt-BR" | "en", cover: { src, alt }, publishedAt?, readingMinutes?, status: "in-progress" | "published", url? }` — flat, maps to future table columns.
- Data `src/content/journal.ts`; asset pointer `src/assets/journal/shebuilds/cover.png.asset.json`.
- Components `src/components/journal/{WinglerJournal,JournalEntry,JournalCta}.tsx`; `JournalCta` decides from status + `isSafeExternalUrl` (https only).
- `sections.ts` adds "journal"; `messages.ts` adds PT/EN strings; styles/stamp tokens in `styles.css`; `PortfolioPage` inserts the section.
- Tests `src/test/journal.test.tsx`: in-progress disabled button, can't be activated/no anchor, published with URL → `target=_blank rel="noopener noreferrer"`, published without/invalid URL → no action, PT/EN labels, heading/landmark semantics.
- Browser check PT/EN at 1440, 1024, 768, 390, 360 for overflow. Update `docs/ARCHITECTURE.md` and `AGENTS.md`.
