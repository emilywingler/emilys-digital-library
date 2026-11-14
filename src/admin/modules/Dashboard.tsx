import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ADMIN_NAV } from "../components/AdminShell";
import { LocalOnlyNotice, PageHeader } from "../components/bits";
import { adminRepository as r, useCollection } from "../data/repository";
import { computeStats } from "../data/stats";

export function Dashboard() {
  const s = computeStats({
    projects: useCollection(r.projects), experiences: useCollection(r.experiences), tabs: useCollection(r.tabs),
    drawers: useCollection(r.drawers), cards: useCollection(r.cards), journal: useCollection(r.journal),
    footerLinks: useCollection(r.footerLinks), manuscripts: useCollection(r.manuscripts),
  });
  const kpis = [
    { label: "Projetos", value: s.projects.total, sub: `${s.projects.published} publicados · ${s.projects.draft} rascunhos` },
    { label: "Experiências", value: s.experiences, sub: `${s.tabs} abas` },
    { label: "Gavetas de habilidades", value: s.drawers.total, sub: `${s.cards} cartões · ${s.drawers.draft} rascunhos` },
    { label: "Artigos do Journal", value: s.journal.total, sub: `${s.journal.published} publicados · ${s.journal.draft} rascunhos` },
    { label: "Links do footer", value: s.activeLinks, sub: `ativos de ${s.links}` },
    { label: "Manuscritos", value: s.manuscripts, sub: "7 manuscritos + carta final" },
  ];
  return (
    <>
      <PageHeader title="Dashboard" description="Visão geral do conteúdo administrado." />
      <LocalOnlyNotice />
      <section aria-label="Indicadores" className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((k) => (
          <Card key={k.label}>
            <CardHeader className="pb-1"><CardTitle className="text-sm font-medium text-muted-foreground">{k.label}</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-semibold tabular-nums">{k.value}</p><p className="text-xs text-muted-foreground">{k.sub}</p></CardContent>
          </Card>
        ))}
      </section>
      <h2 className="mb-3 text-lg font-semibold">Atalhos</h2>
      <nav aria-label="Módulos" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {ADMIN_NAV.slice(1).map((n) => (
          <Link key={n.to} to={n.to} className="flex items-center gap-3 rounded-md border bg-card p-4 text-sm font-medium transition-colors hover:border-primary hover:text-primary">
            <n.icon className="h-4 w-4" aria-hidden />{n.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
