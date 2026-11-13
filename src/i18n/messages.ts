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
    home: "Início", experience: "Experiência",
    skills: "Habilidades", projects: "Projetos", journal: "Diário", contact: "Contato",
    openMenu: "Abrir menu", closeMenu: "Fechar menu",
  },
  language: { label: "Idioma", switchTo: "Ver em inglês" },
  home: {
    gazette: "Arquivo Pessoal",
    edition: "Edição Nº 1",
    est: "UFES · São Mateus, Espírito Santo",
    lead: "Notas de uma engenheira em formação",
    profileHeading: "Perfil",
    portraitLabel: "Retrato de arquivo",
    explore: "Explorar a biblioteca",
    connectLinkedIn: "Conectar no LinkedIn",
    exploreProjects: "Explorar meus projetos",
  },
  journal: { kicker: "Periódico", lead: "Ensaios e relatos do arquivo", inProgress: "Em desenvolvimento", read: "Ler no Medium", newTab: "(abre em nova aba)", unavailable: "Ainda não publicado", language: "Idioma", minutes: "{n} min de leitura", published: "Publicado em", carousel: "Artigos do diário", prevArticle: "Artigo anterior", nextArticle: "Próximo artigo", upcoming: "Novos ensaios em breve", upcomingNote: "Mais relatos serão arquivados aqui." },
  contact: { title: "Vamos manter contato.", lead: "Para conversas, oportunidades ou indicações de leitura.", linksLabel: "Formas de contato", newTab: "(abre em nova aba)" },
  experience: { title: "Experiência", kicker: "Arquivo", hint: "Selecione uma pasta", education: "Formação acadêmica", tabsLabel: "Pastas de experiência" },
  skills: { title: "Habilidades", kicker: "Catálogo", drawersLabel: "Gavetas do catálogo de habilidades", seeAlso: "Ver em", levels: { familiarity: "Familiaridade", developing: "Em desenvolvimento", practical: "Experiência prática" } },
  cursor: { openBook: "Abrir livro", close: "Fechar", viewImage: "Ver imagem", openTab: "Abrir aba", openDrawer: "Abrir gaveta", explore: "Explorar", newTab: "Abrir em nova aba", email: "Escrever e-mail" },
  projects: { title: "A Biblioteca de Projetos", kicker: "Estante", hint: "Escolha um livro para abri-lo.", open: "Abrir livro", close: "Fechar livro", tech: "Tecnologias", role: "Minha contribuição", rolePending: "A confirmar — descrição da minha contribuição", repo: "Ver no GitHub", newTab: "(abre em nova aba)", plateLabel: "Ilustração do projeto", plateEmpty: "Ilustrações em preparação", prev: "Ilustração anterior", next: "Próxima ilustração", position: "{n} de {total}", enlarge: "Ampliar imagem", closeEnlarged: "Fechar imagem ampliada", video: "Vídeo" },
};

export type Messages = typeof pt;

const en: Messages = {
  meta: {
    title: "Emily Wingler Gonçalves — Portfolio",
    description: "Portfolio of Emily Wingler Gonçalves: Computer Engineering, Data Science and Machine Learning.",
  },
  nav: {
    label: "Main navigation",
    home: "Home", experience: "Experience",
    skills: "Skills", projects: "Projects", journal: "Journal", contact: "Contact",
    openMenu: "Open menu", closeMenu: "Close menu",
  },
  language: { label: "Language", switchTo: "View in Portuguese" },
  home: {
    gazette: "Personal Archive",
    edition: "Edition No. 1",
    est: "UFES · São Mateus, Espírito Santo",
    lead: "Notes from an engineer in the making",
    profileHeading: "Profile",
    portraitLabel: "Archival portrait",
    explore: "Explore the library",
    connectLinkedIn: "Connect on LinkedIn",
    exploreProjects: "Explore my projects",
  },
  journal: { kicker: "Periodical", lead: "Essays and accounts from the archive", inProgress: "In progress", read: "Read on Medium", newTab: "(opens in a new tab)", unavailable: "Not published yet", language: "Language", minutes: "{n} min read", published: "Published on", carousel: "Journal articles", prevArticle: "Previous article", nextArticle: "Next article", upcoming: "More essays forthcoming", upcomingNote: "More accounts will be archived here." },
  contact: { title: "Let's keep in touch.", lead: "For conversations, opportunities or reading suggestions.", linksLabel: "Ways to reach me", newTab: "(opens in a new tab)" },
  experience: { title: "Experience", kicker: "Archive", hint: "Select a folder", education: "Academic education", tabsLabel: "Experience folders" },
  skills: { title: "Skills", kicker: "Catalog", drawersLabel: "Skills catalog drawers", seeAlso: "See", levels: { familiarity: "Familiarity", developing: "Developing", practical: "Practical experience" } },
  cursor: { openBook: "Open book", close: "Close", viewImage: "View image", openTab: "Open tab", openDrawer: "Open drawer", explore: "Explore", newTab: "Open in new tab", email: "Write an email" },
  projects: { title: "The Project Library", kicker: "Shelf", hint: "Pick a book to open it.", open: "Open book", close: "Close book", tech: "Technologies", role: "My contribution", rolePending: "To be confirmed — description of my contribution", repo: "View on GitHub", newTab: "(opens in a new tab)", plateLabel: "Project illustration", plateEmpty: "Plates in preparation", prev: "Previous plate", next: "Next plate", position: "{n} of {total}", enlarge: "Enlarge image", closeEnlarged: "Close enlarged image", video: "Video" },
};

export const messages: Record<"pt" | "en", Messages> = { pt, en };
