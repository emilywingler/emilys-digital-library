# Milestone 1 fixes + Milestone 2: About as an open book

## Part A — Two small Milestone 1 fixes (done first)
1. **Page language**: the page reports `pt-BR` at `/` and `en` at `/en`, so browsers and screen readers read each version in the right language.
2. **Masthead**: remove "Fundado em 2022 · UFES" / "Founded 2022 · UFES". The middle of the top line now reads **"UFES · São Mateus, Espírito Santo"** (same in both languages).

## Part B — About section (open book)

### What the visitor sees
**Desktop/tablet (wide screens):** one old book lying open on the dark espresso background. It has parchment pages, a darker spine shadow in the middle, an engraved frame with the existing corner flourishes, and page numbers at the bottom.
- **Left page, "Trajetória" / "Path":** a short timeline in book typography, using only facts from your CV:
  - UFES: Computer Engineering undergraduate, 2022 – 12/2027 (expected)
  - Adapti Soluções Web: Marketing Manager, May 2023 – Apr 2024
  - Compass UOL: Machine Learning & Data Science Intern, Nov 2024 – Mar 2025
  - UFES São Mateus, Research and Graduate Studies Office: Assistant, Jun 2025 – Jun 2026
  - Each entry gets one line summarising the CV bullets. The full detail stays for the future Experience section.
- **Right page, "Interesses" / "Interests":**
  - Areas of interest (from your CV summary): software development, data engineering, artificial intelligence, information security.
  - Areas of study (from your CV skills, short list): Machine Learning, Deep Learning, NLP, LLMs & Transformers, Computer Vision, data analysis.
  - Languages: Fluent English.
  - **Professional goals: PLACEHOLDER.** Your CV only says "continuous learning, practical application of technology and building solutions". I will quote that as is and mark the block as a draft for you to replace.
- **Margin notes:** 2–3 short notes in an italic, handwritten-style serif (the existing Cormorant italic, slightly rotated, in the faded ink colour). They sit in the outer margins next to the related lines. They are marked as **placeholders**, because I won't write personal remarks for you. Suggested slots: one next to the UFES entry, one next to the interests, one next to the goals. You send the wording and I put it in.

**Phone:** no shrunk book. Each page becomes its own full-width parchment "leaf", stacked: Path, then Interests. Each leaf keeps its running head, page number and frame. Margin notes move inline as small indented italic notes below the line they belong to, so they stay readable. A thin spine edge at the top of each leaf keeps the "book" feel.

### Interaction (kept simple)
- No page-turning animation and no new libraries.
- Just a gentle fade-in when the section scrolls into view, which is off for people who have reduced motion turned on in their device settings.
- The header link "Sobre / About" scrolls to the section, as it does today.
- Placeholders show a small "rascunho · para revisão" / "draft · for review" tag. It only appears while the text is missing.

### Bilingual
All text lives in one content file with `pt` and `en` side by side. You can change a date, a line or a note there without touching the book layout.

## Technical details
**Create**
- `src/content/about.ts`: typed `{ pt, en }` data for timeline entries, interest groups, goals and margin notes. Each item has an optional `placeholder: true` flag.
- `src/components/about/AboutBook.tsx`: the section shell. It shows two pages side by side from `md` up and stacked leaves below. Pure CSS grid, with the same markup for both layouts so there's no duplicated content.
- `src/components/about/BookPage.tsx`: a reusable page with frame, running head, folio and children. It can be reused later (for example in Projects).
- `src/components/about/MarginNote.tsx`: absolutely positioned in the outer margin on `md+`, inline below `md`.
- `src/test/about-content.test.ts`: checks that every About item has both pt and en text, and that the timeline dates match the CV.

**Modify**
- `src/routes/__root.tsx`: set `<html lang>` from the current path (`/en*` gives `en`, otherwise `pt-BR`) through the router location in the shell.
- `src/i18n/messages.ts`: replace `home.est`, and add About labels (page titles, "draft" tag).
- `src/types/content.ts`: add the `AboutContent`, `TimelineEntry` and `MarginNote` types.
- `src/styles.css`: add a few semantic utilities (`.book-spread`, `.book-spine`, `.ink-note`), reusing the existing parchment/ink/rule tokens.
- `src/components/layout/PortfolioPage.tsx`: replace the About placeholder with `<AboutBook content={about} />`.

Reused: Fleuron, Divider and Flourish ornaments, the existing fonts and colour tokens. No new dependencies.

**Effort:** moderate. Most of the work is the responsive book layout. The content is small.
