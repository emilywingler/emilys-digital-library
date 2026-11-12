import type { SkillCategory } from "@/types/content";

/**
 * Skills catalog. Skill names are copied from Emily's CV; descriptions say what
 * the skill is generally used for and never claim results. `seeAlso` only links
 * to an experience whose CV bullets name the skill. `level` stays unset until
 * Emily provides one.
 */
export const skillCategories: SkillCategory[] = [
  {
    id: "programming", code: "PRG",
    label: { pt: "Programação", en: "Programming" },
    skills: [
      { code: "PRG-01", name: "Python", seeAlso: ["compass"],
        description: { pt: "Linguagem para análise de dados, automação e Machine Learning.", en: "Language for data analysis, automation and Machine Learning." } },
      { code: "PRG-02", name: "SQL",
        description: { pt: "Consulta e manipulação de dados em bancos relacionais.", en: "Querying and manipulating data in relational databases." } },
      { code: "PRG-03", name: "Git e GitHub", nameEn: "Git & GitHub",
        description: { pt: "Controle de versão e hospedagem de código.", en: "Version control and code hosting." } },
    ],
  },
  {
    id: "data", code: "DAT",
    label: { pt: "Ciência de Dados", en: "Data Science" },
    skills: [
      { code: "DAT-01", name: "Pandas",
        description: { pt: "Biblioteca Python para tabelas e tratamento de dados.", en: "Python library for tabular data and data wrangling." } },
      { code: "DAT-02", name: "Análise e Manipulação de Dados", nameEn: "Data Analysis & Manipulation", seeAlso: ["ufes-prppg", "compass"],
        description: { pt: "Limpeza, exploração e organização de dados.", en: "Cleaning, exploring and organising data." } },
      { code: "DAT-03", name: "Estatística para Data Science", nameEn: "Statistics for Data Science",
        description: { pt: "Base estatística para descrever dados e avaliar hipóteses.", en: "Statistical foundations for describing data and testing hypotheses." } },
      { code: "DAT-04", name: "Engenharia de Atributos", nameEn: "Feature Engineering",
        description: { pt: "Criação e seleção de variáveis para modelos.", en: "Creating and selecting variables for models." } },
      { code: "DAT-05", name: "Redução de Dimensionalidade (PCA)", nameEn: "Dimensionality Reduction (PCA)",
        description: { pt: "Redução do número de variáveis preservando a informação.", en: "Reducing the number of variables while preserving information." } },
      { code: "DAT-06", name: "Power BI",
        description: { pt: "Painéis e relatórios para visualização de dados.", en: "Dashboards and reports for data visualisation." } },
    ],
  },
  {
    id: "ml", code: "ML",
    label: { pt: "Machine Learning & IA", en: "Machine Learning & AI" },
    skills: [
      { code: "ML-01", name: "Machine Learning", seeAlso: ["compass"],
        description: { pt: "Modelos que aprendem padrões a partir de dados.", en: "Models that learn patterns from data." } },
      { code: "ML-02", name: "Modelos de Regressão", nameEn: "Regression Models",
        description: { pt: "Previsão de valores numéricos.", en: "Predicting numeric values." } },
      { code: "ML-03", name: "Classificação", nameEn: "Classification",
        description: { pt: "Atribuição de categorias a exemplos.", en: "Assigning categories to examples." } },
      { code: "ML-04", name: "Aprendizado Não Supervisionado", nameEn: "Unsupervised Learning",
        description: { pt: "Descoberta de grupos e estruturas sem rótulos.", en: "Finding groups and structure without labels." } },
      { code: "ML-05", name: "Avaliação e Comparação de Modelos", nameEn: "Model Evaluation & Comparison",
        description: { pt: "Métricas e validação para escolher modelos.", en: "Metrics and validation for choosing models." } },
      { code: "ML-06", name: "Deep Learning",
        description: { pt: "Redes neurais profundas para dados complexos.", en: "Deep neural networks for complex data." } },
      { code: "ML-07", name: "Redes Neurais", nameEn: "Neural Networks",
        description: { pt: "Modelos inspirados em neurônios conectados em camadas.", en: "Models built from layers of connected neurons." } },
      { code: "ML-08", name: "Visão Computacional", nameEn: "Computer Vision",
        description: { pt: "Análise e interpretação de imagens.", en: "Analysing and interpreting images." } },
      { code: "ML-09", name: "Processamento de Linguagem Natural (NLP)", nameEn: "Natural Language Processing (NLP)",
        description: { pt: "Análise e geração de texto.", en: "Analysing and generating text." } },
      { code: "ML-10", name: "LLMs e Transformers", nameEn: "LLMs & Transformers", seeAlso: ["compass"],
        description: { pt: "Modelos de linguagem de grande escala e a arquitetura Transformer.", en: "Large language models and the Transformer architecture." } },
    ],
  },
  {
    id: "tools", code: "FER",
    label: { pt: "Ferramentas & Plataformas", en: "Tools & Platforms" },
    skills: [
      { code: "FER-01", name: "AWS (S3, SageMaker e Bedrock)", nameEn: "AWS (S3, SageMaker & Bedrock)",
        description: { pt: "Armazenamento (S3), treino de modelos (SageMaker) e modelos generativos (Bedrock) na nuvem.", en: "Cloud storage (S3), model training (SageMaker) and generative models (Bedrock)." } },
      { code: "FER-02", name: "MLOps e MLflow", nameEn: "MLOps & MLflow",
        description: { pt: "Práticas e ferramenta para rastrear experimentos e versionar modelos.", en: "Practices and a tool for tracking experiments and versioning models." } },
    ],
  },
];
