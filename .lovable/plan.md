# Emily Wingler — Digital Library Portfolio: Architecture Plan (Milestone 0)

Reference: library.jjangik.kr (bookshelf-as-navigation, tactile objects). CV content (Compass UOL, UFES research office, Adapti, skills, links) is taken from the uploaded PDF; nothing else will be invented — gaps use clearly marked placeholders.

## 1. Risks and architectural concerns
- **Animation cost**: 3D book opening, folder tabs and shelf interactions can get heavy. Mitigation: CSS 3D transforms + Framer Motion (one library), `prefers-reduced-motion` fallbacks, no WebGL.
- **Mobile book spread**: a two-page spread does not fit 390px. Mobile shows a single-page "flip" (info page, then demo page) in a bottom sheet instead of shrinking.
- **Decoration vs readability**: dark parchment textures hurt contrast. All text sits on solid tokens checked for WCAG AA; textures are low-opacity overlays.
- **Backend coupling**: components must never import static data directly — only through a repository layer (see 4).
- **Your own Supabase project**: connecting an external Supabase is done by you in Project Settings → External Supabase; workspace permissions must allow it. Nothing is enabled now.
- **Book recommendation**: Open Library API is free/no key, covers allowed with attribution and rate limits; Google Books needs a key. Cover color extraction must run client-side on CORS-enabled images (Open Library supports it). Storing only metadata + hex color (not cover images) avoids copyright/storage issues. Spam needs moderation (admin approve) + rate limiting. Classified **experimental**.
- **Embedded Power BI**: "Publish to web" embeds are public; fine for Olist data, but heavy — lazy-load on open only.
- **Single page vs SEO**: brief asks one page with sections. Plan: one `/` page with anchored sections now; project pages (`/projects/$slug`) added later as real routes for sharing/SEO.

## 2. Frontend architecture
- TanStack Start (React 19, TypeScript, Tailwind v4) — already the project stack.
- Framer Motion for animations; no other UI deps beyond the existing shadcn primitives.
- Fonts: **Cormorant Garamond** (headings, literary), **IM Fell English SC** (sparing ornamental caps/spines), **Source Serif 4** or **Inter Tight**-free alternative **Libre Franklin** (body/UI). To confirm.
- Design tokens in `src/styles.css`: espresso #2C2620, dark-brown #5B4F44, taupe #9A8A7A, parchment #E6D9C7, olive #6A6F63, plus derived gold-leaf accent, ink, and paper-shade tokens; shadows (`--shadow-book`, `--shadow-paper`), textures as CSS vars.
- Theme: dark library (espresso) as base with parchment "paper" surfaces — the newspaper home uses both contrast zones.

## 3. Bilingual system
- Locale lives in the URL search param or prefix? Recommended: `/` (pt-BR default) and `/en` via a route prefix `/$lang` — survives refresh, shareable, SEO-friendly, no page duplication (same components, one route tree).
- UI strings: `src/i18n/messages/{pt,en}.ts`, typed so a missing key is a type error. `useT()` hook.
- Content (projects, experiences): every translatable field is `{ pt: string; en: string }` (`LocalizedText`) — maps 1:1 to future DB columns/JSONB.
- Header language toggle preserves the current section.

## 4. Data-access layer
```text
components  ->  hooks (useProjects...)  ->  repository interface  ->  static adapter (now)
                                                                  ->  supabase adapter (later)
```
- `src/content/` — static typed data (seed of future DB).
- `src/data/repositories/*.ts` — `PortfolioRepository` interface: `getProjects()`, `getExperiences()`, `getSkills()`, `getContactLinks()`, `getShelfLayout()`.
- `src/data/static-repository.ts` implements it; loaded via route loader + TanStack Query. Swapping to Supabase = new adapter, zero UI changes.

## 5. Folder structure
```text
src/
  routes/            __root.tsx, index.tsx (redirect/pt), $lang.index.tsx
  sections/          Home/ About/ Experience/ Skills/ Projects/ Contact/
  components/
    library/         Book, BookSpine, BookCover, OpenBook, Shelf, Bookcase, FolderTabs, CatalogCard, Ribbon
    layout/          SiteHeader, SectionFrame, LanguageToggle, SectionNav
    ui/              shadcn primitives
  decor/             SVG ornaments: Frame, Divider, Plant, Globe, Candle, InkBottle, Damask pattern
  project-showcases/ per-project custom right pages (OlistCaseStudy, RotaLeveDemo, ImageShowcase default)
  content/           projects.ts, experiences.ts, skills.ts, links.ts, profile.ts
  data/              repository interface + static adapter
  i18n/              messages, useT, locale utils
  types/             domain models (Project, Experience, Skill, BookVisual, LocalizedText)
  lib/motion.ts      shared animation variants + reduced-motion helper
docs/                ARCHITECTURE.md, ADDING_A_PROJECT.md, DATA_MODEL.md
```

