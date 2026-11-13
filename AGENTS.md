<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- Locale lives in the URL (`/` pt default, `/en` en); read it with `useLocale()`, never store it in state — keeps links shareable and SSR consistent.
- Visitor-facing content lives in `src/content/` as `{ pt, en }` typed data passed via props — allows swapping to a database later without touching components.
- All design tokens live in `src/styles.css`; components use semantic classes only — single place to retheme.
- Decorative SVGs go in `src/components/decor/`, aria-hidden, using currentColor — keeps decoration separate from content.
- Experience uses `src/components/folder/FolderTabs.tsx` (custom tabs, starts closed); Skills uses Radix Tabs in `src/components/skills/CardCatalog.tsx` (manual activation, first drawer open, orientation follows viewport); CV text in content data is copied verbatim — keeps invented facts out.
- Custom scrollbars apply only to `html` and elements with the `scrollbar-archive` utility, on fine pointers — phones keep native scrollbars.
- Project Library: books are data in `src/content/projects.ts` with artwork as `.asset.json` pointers per project; `OpenBook` wraps Radix Dialog and runs a CSS phase sequence (timings exported from the component) — keeps artwork untouched and modal a11y native. Project media is a typed image/video union with plain URL sources, rendered one plate at a time in the existing right page — keeps storage swappable.
- Opened books use one shared scroll surface: readable two-page spreads at 960px+, a bound single leaf below 960px, and mobile spacing below 600px — prevents compressed text and nested scrolling without duplicating content.
- Project-bearing shelves suppress decorative objects, then filler books with cabinet container queries — project books stay together while roomy and decor-only shelves preserve their composition.
- Contact lives only in `src/components/contact/ContactBookmark.tsx` (also the page footer), reading `src/content/links.ts`; the Home shows the portrait from `profile.portrait` — keeps contact data in one place.
- Journal CTA state is derived only from `status` + `isSafeExternalUrl` in `src/components/journal/JournalCta.tsx` — prevents broken or premature Medium links.
- Every visible arrow is `src/components/decor/OrnateArrow.tsx` (the supplied SVG pointer used as a `currentColor` mask, rotated only, aspect locked) — one faithful artwork, recolourable everywhere.
- The Journal renders `journalSlots` (`JournalSlot` union: `article` | `upcoming`) in a one-at-a-time carousel whose slides share a grid cell, with inactive slides `inert` — stable height, swap placeholder by data only.
- OpenBook closes `open → folding → returning` (cover/opening skip to returning); the return transform is measured from the spine rect at return start — keeps the physical-book metaphor without new deps.
- Motion: shared tokens/keyframes live in the "Milestone 8 — motion system" block of `src/styles.css`; one `StarCursor` (fine pointers only) labels controls via `resolveCursor` in `src/components/cursor/cursorLabel.ts`; section entrances use `[data-reveal]` + `useRevealOnce` (visible by default) — one system, no animation library.
- OpenBook page visibility is driven only by `data-phase` on `.book-scroll` (hidden in cover/returning, fades in/out in opening/folding), never tied to the cover — prevents blank page rectangles.
- Section-to-section motion: `[data-section]` + `useSectionMotion` drive `--enter`/`--leave` (CSS scroll timelines, JS fallback, never both); Projects section is never transformed — keeps spine measurements exact.
