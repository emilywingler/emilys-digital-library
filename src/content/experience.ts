import type { ExperienceEntry } from "@/types/content";

/**
 * Experience folder, in tab order. Portuguese bullets are copied verbatim from
 * Emily's CV; English is a direct translation. Do not add items not in the CV.
 */
export const experience: ExperienceEntry[] = [
  {
    id: "ufes-prppg", kind: "work",
    tab: { pt: "UFES · PRPPG", en: "UFES · PRPPG" },
    period: { pt: "Junho de 2025 – Junho de 2026", en: "June 2025 – June 2026" },
    role: { pt: "Assistente na Assessoria de Pesquisa e Pós-Graduação", en: "Assistant, Research and Graduate Studies Office" },
    organization: "UFES São Mateus",
    bullets: [
      { pt: "Análise de dados institucionais relacionados à pesquisa e à pós-graduação;", en: "Analysis of institutional data related to research and graduate studies;" },
      { pt: "Produção e organização de informações para acompanhamento de indicadores acadêmicos;", en: "Production and organisation of information for tracking academic indicators;" },
      { pt: "Participação na elaboração do Boletim Informativo da Pesquisa e Pós-Graduação 2026, consolidando e apresentando dados institucionais;", en: "Contribution to the 2026 Research and Graduate Studies Bulletin, consolidating and presenting institutional data;" },
      { pt: "Organização e tratamento de informações para apoiar processos administrativos e tomada de decisões;", en: "Organisation and processing of information to support administrative processes and decision-making;" },
      { pt: "Apoio à organização de eventos acadêmicos e atividades relacionadas aos programas de pós-graduação.", en: "Support in organising academic events and activities related to the graduate programmes." },
    ],
  },
  {
    id: "compass", kind: "work",
    tab: { pt: "Compass UOL", en: "Compass UOL" },
    period: { pt: "Novembro de 2024 – Março de 2025", en: "November 2024 – March 2025" },
    role: { pt: "Estágio em Machine Learning e Data Science", en: "Machine Learning & Data Science Internship" },
    organization: "Compass UOL",
    bullets: [
      { pt: "Desenvolvimento de estudos e soluções em Data Science e Machine Learning utilizando Python;", en: "Development of studies and solutions in Data Science and Machine Learning using Python;" },
      { pt: "Análise, exploração e preparação de dados para aplicação em modelos de Machine Learning;", en: "Analysis, exploration and preparation of data for Machine Learning models;" },
      { pt: "Utilização do Amazon SageMaker para desenvolvimento e experimentação de modelos;", en: "Use of Amazon SageMaker for model development and experimentation;" },
      { pt: "Estudos e aplicações envolvendo Inteligência Artificial Generativa e LLMs;", en: "Studies and applications involving Generative AI and LLMs;" },
      { pt: "Desenvolvimento de conhecimentos em serviços de Machine Learning e Cloud Computing na AWS.", en: "Building knowledge of Machine Learning and Cloud Computing services on AWS." },
    ],
  },
  {
    id: "adapti", kind: "work",
    tab: { pt: "Adapti", en: "Adapti" },
    period: { pt: "Maio de 2023 – Abril de 2024", en: "May 2023 – April 2024" },
    role: { pt: "Gerente de Marketing", en: "Marketing Manager" },
    organization: "Adapti Soluções Web",
    bullets: [
      { pt: "Gestão de pessoas e projetos, acompanhando atividades, prazos e entregas da equipe;", en: "People and project management, tracking the team's activities, deadlines and deliverables;" },
      { pt: "Planejamento e execução de estratégias de marketing e relacionamento com clientes;", en: "Planning and execution of marketing and customer relationship strategies;" },
      { pt: "Gestão e acompanhamento de CRM e funil de vendas;", en: "Management and monitoring of CRM and the sales funnel;" },
      { pt: "Levantamento e organização de requisitos para projetos de sites e sistemas web;", en: "Gathering and organising requirements for website and web system projects;" },
      { pt: "Gestão de conteúdo e estratégias de comunicação para mídias digitais;", en: "Content management and communication strategies for digital media;" },
      { pt: "Desenvolvimento de habilidades de liderança, organização, comunicação e tomada de decisão.", en: "Development of leadership, organisation, communication and decision-making skills." },
    ],
  },
  {
    id: "ufes-graduacao", kind: "education",
    tab: { pt: "UFES · Graduação", en: "UFES · Degree" },
    period: { pt: "2022 – previsão 12/2027", en: "2022 – expected 12/2027" },
    role: { pt: "Graduanda em Engenharia da Computação", en: "Computer Engineering undergraduate" },
    organization: "Universidade Federal do Espírito Santo (UFES)",
    bullets: [],
  },
];