## 6. Component ideas per section
- **Home** — newspaper front page: masthead "The Wingler Gazette"-style nameplate, date line, headline = name, subtitle column, intro column, links as "classifieds". Light parchment page on espresso table.
- **About** — closed leather book; click/scroll opens to spread: left = journey narrative, right = interests + "currently studying" with marginalia annotations. Mobile: stacked pages.
- **Experience** — manila folder with horizontal tabs (UFES Research Office, Compass UOL, Adapti); accessible `tablist` with arrow keys; content typed like an index card.
- **Skills** — recommended concept: **library card catalog drawer**. Categories = drawers (Languages & Tools, ML/DL, Data & BI, Cloud & MLOps), skills = catalog cards with a Dewey-style call number. Alternative: crossword (fun but poor scannability — suggested as easter egg instead).
- **Projects** — `Bookcase` of `Shelf` rows, from `ShelfLayout` data (book order, orientation `spine|cover`, height, width, color, decor slots). Click → `OpenBook` dialog (focus trap, Esc/outside click closes). Right page renders a `showcase` by type: `image | gif | video | embed | custom` (custom → component registry). Pagination only appears when > N books.
- **Articles** — skipped in v1; future "newsstand" rack.
- **Contact** — horizontal silk ribbon/bookmark with SVG tassel holding GitHub, LinkedIn, Email.

## 7. Future Supabase schema (not implemented)
- `profiles` (single row: name, headline jsonb, bio jsonb)
- `projects` (id, slug, title jsonb, summary jsonb, contribution jsonb, tech text[], links jsonb, showcase_type, showcase_config jsonb, status draft|published, sort_order)
- `book_visuals` (project_id fk, template, color, spine_style, cover_asset_path, height, width, orientation, font)
- `shelves` (id, page, position) + `shelf_items` (shelf_id, project_id|decoration_id, position)
- `decorations` (id, type, svg_key or asset_path)
- `experiences` (org, role jsonb, start/end, bullets jsonb, sort_order, status)
- `skill_categories`, `skills` (category_id, name, level?, call_number, sort_order)
- `contact_links` (kind, url, label jsonb, sort_order)
- `book_recommendations` (title, author, open_library_id, color_hex, visitor_name?, status pending|approved, created_at)
- `user_roles` (user_id, role enum admin) + `has_role()` function.
- RLS: anon SELECT where status = published; admin-only write via `has_role`. Recommendations: anon INSERT only (rate-limited), admin read/approve.
- Storage buckets: `book-covers`, `project-media`, `decor-assets` (public read, admin write).

## 8. Scope tiers
- **v1 (frontend only)**: design system, header + language toggle, Home, About book, Experience folders, Skills catalog, Projects bookshelf (Olist + RotaLeve placeholders), Ribbon contact, custom 404.
- **Backend phase**: your Supabase connection, repository adapter, admin area with auth, media uploads, content editing in both languages.
- **Experimental**: book recommendation shelf, Konami easter egg, custom cursor, mini-game, Medium feed.

## 9. Effort / credit estimate
- High: Projects bookshelf + OpenBook animation + mobile variant; per-project custom showcases; admin CMS.
- Medium: About book, Folder tabs, Skills catalog, bilingual routing, SVG decor set.
- Low: Tokens, header, ribbon, 404, docs.
- Tip: building section-by-section (one milestone per message) keeps credits predictable.

## 10. Milestone roadmap
1. Design tokens, fonts, SVG ornament basics, header, section nav, i18n + `/$lang` routing, types, repository layer, docs skeleton. (No visuals beyond shell.)
2. Home newspaper.
3. Experience folders (real CV data).
4. Skills catalog.
5. Projects bookshelf (static books, layout data).
6. OpenBook interaction + mobile variant + showcase registry.
7. About book.
8. Contact ribbon + 404 + accessibility/perf pass.
9. (Later) Supabase connection, schema, admin.
10. (Later) Experimental features.

Each milestone ships with an explanation of files changed, data flow, and how to extend it, plus small tests for rules (locale fallback, shelf layout pagination).

## Open questions for you
- Default language: Portuguese or English?
- Phone number from CV: show or hide? (Plan: hide.)
- Skills concept: catalog cards OK?
- Do you have project texts/images for Olist and RotaLeve, or placeholders for now?
- Font pairing approval.
