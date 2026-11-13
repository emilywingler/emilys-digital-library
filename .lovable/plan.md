# Milestone 8 — Motion & Interaction Design

Targeted motion layer over existing sections. No layout, content, artwork or dependency changes. Book open/close state machine (`cover → opening → open → folding → returning`) is kept as is.

## 1. Description panel fix (required)
Findings in current CSS:
- `.book-scroll` always carries the book shadow, so during `cover` a shadowed empty rectangle (the full spread box) sits around/left of the cover even though `.book-spread` is at opacity 0.
- During `opening` the spread snaps to opacity 1 while page content is still hidden, so blank left/right pages (plate background) show before the hinge finishes.
- During `folding` page content is hidden immediately, leaving blank pages under the swinging cover; `returning` then fades a blank spread.

Fix, tied only to `data-phase`:
- `cover`: spread and scroll shell (shadow, backgrounds) fully hidden (`visibility: hidden; opacity: 0`); only the cover shows.
- `opening`: spread + content fade in together, timed to the hinge's second half, so the left page appears as the cover swings away from it (no blank pages).
- `open`: unchanged.
- `folding`: content stays visible and fades out with the cover sweeping over it; shell shadow fades with it.
- `returning`: spread already gone; only the cover flies to the spine.
- No geometry, timing constants or return measurement changes. Validated per book, PT/EN, X/Escape/outside click, repeated cycles, desktop/tablet/mobile.

## 2. Motion tokens
In `src/styles.css`: `--motion-fast/base/slow`, `--ease-paper`, `--ease-out-soft`, `--lift-sm`; one `reveal` utility (opacity + 8px rise) and reduced-motion overrides in one block. Existing keyframes reused (`ink-in`, `folder-in`).

## 3. Contextual cursor (one system)
- `src/components/cursor/StarCursor.tsx` mounted once in `PortfolioPage`; enabled only when `(hover: hover) and (pointer: fine)`; native cursor kept (star is an accent beside it, not a replacement, so precision is never lost).
- Position via one rAF-driven transform with light easing; no trail by default (skip the dust trail to stay restrained).
- States from DOM: interactive when target matches `a, button, [role=tab]...`; contextual label from a `data-cursor` key on elements, resolved through new `messages.cursor` PT/EN (Abrir livro, Fechar, Ver imagem, Abrir aba, Abrir gaveta, Explorar, Próximo/Anterior, Ler, E-mail…). Decorative books have no key and are not interactive.
- Hidden on keyboard use (focus styles carry feedback), aria-hidden, pointer-events none, off under reduced motion it stops easing (snaps).

## 4. Section microinteractions (CSS + data attributes)
- Home: headline highlight on hover, drawn underline on links, one-time staggered reveal of masthead/headline/intro/portrait (≤ 500ms total).
- Experience: tab label "Abrir aba"; selected tab lift reused; content switch gets short paper slide (reuse `folder-in`).
- Skills: brass pull nudge/highlight on hover and focus; "Abrir gaveta"; drawer slide-in and staggered card entrance (content interactive immediately).
- Projects: spine hover/focus lean-forward via `translate`/`rotate` on an inner wrapper (the measured button rect is untouched), sibling spines dim slightly via `:has()`; suppressed while `data-lifted` or a book is open. "Abrir livro", "Fechar" on X and overlay, "Ver imagem" on zoom, "Próxima/Anterior" on plate buttons; plate change gets a short page-turn fade only where a gallery already exists (bakery).
- Contact: one brief tassel sway on first entry, golden underline on links, slight bookmark tilt on hover (desktop only).
- Sections: one-shot entrance reveal via a small shared `useRevealOnce` hook (IntersectionObserver, unobserves after first entry; content visible without JS/SSR).

## 5. Accessibility
All new motion disabled or instant under reduced motion; every hover effect mirrored on `:focus-visible`; touch devices keep current behaviour; no info only in cursor labels.

## Files
Edit: `styles.css`, `messages.ts`, `PortfolioPage.tsx`, `HomeFrontPage.tsx`, `FolderTabs.tsx`, `CardCatalog.tsx`, `BookSpine.tsx`, `OpenBook.tsx` (data-cursor only), `BookPageMedia.tsx`, `ContactBookmark.tsx`, `WinglerJournal.tsx` (labels only), `AGENTS.md`, `docs/ARCHITECTURE.md`.
New: `src/components/cursor/StarCursor.tsx`, `src/hooks/useRevealOnce.ts`, tests `src/test/cursor.test.tsx`.

## Verification
Vitest: cursor label resolution PT/EN, disabled without fine pointer, decorative books no label, existing 59 tests. Playwright: PT/EN at 1440/1024/768/390/360, book phase screenshots per phase for all four books with X/Escape/outside click and 3 cycles, overflow check, reduced-motion run. Report automated and manual separately, with unverified items (Safari/Firefox/real touch).
