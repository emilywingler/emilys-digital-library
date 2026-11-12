# Emily Wingler — Digital Library Portfolio (revised plan)

Goal: a finished, striking, responsive bilingual portfolio during SheBuilds. Backend, admin, Supabase and experimental features are postponed until after the program.

## Stack (verified in the project)
Already installed and reused: TanStack Start + React 19 + TypeScript, Tailwind v4, Radix/shadcn primitives (Tabs, Dialog, Drawer, Tooltip), lucide icons, tw-animate-css.
No new libraries in Milestone 1. Animations use CSS transitions/keyframes. A motion library will only be proposed at the bookshelf milestone if CSS proves insufficient.

## Data and language — kept simple
- Content lives in typed static files (`src/content/`), with translatable fields as `{ pt, en }`. Components receive data through props or one small hook per section — no repository/adapter layer yet. Later, swapping a static file for a Supabase query only touches those hooks.
- Interface strings in `src/i18n/` (pt, en), typed so a missing translation is a build error.
- Language kept in the URL (`/` and `/en`) so it survives refresh and sharing; toggle in the header.

## Revised roadmap (one approval per milestone)
1. **Visual identity, header, navigation, Home** (details below)
2. About — open book with your journey
3. Experience — folder with tabs (UFES research office, Compass UOL, Adapti — from your CV)
4. Skills — library catalog cards by category
5. Projects bookshelf — one shelf, books with covers/spines (Olist, RotaLeve, placeholders where info is missing)
6. Opening book interaction + mobile version
7. Contact ribbon, custom 404, accessibility and performance pass

Simpler fallbacks if something gets costly: About as a static open-book spread; book opening as a fade/flip dialog instead of 3D.

After the program: Medium articles, Supabase + admin, book recommendation, easter eggs.

## Milestone 1 — what will be built
- **Design system** in the main stylesheet: your 5 colors as tokens (espresso, dark brown, taupe, parchment, olive) plus a soft gold accent; paper shadows; subtle grain texture; focus ring style; reduced-motion rules.
- **Fonts**: Cormorant Garamond (titles), IM Fell English SC (masthead/ornamental, sparing), Source Serif 4 (body/interface) — loaded once in the page head.
- **SVG ornaments** (small set): divider rule, corner flourish, star/fleuron.
- **Header**: name monogram, section links (Home, About, Experience, Skills, Projects, Contact), PT/EN toggle; collapses into a menu on mobile; keyboard accessible. Links to sections not built yet scroll to labeled placeholder sections.
- **Home (newspaper front page)**: masthead with nameplate and date line, headline "Emily Wingler Gonçalves", subtitle "Computer Engineering Student | Data Science & Machine Learning", short intro column based on your CV summary, links (GitHub, LinkedIn, email) styled as a "classifieds" box, light parchment page over dark espresso background. Phone number not shown.
- **Page titles/descriptions** in both languages.
- **Docs**: README section on structure; short `docs/ARCHITECTURE.md`; TSDoc on components, types and hooks.
- One small test: language detection from URL and fallback to Portuguese.

At the end I will explain files created, components, data flow, decisions and how to extend them.

## Technical details (Milestone 1)
```text
src/
  routes/       __root.tsx (fonts, shell), index.tsx (pt), en.tsx (en)
  components/
    layout/     SiteHeader, LanguageToggle, SectionPlaceholder
    home/       NewspaperMasthead, HomeFrontPage, ClassifiedLinks
    decor/      Divider, Flourish, Fleuron (SVG)
  content/      profile.ts, links.ts  ({ pt, en } fields)
  i18n/         messages.pt.ts, messages.en.ts, useLocale, t()
  types/        LocalizedText, Profile, ContactLink
docs/ARCHITECTURE.md
```

## Questions (answer anytime)
- Default language: Portuguese at `/` OK?
- Do you have texts/images for Olist and RotaLeve? (needed by milestone 5)
