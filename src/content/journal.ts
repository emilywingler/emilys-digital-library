import type { JournalArticle } from "@/types/content";
import shebuildsCover from "@/assets/journal/shebuilds/cover.png.asset.json";

/** Journal entries, newest first. Text is final copy supplied by Emily. */
export const journalArticles: JournalArticle[] = [
  {
    id: "shebuilds",
    title: "Como foi a experiência de participar do SheBuilds: Learning Edition da Lovable?",
    excerpt:
      "Da inscrição ao produto final: um relato honesto sobre como foi participar do SheBuilds, tudo que eu aprendi, e por que você deveria participar também se tiver a chance!",
    lang: "pt-BR",
    cover: { src: shebuildsCover.url, alt: "Banner do SheBuilds com a pergunta “Como foi participar?”", width: 1400, height: 788 },
    status: "in-progress",
  },
];
