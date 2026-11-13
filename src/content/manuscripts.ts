import type { Manuscript, ManuscriptExtras } from "@/types/content";
import { projects } from "./projects";

const SIGN = { pt: "— Uma anotação da autora", en: "— A note from the author" };

/**
 * The seven Lost Manuscripts, the Home hint and the final letter. All texts are
 * Emily's, copied verbatim. Anchor ids map to safe spots in `placement.ts`;
 * Nº 05 lives inside one project book (`book:<projectId>`).
 */
export const manuscripts: Manuscript[] = [
  {
    id: "small-pause", number: 1, section: "home", variant: "note", anchors: ["home-bl", "home-br"],
    title: { pt: "Uma pequena pausa.", en: "A little pause." },
    paragraphs: [
      { pt: "Às vezes, por trás de cada projeto, existe uma história que não cabe no currículo.", en: "Sometimes, behind every project, there is a story that does not fit into a résumé." },
      { pt: "Obrigada por explorar meu pequeno arquivo com tanta atenção. Espero que encontre algo interessante por aqui.", en: "Thank you for exploring my little archive so carefully. I hope you find something interesting here." },
    ],
    signature: SIGN,
  },
  {
    id: "beginning", number: 2, section: "experience", variant: "quill", anchors: ["experience-tr", "experience-br"],
    title: { pt: "Tudo começa com uma pergunta.", en: "Everything begins with a question." },
    paragraphs: [{ pt: "Nem sempre sabemos exatamente onde uma ideia vai nos levar. Às vezes, basta ter curiosidade suficiente para dar o primeiro passo.", en: "We do not always know where an idea will lead us. Sometimes, curiosity is enough to take the first step." }],
    signature: SIGN,
  },
  {
    id: "craft-of-learning", number: 3, section: "skills", variant: "scroll", anchors: ["skills-tr", "skills-bl"],
    title: { pt: "Aprender também é construir.", en: "Learning is also a form of building." },
    paragraphs: [{ pt: "Cada ferramenta nova, cada erro e cada tentativa acrescentam uma pequena peça ao conhecimento que estamos construindo.", en: "Every new tool, every mistake, and every attempt adds another small piece to the knowledge we are building." }],
    signature: SIGN,
  },
  {
    id: "between-pages", number: 4, section: "projects", variant: "book", anchors: ["projects-tr", "projects-bl"],
    title: { pt: "Nem toda descoberta está no resultado.", en: "Not every discovery is found in the result." },
    paragraphs: [{ pt: "Às vezes, a parte mais interessante de um projeto está nas decisões, nos caminhos descartados e nas perguntas que surgiram durante o processo.", en: "Sometimes, the most interesting part of a project lies in its decisions, abandoned paths, and the questions that emerged along the way." }],
    signature: SIGN,
  },
  {
    id: "unfinished-work", number: 5, section: "book", variant: "star", anchors: projects.map((p) => `book:${p.id}`),
    title: { pt: "Nem tudo precisa estar terminado.", en: "Not everything needs to be finished." },
    paragraphs: [{ pt: "A tecnologia está sempre mudando, e aprender significa aceitar que sempre haverá algo novo para investigar, testar e compreender.", en: "Technology is always changing, and learning means accepting that there will always be something new to investigate, test, and understand." }],
    signature: SIGN,
  },
  {
    id: "curious-mind", number: 6, section: "journal", variant: "annotation", anchors: ["journal-tl", "journal-tr"],
    title: { pt: "Curiosidade é uma forma de explorar.", en: "Curiosity is a way of exploring." },
    paragraphs: [{ pt: "Algumas das melhores ideias aparecem quando olhamos para algo conhecido de uma maneira diferente.", en: "Some of the best ideas emerge when we look at something familiar from a different perspective." }],
    signature: SIGN,
  },
  {
    id: "journey", number: 7, section: "contact", variant: "seal", anchors: ["contact-tr", "contact-br"],
    title: { pt: "Uma história ainda em construção.", en: "A story still being written." },
    paragraphs: [{ pt: "Este arquivo reúne apenas alguns fragmentos de uma trajetória que continua sendo escrita. Obrigada por dedicar um pouco do seu tempo a conhecê-la.", en: "This archive contains only a few fragments of a journey that is still unfolding. Thank you for taking the time to explore it." }],
    signature: SIGN,
  },
];

export const manuscriptExtras: ManuscriptExtras = {
  hint: {
    title: { pt: "Uma nota para leitores curiosos", en: "A note for curious readers" },
    body: { pt: "Existem sete pequenos manuscritos escondidos neste arquivo. Algumas histórias só são encontradas por quem observa com atenção.", en: "There are seven little manuscripts hidden throughout this archive. Some stories are only found by those who look closely." },
  },
  letter: {
    title: { pt: "Para quem chegou até aqui.", en: "To the one who made it this far." },
    paragraphs: [
      { pt: "Você encontrou todos os sete manuscritos.", en: "You have found all seven manuscripts." },
      { pt: "Talvez a melhor parte de uma biblioteca não seja apenas o que está escrito em seus livros, mas tudo aquilo que descobrimos enquanto procuramos.", en: "Perhaps the best part of a library is not only what is written in its books, but everything we discover while searching through them." },
      { pt: "Obrigada por explorar este pequeno universo com tanta curiosidade.", en: "Thank you for exploring this little universe with such curiosity." },
    ],
    closing: { pt: "Com carinho,", en: "With gratitude," },
    signature: "Emily",
  },
};
