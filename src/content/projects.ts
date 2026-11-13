import type { Project, ShelfDecor } from "@/types/content";
import olistCoverPt from "@/assets/projects/olist/cover-pt.svg.asset.json";
import olistCoverEn from "@/assets/projects/olist/cover-en.svg.asset.json";
import olistSpine from "@/assets/projects/olist/spine.svg.asset.json";
import pendulumCoverPt from "@/assets/projects/pendulum/cover-pt.svg.asset.json";
import pendulumCoverEn from "@/assets/projects/pendulum/cover-en.svg.asset.json";
import pendulumSpine from "@/assets/projects/pendulum/spine.svg.asset.json";
import studiesCoverPt from "@/assets/projects/ml-studies/cover-pt.svg.asset.json";
import studiesCoverEn from "@/assets/projects/ml-studies/cover-en.svg.asset.json";
import studiesSpine from "@/assets/projects/ml-studies/spine.svg.asset.json";
import bakeryCoverPt from "@/assets/projects/bakery/cover-pt.svg.asset.json";
import bakeryCoverEn from "@/assets/projects/bakery/cover-en.svg.asset.json";
import bakerySpine from "@/assets/projects/bakery/spine.svg.asset.json";

/**
 * The four real project books. Text is written from each repository's README;
 * `contribution: null` marks details Emily still has to confirm.
 * Artwork comes from `.asset.json` pointers in `src/assets/projects/<id>/`.
 */
export const projects: Project[] = [
  {
    id: "olist", catalogNo: "PRJ-001", shelf: 1, order: 3, featured: true, spineHeight: 19,
    title: { pt: "Análise do E-commerce Olist", en: "Olist E-commerce Analysis" },
    intro: {
      pt: "Quem vende mais no marketplace — e quanto essa resposta depende das definições?",
      en: "Who sells the most on the marketplace — and how much does that answer depend on definitions?",
    },
    description: {
      pt: "Análise descritiva do conjunto público de dados da Olist, com cerca de 100 mil pedidos entre 2016 e 2018. O estudo identifica as categorias e os vendedores com maior e menor receita com produtos nos 12 meses mais recentes e testa como os rankings mudam conforme a definição de receita, o escopo dos pedidos e a janela de tempo.",
      en: "A descriptive analysis of Olist's public dataset, with about 100,000 orders from 2016 to 2018. It identifies the product categories and sellers with the highest and lowest product revenue in the latest 12 months, and tests how those rankings shift with the revenue definition, order scope and time window.",
    },
    context: {
      pt: "Os resultados são descritivos, não causais. Um painel em Power BI está em desenvolvimento.",
      en: "Findings are descriptive, not causal. A Power BI dashboard is in progress.",
    },
    technologies: ["Python", "pandas", "NumPy", "Matplotlib", "Jupyter Notebook", "Power BI"],
    contribution: null,
    repoUrl: "https://github.com/emilywingler/analise-ecommerce-olist",
    cover: { pt: olistCoverPt.url, en: olistCoverEn.url }, spine: olistSpine.url, media: [],
  },
  {
    id: "pendulum", catalogNo: "PRJ-002", shelf: 1, order: 4, featured: true, spineHeight: 21,
    title: { pt: "Controle de Estabilidade de um Pêndulo Bimotor", en: "Bimotor Pendulum Stability Control" },
    intro: {
      pt: "Uma haste com dois motores que volta sempre ao ângulo escolhido — mesmo depois de um empurrão.",
      en: "A two-motor arm that always returns to the chosen angle — even after a push.",
    },
    description: {
      pt: "Projeto da disciplina Controle e Automação: controle de um pêndulo bimotor com 1 grau de liberdade, cuja dinâmica lembra a arfagem de um drone. Um potenciômetro define o ângulo desejado; o MPU9250 mede a inclinação, um filtro complementar funde giroscópio e acelerômetro, e um controlador PI a 100 Hz no ESP32 ajusta os motores.",
      en: "A Control and Automation course project: stability control of a one-degree-of-freedom bimotor pendulum, whose dynamics resemble a drone's pitch. A potentiometer sets the target angle; an MPU9250 measures the tilt, a complementary filter fuses gyroscope and accelerometer data, and a 100 Hz PI controller on the ESP32 drives the motors.",
    },
    context: {
      pt: "O repositório reúne o firmware, o relatório técnico e um vídeo de demonstração.",
      en: "The repository contains the firmware, the technical report and a demonstration video.",
    },
    technologies: ["ESP32", "MPU9250", "C++ (Arduino)", { pt: "Filtro complementar", en: "Complementary filter" }, { pt: "Controle PI", en: "PI control" }],
    contribution: null,
    repoUrl: "https://github.com/emilywingler/Controle-de-Estabilidade-de-um-P-ndulo-Bimotor-1-DOF",
    cover: { pt: pendulumCoverPt.url, en: pendulumCoverEn.url }, spine: pendulumSpine.url, media: [],
  },
  {
    id: "ml-studies", catalogNo: "PRJ-003", shelf: 1, order: 5, featured: false, spineHeight: 19.5,
    title: { pt: "Estudos em Machine Learning e Data Science", en: "Machine Learning & Data Science Studies" },
    intro: {
      pt: "Um caderno de estudos aberto: dos fundamentos de dados a LLMs e MLOps.",
      en: "An open study notebook: from data fundamentals to LLMs and MLOps.",
    },
    description: {
      pt: "Repositório de aprendizado com estudos, exercícios e anotações feitos ao longo da minha formação em dados. Vai de Python, pandas, estatística e SQL a algoritmos de Machine Learning, redes neurais, visão computacional, NLP, LLMs, MLOps e serviços de ML na nuvem, como AWS SageMaker, S3 e Bedrock.",
      en: "A learning repository of studies, exercises and notes from my data journey. It spans Python, pandas, statistics and SQL through Machine Learning algorithms, neural networks, computer vision, NLP, LLMs, MLOps and cloud ML services such as AWS SageMaker, S3 and Bedrock.",
    },
    context: {
      pt: "Material de consulta em construção — não é uma aplicação em produção.",
      en: "A reference collection in progress — not a production application.",
    },
    technologies: ["Python", "pandas", "SQL", { pt: "Estatística", en: "Statistics" }, "AWS SageMaker", "AWS S3", "AWS Bedrock", "MLOps", "LLMs", { pt: "Visão computacional", en: "Computer vision" }],
    contribution: null,
    repoUrl: "https://github.com/emilywingler/Estudos-com-enfoque-em-Machine-Learning-e-Data-Science",
    cover: { pt: studiesCoverPt.url, en: studiesCoverEn.url }, spine: studiesSpine.url, media: [],
  },
  {
    id: "bakery", catalogNo: "PRJ-004", shelf: 1, order: 6, featured: false, spineHeight: 18.5,
    title: { pt: "Sistema de Gestão de Padaria", en: "Bakery Management System" },
    intro: {
      pt: "Trocando o caderno de contas da padaria do Sr. Oak por um sistema orientado a objetos.",
      en: "Replacing Mr. Oak's bakery notebook with an object-oriented system.",
    },
    description: {
      pt: "Projeto acadêmico colaborativo da disciplina de Programação Orientada a Objetos. Em Java, o sistema cadastra clientes, fornecedores e produtos, registra vendas fiadas e à vista, controla contas a pagar e a receber e gera relatórios mensais, com dados em arquivos CSV, execução pelo terminal e uma interface gráfica.",
      en: "A collaborative academic project for an Object-Oriented Programming course. Written in Java, it registers customers, suppliers and products, records credit and cash sales, tracks accounts payable and receivable and produces monthly reports, storing data in CSV files and running from the terminal or a graphical interface.",
    },
    context: {
      pt: "Trabalho de disciplina, não um sistema comercial em uso.",
      en: "A course assignment, not a commercial system in use.",
    },
    technologies: ["Java", { pt: "POO", en: "OOP" }, "CSV", "UML"],
    contribution: null,
    repoUrl: "https://github.com/emilywingler/Sistema_Padaria",
    links: [{ label: { pt: "Diagrama UML", en: "UML diagram" }, href: "https://lucid.app/lucidchart/6489d7bc-bc9a-4903-986c-0b3dabb231fd/edit?invitationId=inv_f00eb130-1baf-4d5a-bcbe-ecc79af7f850&page=hF_BlsUKGquW#" }],
    cover: { pt: bakeryCoverPt.url, en: bakeryCoverEn.url }, spine: bakerySpine.url, media: [],
  },
];

