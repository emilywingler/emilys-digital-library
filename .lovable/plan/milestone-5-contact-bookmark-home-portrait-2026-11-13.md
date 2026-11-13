# Milestone 5 — Contact Bookmark & Home Portrait

## 1. Home — portrait replaces the contact box

- Upload your photo (unchanged) to the asset CDN; keep it as its own pointer file, separate from text.
- In the newspaper, the right column (where "Classificados" sits today) becomes an **archival photograph**: thin double rule frame (same style as the current box), portrait crop around face and shoulders (4:5, no distortion, object-position keeps your face centered), soft sepia/grain via CSS only (light filter + existing paper grain overlay), and a small italic caption below, e.g. "Emily Wingler Gonçalves · São Mateus, ES" (uses facts already on the page).
- The intro column and headline stay as they are; column widths tuned slightly so text and photo balance.
- The "Explorar a biblioteca" link at the bottom stays. The full contact block is removed from the Home. No extra Home contact CTA.
- Mobile: photo moves under the headline, before the intro, at a moderate width, centered.
- Alt text in both languages ("Retrato de Emily Wingler Gonçalves" / "Portrait of Emily Wingler Gonçalves").

## 2. Contact — the bookmark (final section)

Following your reference: a tall, narrow cream bookmark with rounded top, a braided cord and tassel at the top, a small ornament, a large monogram and a botanical sprig, ending in a name.

- Drawn in code/SVG with the site palette: parchment body with paper texture, thin gold inner border, cord + tassel in taupe/gold (SVG), small tree ornament replaced by the existing twin-stars mark (avoids inventing a new symbol — tell me if you'd prefer a tree), a large "E" monogram in Cormorant, a small laurel sprig SVG.
- On desktop the bookmark lies **horizontally** across the end of the page (tassel on the left), like a ribbon closing the archive — matches the original brief ("horizontal bookmark or ribbon"). On mobile it stands **vertically** like the photo reference.
- Content: CTA heading ("Vamos manter contato." / "Let's keep in touch."), short line, then Email, LinkedIn, GitHub as large tappable links, read from the existing contact data (no URLs changed). External links open in a new tab with an announced label.
- Below it, a single quiet line inside the same composition: "© 2026 Emily Wingler Gonçalves" — no separate footer.
- No photo in the bookmark. Optional tiny hover lift on links; disabled with reduced motion.

## 3. Chatbot

The project has no chatbot today, so nothing to move or preserve.

## 4. Language

All new text added to the PT/EN message files; the photo and links are the same in both languages.

## 5. Verification

Screenshots at 1440, 1024, 768, 390, 360 in PT and EN; check no horizontal overflow, header "Contato" link scrolls to the bookmark, other sections unchanged; update tests (contact links rendered only once, in the bookmark) and docs.

## Technical details

- New: `src/assets/profile/portrait.jpg.asset.json`, `src/components/home/NewspaperPortrait.tsx`, `src/components/contact/ContactBookmark.tsx`, `src/components/decor/Tassel.tsx` + `Sprig` in Ornaments.
- `Profile` type gains `portrait: { src: string; alt: LocalizedText }` (Supabase-ready); `profile.ts` imports the pointer.
- `PortfolioPage`: replace `SectionPlaceholder id="contact"` with `ContactBookmark links={contactLinks}`; `HomeFrontPage` drops `links` prop. Delete `ClassifiedLinks.tsx` and `SectionPlaceholder.tsx` if unused, plus `home.links*` / `placeholder` messages.
- New `contact` message block; styles in `src/styles.css` using existing tokens.
- Update `docs/ARCHITECTURE.md`, README, AGENTS.md.

## Your review

- Caption wording and the "E" monogram / twin-stars choice are my suggestions.  
  
The plan looks good overall, with two important corrections:
  1. **Chatbot:** There is no chatbot in this project. Please remove all chatbot-related inspection, preservation, or implementation tasks from the plan.
  2. **Bookmark design:** The contact section should resemble a real physical bookmark, following the reference image I provide. However, I do not want an excessively tall, narrow bookmark that dominates the page or disrupts the overall design.
    - On desktop, a horizontal composition is welcome if it integrates better with the page layout.
    - On mobile, the bookmark can use a vertical composition if that provides a better fit.
    - In both cases, preserve recognizable physical bookmark details, such as the parchment-like body, delicate border, braided cord, tassel, and decorative elements.
    - Keep the proportions balanced and the overall composition compact enough to feel like a natural ending to the portfolio, not a massive standalone element.
    Arrange the CTA, email, LinkedIn, and GitHub links carefully within the composition. Avoid overcrowding and preserve the visual identity of the reference.
  Everything else in the plan remains approved, including the Home portrait replacing the current contact area, PT/EN localization, centralized contact data, responsive verification, and documentation updates.
  Please preserve all unrelated sections and existing functionality.