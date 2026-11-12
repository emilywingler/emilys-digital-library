/**
 * Interface strings. `en` is typed as `Messages` (the shape of `pt`), so a
 * missing or extra key is a TypeScript error — translations can't drift.
 */
const pt = {
  meta: {
    title: "Emily Wingler Gonçalves — Portfólio",
    description: "Portfólio de Emily Wingler Gonçalves: Engenharia de Computação, Data Science e Machine Learning.",
  },
  nav: {
    label: "Navegação principal",
    home: "Início", about: "Sobre", experience: "Experiência",
    skills: "Habilidades", projects: "Projetos", contact: "Contato",
    openMenu: "Abrir menu", closeMenu: "Fechar menu",
  },
  language: { label: "Idioma", switchTo: "Ver em inglês" },
  home: {
    gazette: "Arquivo Pessoal",
    edition: "Edição Nº 1",
    est: "Fundado em 2022 · UFES",
    lead: "Notas de uma engenheira em formação",
    profileHeading: "Perfil",
    linksHeading: "Classificados",
    linksNote: "Correspondência e arquivos públicos",
    explore: "Explorar a biblioteca",
  },
  placeholder: { soon: "Capítulo em preparação" },
};

export type Messages = typeof pt;

const en: Messages = {
  meta: {
    title: "Emily Wingler Gonçalves — Portfolio",
    description: "Portfolio of Emily Wingler Gonçalves: Computer Engineering, Data Science and Machine Learning.",
  },
  nav: {
    label: "Main navigation",
    home: "Home", about: "About", experience: "Experience",
    skills: "Skills", projects: "Projects", contact: "Contact",
    openMenu: "Open menu", closeMenu: "Close menu",
  },
  language: { label: "Language", switchTo: "View in Portuguese" },
  home: {
    gazette: "Personal Archive",
    edition: "Edition No. 1",
    est: "Established 2022 · UFES",
    lead: "Notes from an engineer in the making",
    profileHeading: "Profile",
    linksHeading: "Classifieds",
    linksNote: "Correspondence and public records",
    explore: "Explore the library",
  },
  placeholder: { soon: "Chapter in preparation" },
};

export const messages: Record<"pt" | "en", Messages> = { pt, en };
