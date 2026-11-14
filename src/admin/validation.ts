/** Admin validation rules. Each returns a map of field → message (empty = valid). */
import type { LocalizedText } from "@/types/content";
import type { AdminJournalArticle, AdminProject, SkillDrawer } from "./types";

export type Errors = Record<string, string>;
export const MAX_PROJECT_IMAGES = 3;
export const MAX_PROJECT_LINKS = 2;

export const REQUIRED = "Campo obrigatório.";
export const isBlank = (v?: string) => !v || !v.trim();

export function isHttpsUrl(url?: string) {
  if (!url) return false;
  try { return new URL(url).protocol === "https:"; } catch { return false; }
}
/** Links may be https, mailto or an in-page anchor (#section). */
export function isValidLink(url?: string) {
  if (!url) return false;
  if (/^#[\w-]+$/.test(url)) return true;
  if (/^mailto:[^@\s]+@[^@\s]+\.[^@\s]+$/.test(url)) return true;
  return isHttpsUrl(url);
}

export function requireText(errors: Errors, key: string, value: LocalizedText) {
  if (isBlank(value.pt)) errors[`${key}.pt`] = REQUIRED;
  if (isBlank(value.en)) errors[`${key}.en`] = REQUIRED;
}
export function requireField(errors: Errors, key: string, value: string) {
  if (isBlank(value)) errors[key] = REQUIRED;
}

export function validateProject(p: AdminProject): Errors {
  const e: Errors = {};
  requireText(e, "title", p.title);
  requireText(e, "description", p.description);
  requireField(e, "cover.pt", p.cover.pt);
  requireField(e, "cover.en", p.cover.en);
  requireField(e, "spine", p.spine);
  if (![1, 2, 3].includes(p.shelf)) e["shelf"] = "Escolha uma estante existente.";
  if (p.images.length > MAX_PROJECT_IMAGES) e["images"] = `Máximo de ${MAX_PROJECT_IMAGES} imagens.`;
  if (p.links.length > MAX_PROJECT_LINKS) e["links"] = `Máximo de ${MAX_PROJECT_LINKS} links.`;
  p.technologies.forEach((t, i) => requireText(e, `technologies.${i}`, t.name));
  p.images.forEach((m, i) => requireField(e, `images.${i}.src`, m.src));
  p.links.forEach((l, i) => {
    requireField(e, `links.${i}.label`, l.label);
    if (!isHttpsUrl(l.url)) e[`links.${i}.url`] = "Use um endereço https:// válido.";
  });
  return e;
}

export function validateJournal(a: AdminJournalArticle): Errors {
  const e: Errors = {};
  const own = a.lang === "pt-BR" ? "pt" : "en";
  if (isBlank(a.title[own])) e[`title.${own}`] = "Obrigatório no idioma do artigo.";
  if (isBlank(a.description[own])) e[`description.${own}`] = "Obrigatório no idioma do artigo.";
  requireField(e, "coverSrc", a.coverSrc);
  if (a.status === "published" && !isHttpsUrl(a.url)) e["url"] = "Artigos publicados precisam de um link https://.";
  else if (a.url && !isHttpsUrl(a.url)) e["url"] = "Use um endereço https:// válido.";
  return e;
}

/** A published drawer must hold at least one card. */
export function validateDrawer(d: SkillDrawer, cardCount: number): Errors {
  const e: Errors = {};
  requireText(e, "name", d.name);
  if (!/^[A-Z]{2,4}$/.test(d.code)) e["code"] = "Use 2 a 4 letras maiúsculas.";
  if (d.status === "published" && cardCount < 1) e["status"] = "Uma gaveta publicada precisa de pelo menos um cartão.";
  return e;
}

/** Card number derived from its position inside the drawer (1-based). */
export const cardNumber = (code: string, index: number) => `${code}-${String(index + 1).padStart(2, "0")}`;
