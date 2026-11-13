import * as Tabs from "@radix-ui/react-tabs";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { BrassPull } from "@/components/decor/BrassPull";
import type { Locale, SkillCategory } from "@/types/content";
import { IndexCard, type IndexCardLabels } from "./IndexCard";

/**
 * Card-catalog cabinet: each category is a drawer (Radix tab, manual
 * activation — arrows move focus, Enter/Space open). Vertical on desktop,
 * horizontal wrapping plates on mobile. The first drawer starts open.
 */
export function CardCatalog({ categories, locale, label, cardLabels, experienceNames }: {
  categories: SkillCategory[]; locale: Locale; label: string;
  cardLabels: IndexCardLabels; experienceNames: Record<string, string>;
}) {
  const [open, setOpen] = useState(categories[0]?.id ?? "");
  const mobile = useIsMobile();
  return (
    <Tabs.Root value={open} onValueChange={setOpen} activationMode="manual"
      orientation={mobile ? "horizontal" : "vertical"} className="grid gap-6 md:grid-cols-[15rem_1fr]">
      <Tabs.List aria-label={label} className="catalog-cabinet grid grid-cols-2 gap-2 rounded-sm p-2 md:flex md:flex-col md:self-start md:gap-3 md:p-3">
        {categories.map((c, i) => (
          <Tabs.Trigger key={c.id} value={c.id}
            className="group relative flex flex-col items-center rounded-sm bg-drawer px-2 pb-1.5 pt-2 text-paper-foreground shadow-md transition-transform duration-200 ease-out data-[state=active]:translate-x-0 motion-reduce:transition-none md:data-[state=active]:translate-x-2 md:motion-reduce:data-[state=active]:translate-x-0">
            <span className="flex w-full items-stretch overflow-hidden rounded-[2px] border-2 border-gold/70 bg-paper text-[0.7rem] group-data-[state=active]:border-gold group-data-[state=active]:shadow-[0_0_0_1px_var(--gold)]">
              <span className="border-r border-gold/60 px-1.5 py-1 font-masthead tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <span className="flex-1 px-1.5 py-1 text-left font-masthead uppercase leading-tight tracking-[0.06em]">{c.label[locale]}</span>
            </span>
            <BrassPull className="catalog-pull mt-1 h-3 w-8 text-gold/80 group-data-[state=active]:text-gold" />
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {categories.map((c) => (
        <Tabs.Content key={c.id} value={c.id} className="catalog-drawer focus-visible:outline-none" lang={locale === "pt" ? "pt-BR" : "en"}>
          <ul className="grid gap-4 sm:grid-cols-2">
            {c.skills.map((s) => (
              <IndexCard key={s.code} skill={s} locale={locale} labels={cardLabels} experienceNames={experienceNames} />
            ))}
          </ul>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
