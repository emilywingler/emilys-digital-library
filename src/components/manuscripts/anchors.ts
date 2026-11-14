import { experience } from "@/content/experience";
import { journalSlots } from "@/content/journal";
import { manuscripts } from "@/content/manuscripts";
import { projects, shelfDecor } from "@/content/projects";
import { skillCategories } from "@/content/skills";
import type { ManuscriptSection } from "@/types/content";

/**
 * Hiding-place registry for the Lost Manuscripts.
 *
 * A *host* is a `<ManuscriptZone host=…>` dropped into an existing positioned
 * container (a newspaper column, a folder tab, a skill drawer, a shelf book, a
 * journal slide, a book page…). An *anchor* is `host@position`: one absolute
 * position inside that host. Hosts are generated from content data, so new
 * experiences, skill drawers, projects, decor books or journal slides add
 * hiding places automatically.
 *
 * `fallback` is used only when the anchor is genuinely unusable at render time
 * (it would overlap content, or its host has collapsed to zero size). Anchors
 * without a fallback end every chain; they are hand-verified at every width and trusted.
 */
export interface AnchorDef { id: string; host: string; section: ManuscriptSection; cls: string; fallback?: string | undefined }

/** Absolute positions (marker is 2.75rem; 1.375rem = half of it). Literal strings so Tailwind sees them. */
const POS: Record<string, string> = {
  tl: "left-1 top-1", tr: "right-1 top-1", bl: "left-1 bottom-1", br: "right-1 bottom-1",
  ml: "left-1 top-[calc(50%-1.375rem)]", mr: "right-1 top-[calc(50%-1.375rem)]",
  tc: "left-[calc(50%-1.375rem)] top-1", bc: "left-[calc(50%-1.375rem)] bottom-1",
  c: "left-[calc(50%-1.375rem)] top-[calc(50%-1.375rem)]",
};

const defs: AnchorDef[] = [];
function add(section: ManuscriptSection, host: string, positions: string[], fallback?: string) {
  for (const p of positions) defs.push({ id: `${host}@${p}`, host, section, cls: POS[p]!, fallback });
}
/** Hand-verified original spots (trusted, no fallback). */
function fixed(section: ManuscriptSection, host: string, pos: string, cls: string, fallback?: string) {
  defs.push({ id: `${host}@${pos}`, host, section, cls, fallback });
}

// Home — the newspaper page, the headline block, and the lead column.
fixed("home", "home:page", "bl", "left-10 bottom-0");
fixed("home", "home:page", "br", "right-10 bottom-0");
const HOME_FB = "home:page@br";
add("home", "home:headline", ["bl", "br", "tl", "tr"], HOME_FB);
add("home", "home:column", ["br", "bl"], HOME_FB);

// Experience — the section frame and every experience tab's sheet.
fixed("experience", "experience:section", "tr", "right-3 top-2");
add("experience", "experience:section", ["br"], "experience:section@tr");
for (const e of experience) add("experience", `experience:${e.id}`, ["tr", "mr", "br"], "experience:section@tr");

// Skills — the section, the drawer cabinet and every drawer's card list.
fixed("skills", "skills:section", "tr", "right-3 top-2");
add("skills", "skills:section", ["bl"], "skills:section@tr");
add("skills", "skills:cabinet", ["bl", "br"], "skills:section@tr");
for (const c of skillCategories) add("skills", `skills:${c.id}`, ["tr", "br", "bc"], "skills:section@tr");

// Projects shelf — the section, the cabinet and decorative (never project) books.
fixed("projects", "projects:section", "tr", "right-3 top-2");
add("projects", "projects:cabinet", ["tl", "tr", "bl", "br"], "projects:section@tr");
for (const d of shelfDecor) if (d.kind === "book") add("projects", `projects:decor:${d.id}`, ["c"], "projects:section@tr");

// Inside an opened book — beside the fleuron, the info page and the media page.
for (const p of projects) {
  const fb = `book:${p.id}:fleuron@c`;
  fixed("book", `book:${p.id}:fleuron`, "c", "ms-marker-book");
  add("book", `book:${p.id}:info`, ["tr", "bl", "br"], fb);
  add("book", `book:${p.id}:media`, ["tl", "tr", "bl", "br"], fb);
}

// Journal — the sheet, the masthead and every carousel slide.
fixed("journal", "journal:sheet", "tl", "left-3 top-3");
fixed("journal", "journal:sheet", "tr", "right-3 top-3");
add("journal", "journal:sheet", ["bl", "br"], "journal:sheet@tl");
add("journal", "journal:masthead", ["ml", "mr"], "journal:sheet@tl");
for (const s of journalSlots) add("journal", `journal:slot:${s.id}`, ["tr", "br", "bl"], "journal:sheet@tl");

// Contact — the bookmark, its monogram column and the desk around it.
fixed("contact", "contact:bookmark", "tr", "right-3 top-2", "contact:monogram@tl");
fixed("contact", "contact:bookmark", "br", "right-3 bottom-1");
add("contact", "contact:bookmark", ["bl"], "contact:monogram@tl");
fixed("contact", "contact:monogram", "tl", POS["tl"]!);
add("contact", "contact:monogram", ["tr"], "contact:monogram@tl");
add("contact", "contact:wrap", ["tl", "bl"], "contact:monogram@tl");

export const ANCHORS: Readonly<Record<string, AnchorDef>> = Object.fromEntries(defs.map((d) => [d.id, d]));
export const hostOf = (anchor: string) => anchor.split("@")[0]!;
export const hostsOf = (section: ManuscriptSection) => [...new Set(defs.filter((d) => d.section === section).map((d) => d.host))];

/** Every manuscript with all hiding places of its section. */
export const MANUSCRIPT_ANCHORS: { id: string; anchors: string[] }[] = manuscripts.map((m) => ({
  id: m.id, anchors: defs.filter((d) => d.section === m.section).map((d) => d.id),
}));
export const ANCHORS_BY_ID: Readonly<Record<string, readonly string[]>> = Object.fromEntries(MANUSCRIPT_ANCHORS.map((m) => [m.id, m.anchors]));
