# Milestone 3 — Skills (card catalog) + site-wide scrollbar

## What the references suggest

A wooden card-catalog cabinet: drawers with brass label frames (a number box + a label like "Ehle–Fahm") and a brass pull. One drawer pulled out shows cream index cards standing on edge.

## 1. Skills: the card catalog

**Layout (desktop)**

- A heading in the same style as Experiência ("Catálogo" / "Habilidades").
- Left: a small cabinet with 4–5 drawers stacked. Each drawer front is dark brown with a gold label frame (number + category name) and a gold pull drawn as a small ornament.
- Right: the open drawer's index cards, in a 2-column grid of parchment cards.
- Before anything is chosen, the first drawer is open, so the section never looks empty. (The Experience folder starts closed; tell me if you want the same here.)

**Interaction**

- Clicking a drawer slides it out a few pixels, the gold frame brightens, and its cards fade in. No 3D effects and no new libraries.
- Keyboard: arrow keys move between drawers, Enter/Space opens one. Screen readers announce the drawers as tabs, using the same accessible pattern as the Experience folder.
- With reduced motion turned on, there is no slide and no fade.

**Phone**

- The drawers become a row of label plates above the cards. Up to 5 short labels wrap onto two lines, so nothing scrolls sideways. The cards stack in one column. There are no scroll areas inside the section.

**Each index card**

- A catalog code in the top corner, for example `PRG-01`, `DAT-03`, `ML-07`.
- The skill name in the display font, with a thin red-brown rule like a real index card.
- One line about what it is used for, or a "Ver em: Compass UOL" note when your CV links the skill to an experience. Example: SageMaker → Compass UOL.
- **Level: none shown for now.** Your CV gives no levels, so I won't make any up. The card has an optional level field ("Familiaridade" / "Em desenvolvimento" / "Experiência prática"), so you can fill one in later and it will appear.

**Content (skills copied exactly from your CV, nothing added)**

- **Programação:** Python, SQL, Git e GitHub
- **Ciência de Dados:** Pandas, Análise e Manipulação de Dados, Estatística para Data Science, Engenharia de Atributos, Redução de Dimensionalidade (PCA), Power BI
- **Machine Learning & IA:** Machine Learning, Modelos de Regressão, Classificação, Aprendizado Não Supervisionado, Avaliação e Comparação de Modelos, Deep Learning, Redes Neurais, Visão Computacional, NLP, LLMs e Transformers
- **Ferramentas & Plataformas:** AWS (S3, SageMaker, Bedrock), MLOps e MLflow
- **Desenvolvimento Web:** your CV lists no web skills, so **I'll leave this drawer out** until you tell me what goes in it. It's one entry to add later.
- The short descriptions will be general ("what the tool is used for") and will never claim results. I'll send them to you for review in the summary.

## 2. Scrollbar across the whole site

Scrollable places I found: the main page, and the Experience tab row on phones (it scrolls sideways). The new Skills section adds none.

- **Chrome/Edge/Safari:** a thin parchment track (about 12px) with a soft border. The handle is taupe/bronze with rounded ends and a small gold ✦ star drawn into its centre. On hover it turns darker brown with a gold edge.
- **Firefox:** it only supports colour and width, so it gets a thin taupe-on-parchment scrollbar with no star. This is a browser limitation.
- **Phones:** left to the system (usually hidden), with no fake scrollbars.
- The sideways tab row uses an even thinner version of the same style.
- Scrolling stays native: no scripts.

## 3. Unchanged

Home, Experiência, the header, languages and routes. The only change outside Skills is the scrollbar.

## Technical details

- New: `src/content/skills.ts` (`SkillCategory`, `SkillEntry` with `code`, `name`, `description: LocalizedText`, `seeAlso?: string[]`, `level?: SkillLevel`), `src/components/skills/SkillsCatalog.tsx`, `CatalogDrawer.tsx`, `IndexCard.tsx`, `src/components/decor/` brass pull ornament, `src/test/skills-content.test.ts` (unique codes, pt and en filled in, every `seeAlso` matches an experience id, no level unless set), plus an interaction test (clicking or pressing arrow keys switches the cards).
- The drawers use Radix Tabs (already installed) in vertical orientation on desktop. FolderTabs stays untouched because it has different styling.
- Edits: `types/content.ts`, `i18n/messages.ts`, `styles.css` (catalog tokens, `index-card` utility, global `::-webkit-scrollbar*` rules with an SVG star in the background-image of the thumb, `scrollbar-color`/`scrollbar-width` behind `@supports not selector(::-webkit-scrollbar)`), `PortfolioPage.tsx` (replace the skills placeholder), `docs/ARCHITECTURE.md`, `README.md`, `AGENTS.md`.
- Checks: Playwright pt/en on desktop 1280 and mobile 390, switching drawers by keyboard, reduced-motion emulation, and screenshots of the scrollbar in Chromium. Firefox is checked by reading the CSS only.  
  
The Milestone 3 proposal looks good. I approve the overall visual direction, with a few adjustments before implementation:
  1. **Exactly four drawers:** Use only the four categories already defined in the proposal. Do not create an empty fifth drawer or a placeholder for Web Development.
  2. **Default state:** Keep the first drawer open by default. Unlike Experience, Skills should never initially appear empty.
  3. **Keyboard accessibility:** Use Radix Tabs with `activationMode="manual"`. Arrow keys should move focus between drawers, while Enter/Space activates the focused drawer. Ensure the orientation changes responsively: vertical on desktop and horizontal on mobile, including the corresponding keyboard behavior and accessibility attributes.
  4. **Index cards:** Keep descriptions short, technically accurate, and informative. Do not invent experience, proficiency levels, achievements, or results. Keep the optional `level` field, but leave it unset for every current entry.
  5. **Experience references:** Only populate `seeAlso` when the connection between a skill and an experience is factually supported. Do not automatically associate AWS tools with Compass UOL.
  6. **Responsive layout:** On mobile, show four compact label plates wrapping naturally into two lines when necessary. Cards should stack in one column. No horizontal scrolling or nested scroll areas in Skills.
  7. **Scrollbar:** Keep the requested parchment, bronze, and gold-star aesthetic. Make sure the custom styling does not compromise scrollbar visibility or native scrolling. Scope the rules carefully to intended scrollable elements, including the main page and Experience's horizontal tab row. Preserve native mobile scrollbars.
  8. **Testing:** In addition to the proposed checks, verify tab semantics, selected states, keyboard focus, Portuguese and English descriptions, and the absence of invented proficiency levels. Clearly distinguish actual Firefox testing from CSS-only compatibility inspection.
  Do not modify Home, Experience, the header, language switching, or routes.
  Before finishing, provide a summary of every modified file, architectural decisions, content descriptions for review, and test results. Do not refactor unrelated components.