/** Shelf fillers that balance the composition. Never interactive. */
export const shelfDecor: ShelfDecor[] = [
  // Shelf 1: the four project books stand together in the middle.
  { id: "d1", kind: "book", shelf: 1, order: 1, height: 15, width: 2, tone: 1, label: "XII" },
  { id: "d2", kind: "book", shelf: 1, order: 2, height: 16.5, width: 1.6, tone: 3, label: "IV" },
  // Leans outward, away from the project group, so it never covers a spine.
  { id: "d3", kind: "book", shelf: 1, order: 7, height: 14, width: 2.3, tone: 2, lean: true, label: "VII" },
  { id: "g1", kind: "globe", shelf: 1, order: 8 },
  // Shelf 2: a full row of decorative books (no projects yet), plant at the left.
  { id: "p1", kind: "plant", shelf: 2, order: 0 },
  { id: "d4", kind: "book", shelf: 2, order: 1, height: 15.5, width: 1.8, tone: 4, label: "II" },
  { id: "d5", kind: "book", shelf: 2, order: 2, height: 13.5, width: 2.4, tone: 1, label: "IX" },
  { id: "d6", kind: "book", shelf: 2, order: 3, height: 16, width: 1.5, tone: 2, label: "III" },
  { id: "d7", kind: "book", shelf: 2, order: 4, height: 14.5, width: 2, tone: 3, label: "XI" },
  { id: "d8", kind: "book", shelf: 2, order: 5, height: 15, width: 1.7, tone: 1 },
  { id: "d9", kind: "book", shelf: 2, order: 6, height: 16.5, width: 2.2, tone: 4, label: "V" },
  { id: "d10", kind: "book", shelf: 2, order: 7, height: 13, width: 1.6, tone: 2 },
  { id: "d11", kind: "book", shelf: 2, order: 8, height: 15.8, width: 1.9, tone: 3, label: "VIII" },
  { id: "d12", kind: "book", shelf: 2, order: 9, height: 14.2, width: 2.3, tone: 1, label: "I" },
  { id: "d13", kind: "book", shelf: 2, order: 10, height: 16.2, width: 1.5, tone: 4 },
  { id: "d14", kind: "book", shelf: 2, order: 11, height: 14.8, width: 2, tone: 2, label: "X" },
  { id: "d15", kind: "book", shelf: 2, order: 12, height: 15.4, width: 1.8, tone: 3 },
  { id: "d16", kind: "book", shelf: 2, order: 13, height: 13.8, width: 2.1, tone: 1, label: "VI" },
  { id: "d17", kind: "book", shelf: 2, order: 14, height: 16, width: 1.6, tone: 4, label: "XIV" },
];
