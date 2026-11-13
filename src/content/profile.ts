import type { Profile } from "@/types/content";
import portraitAsset from "@/assets/profile/emily_portrait.jpg.asset.json";

/**
 * Personal identity. Text is taken only from Emily's CV — edit here to update
 * the Home in both languages. Later this object can come from a Supabase row
 * without changing any component.
 */
export const profile: Profile = {
  name: "Emily Wingler Gonçalves",
  headline: {
    pt: "Estudante de Engenharia de Computação | Data Science & Machine Learning",
    en: "Computer Engineering Student | Data Science & Machine Learning",
  },
  location: { pt: "São Mateus, Espírito Santo", en: "São Mateus, Espírito Santo, Brazil" },
  intro: {
    pt: "Graduanda em Engenharia de Computação na UFES, com experiência em Python, Machine Learning, IA aplicada e análise de dados. Atuei na Compass UOL com Python, AWS e LLMs, e na UFES com análise de dados institucionais. Tenho interesse em desenvolvimento de software, engenharia de dados, inteligência artificial e segurança da informação, com foco em aprendizado contínuo e na aplicação prática de tecnologias.",
    en: "Computer Engineering undergraduate at UFES with experience in Python, Machine Learning, applied AI and data analysis. I worked at Compass UOL with Python, AWS and LLMs, and at UFES with institutional data analysis. I'm interested in software development, data engineering, artificial intelligence and information security, with a focus on continuous learning and the practical application of technology.",
  },
  portrait: {
    src: portraitAsset.url,
    alt: { pt: "Retrato de Emily Wingler Gonçalves, sorrindo", en: "Portrait of Emily Wingler Gonçalves, smiling" },
    caption: { pt: "Emily Wingler Gonçalves · São Mateus, ES", en: "Emily Wingler Gonçalves · São Mateus, ES" },
  },
};
