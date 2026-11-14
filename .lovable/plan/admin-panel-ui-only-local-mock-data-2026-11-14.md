# Admin Panel (UI only, local mock data)

A separate management area at `/admin/*` with a plain, Bootstrap-like look. All data starts as a copy of the existing site content and lives only in the browser tab's memory — changes are lost on reload and never reach the public site. No login, database, storage or Cloud.

## Routes

`/admin/login`, `/admin` (dashboard), `/admin/home`, `/admin/experiences`, `/admin/skills`, `/admin/projects`, `/admin/journal`, `/admin/footer`, `/admin/manuscripts`. Public `/` and `/en` untouched; no public link to Admin. Admin pages get `noindex` head metadata.

## Look

Own scoped theme (`.admin-theme` tokens in `src/styles.css`: neutral grey background, white cards, blue primary, system sans font). Collapsible shadcn sidebar (icon strip when collapsed, sheet on mobile) with Dashboard, Home, Experiências, Habilidades, Projetos, Journal, Footer, Manuscritos and a "Sair" action that returns to `/admin/login`. Admin UI in Portuguese.

## Login (visual only)

Email + password fields, button with loading, error (empty/invalid email) and success states. A visible notice and code comment state it is a demo with no authentication; the password is never stored. "Success" just navigates to `/admin`.

## Dashboard

Counts derived from the store: projects (published/draft), experiences, tabs, skill drawers, cards, journal articles (published/draft), active footer links, manuscripts. Shortcut cards to each module.

## Modules (all: list, create, edit, delete with confirm, toasts, required-field validation, empty states)

- **Home**: description PT/EN, portrait path + preview, CTA list (text PT/EN, destination). Seeded from `profile` and current CTA labels/links.
- **Experiências**: tabs (name PT/EN, order) and experiences (tab, period, role, organization, description PT/EN, order). Deleting a tab asks whether to move its experiences to another tab or delete them. Up/down reordering. Seed: each current entry becomes one tab + one experience; bullets joined as the description.
- **Habilidades**: drawers (name PT/EN, code, order) and cards (drawer, auto number like `PRG-01` from position, title, short description PT/EN, order). Warning badge + block on "publicado" for drawers with no cards. Seeded from `skillCategories`.
- **Projetos**: list with shelf/position/status; editor split into tabs: Organização (existing shelves 1–3 only, position, status), Identidade (cover PT/EN, spine path + previews, spine text PT/EN), Conteúdo (title, subtitle=intro, description, complementary=context, My Contributions, all PT/EN), Tecnologias (tag list PT/EN, add/edit/remove/reorder; same name allowed), Imagens (max 3, caption PT/EN, preview, reorder), Links (max 2, label + URL; seeded from repo URL and existing extra link, capped at 2), Pré-visualização (read-only summary before saving). Seeded from the four real books, all "publicado".
- **Journal**: title/description PT/EN, cover path + preview, language, status, external URL (https validated). List shows Publicado/Rascunho badges. SheBuilds seeded with its text in the PT fields, EN left empty, status "rascunho" (in-progress).
- **Footer**: title/description PT/EN and link list (platform, URL, icon id from a fixed list, order, active switch). Seeded with GitHub, LinkedIn, Email; new platforms addable. No phone.
- **Manuscritos**: seven manuscripts + final letter, title and text PT/EN only (edit, no create/delete, since game logic is fixed). Dedication stays in code.

## Technical details

- `src/admin/types.ts`: admin models built from existing types in `src/types/content.ts` (`LocalizedText`, `JournalStatus`, etc.) plus `PublishStatus`.
- `src/admin/data/seed.ts`: maps existing `src/content/*` and messages into admin models (no copied text).
- `src/admin/data/repository.ts`: `AdminRepository` interface (list/get/save/remove/reorder per collection, async) with an in-memory implementation; React hooks via `useSyncExternalStore` + simulated latency for loading states. Swapping to a database later means one new implementation.
- Shared components in `src/admin/components/`: `AdminShell`, `PageHeader`, `DataTable`, `LocalizedField` (PT/EN pair), `ImagePathField` (path + preview), `ReorderButtons`, `ConfirmDelete` (AlertDialog), `StatusBadge`, `EmptyState`, `RecordDialog`/form section; toasts via existing sonner (Toaster mounted only in admin layout).
- Routes: `src/routes/admin.tsx` (layout with Outlet; login renders without sidebar), `admin.index.tsx`, `admin.login.tsx`, `admin.home.tsx`, etc. No new dependencies.
- Validation rules (image ≤3, link ≤2, published drawer needs a card, https URL, required fields) in `src/admin/validation.ts` with unit tests; plus a test that seed counts match the content files. Run full test suite, then Playwright check of each admin route (desktop + 390px) and that `/` and `/en` still render.
- Record the admin data-layer rule in `AGENTS.md` and a short section in `docs/ARCHITECTURE.md`.

## Limitations to report after

No real auth/route protection, no persistence, no uploads (paths only), public site does not read admin data.  
  
Additional Implementation Requirements

### 1. Administrative status vs. public publication

The `published` and `draft` statuses are strictly administrative labels in this UI-only phase.

- Changing a record's status must only affect the local Admin interface.
- Do not imply that content has been published to the public portfolio.
- The public website must remain completely independent of the Admin mock data.
- Clearly distinguish administrative status from actual public deployment.

### 2. In-memory repository reliability

Ensure the in-memory repository implementation is reliable and compatible with React's external store subscription model.

- Expose stable snapshots through `useSyncExternalStore`.
- Notify subscribers after every successful create, update, delete or reorder operation.
- Handle asynchronous operations without stale UI state or race conditions.
- Ensure loading and error states behave consistently.
- Do not introduce unnecessary state-management dependencies.

### 3. Preserve the existing public bookshelf design

The Projects Admin module must manage project data without changing the existing visual composition of the public Project Library.

- Preserve all existing shelf decorations, book-opening animations, closing animations, positioning and responsive behavior.
- Keep the three existing shelves as the only available shelf options.
- Allow administrators to manage book order and content, but do not introduce dynamic shelf creation or redesign the shelf layout.
- New project records must follow the existing book data structure and visual constraints.
- Do not modify public components to accommodate the Admin interface in this phase.

### 4. Testing and dependency constraints

- Reuse the existing testing infrastructure and installed dependencies.
- Do not install Playwright, testing libraries or other dependencies if they are not already available.
- Run the existing test suite after implementation.
- Verify all administrative routes and their main interactions when the available testing tools permit.
- Check that the public `/` and `/en` routes still render correctly.
- If browser testing cannot be executed, explicitly report what could not be verified.
- Never claim that tests passed unless they were actually executed.