import type { AboutContent } from "@/types/content";

/**
 * About section ("open book"). Every fact comes from Emily's CV; anything not
 * stated there is flagged `placeholder: true` and shows a "draft" tag.
 * Edit text here — the book layout never needs to change.
 */
export const about: AboutContent = {
  timeline: [
    {
      id: "ufes",
      period: { pt: "2022 – previsão 12/2027", en: "2022 – expected 12/2027" },
      role: { pt: "Graduanda em Engenharia de Computação", en: "Computer Engineering undergraduate" },
      place: "Universidade Federal do Espírito Santo (UFES)",
      summary: { pt: "Graduação em andamento, com conclusão prevista para dezembro de 2027.", en: "Degree in progress, expected to finish in December 2027." },
      note: { text: { pt: "Anotação à margem — texto a definir", en: "Margin note — wording to be defined" }, placeholder: true },
    },
    {
      id: "adapti",
      period: { pt: "Mai 2023 – Abr 2024", en: "May 2023 – Apr 2024" },
      role: { pt: "Gerente de Marketing", en: "Marketing Manager" },
      place: "Adapti Soluções Web",
      summary: { pt: "Estratégias de marketing, CRM e funil de vendas, e levantamento de requisitos para projetos web.", en: "Marketing strategy, CRM and sales funnel, and requirements gathering for web projects." },
    },
    {
      id: "compass",
      period: { pt: "Nov 2024 – Mar 2025", en: "Nov 2024 – Mar 2025" },
      role: { pt: "Estágio em Machine Learning e Data Science", en: "Machine Learning & Data Science Intern" },
      place: "Compass UOL",
      summary: { pt: "Estudos e soluções em Data Science e Machine Learning com Python, Amazon SageMaker, IA Generativa e LLMs.", en: "Data Science and Machine Learning work in Python, Amazon SageMaker, Generative AI and LLMs." },
    },
    {
      id: "ufes-prppg",
      period: { pt: "Jun 2025 – Jun 2026", en: "Jun 2025 – Jun 2026" },
      role: { pt: "Assistente na Assessoria de Pesquisa e Pós-Graduação", en: "Assistant, Research and Graduate Studies Office" },
      place: "UFES São Mateus",
      summary: { pt: "Análise de dados institucionais e participação no Boletim Informativo da Pesquisa e Pós-Graduação 2026.", en: "Institutional data analysis and contribution to the 2026 Research and Graduate Studies Bulletin." },
    },
  ],
  interestAreas: {
    items: [
      { pt: "Desenvolvimento de software", en: "Software development" },
      { pt: "Engenharia de dados", en: "Data engineering" },
      { pt: "Inteligência artificial", en: "Artificial intelligence" },
      { pt: "Segurança da informação", en: "Information security" },
    ],
  },
  studyAreas: {
    items: [
      { pt: "Machine Learning", en: "Machine Learning" },
      { pt: "Deep Learning", en: "Deep Learning" },
      { pt: "Processamento de Linguagem Natural (NLP)", en: "Natural Language Processing (NLP)" },
      { pt: "LLMs e Transformers", en: "LLMs and Transformers" },
      { pt: "Visão Computacional", en: "Computer Vision" },
      { pt: "Análise de dados", en: "Data analysis" },
    ],
  },
  // CV states "Inglês fluente" verbatim.
  languages: { items: [{ pt: "Inglês fluente", en: "English — fluent" }] },
  goals: {
    items: [{ pt: "Objetivos profissionais a definir por Emily.", en: "Professional goals to be written by Emily." }],
    placeholder: true,
    note: { text: { pt: "Anotação à margem — texto a definir", en: "Margin note — wording to be defined" }, placeholder: true },
  },
};
