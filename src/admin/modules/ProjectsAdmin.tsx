/**
 * Projects (books). Shelves are the three existing ones; position is the order
 * among books on the same shelf. The editor is split into tabs to keep each
 * step short, ending with a read-only preview.
 */
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CrudSection } from "../components/CrudSection";
import { ImagePathField, ImagePreview, LocalizedField, SelectField, TextField } from "../components/fields";
import { LocalOnlyNotice, PageHeader, ReorderButtons, StatusBadge, moveInArray } from "../components/bits";
import { adminRepository as r, useCollection } from "../data/repository";
import { newId } from "../data/store";
import { emptyText, type AdminProject, type PublishStatus } from "../types";
import { MAX_PROJECT_IMAGES, MAX_PROJECT_LINKS, validateProject, type Errors } from "../validation";

const SHELVES = [1, 2, 3] as const;
const STATUS = [{ value: "draft" as PublishStatus, label: "Rascunho" }, { value: "published" as PublishStatus, label: "Publicado" }];

function nextCatalogNo(list: readonly AdminProject[]) {
  const max = Math.max(0, ...list.map((p) => Number(p.catalogNo.replace(/\D/g, "")) || 0));
  return `PRJ-${String(max + 1).padStart(3, "0")}`;
}

export function ProjectsAdmin() {
  const projects = useCollection(r.projects);
  const [shelfFilter, setShelfFilter] = useState("all");
  const position = (p: AdminProject) => projects.filter((x) => x.shelf === p.shelf).findIndex((x) => x.id === p.id) + 1;
  return (
    <>
      <PageHeader title="Projetos" description="Livros da estante: organização, identidade visual, conteúdo e mídia." />
      <LocalOnlyNotice />
      <div className="mb-3 max-w-xs">
        <SelectField label="Filtrar por estante" value={shelfFilter} onChange={setShelfFilter}
          options={[{ value: "all", label: "Todas as estantes" }, ...SHELVES.map((s) => ({ value: String(s), label: `Estante ${s}` }))]} />
      </div>
      <CrudSection title="Livros" description="As setas mudam a posição do livro dentro da sua estante." singular="projeto" wide
        store={r.projects} reorderable itemLabel={(p) => p.title.pt || "projeto"}
        filter={shelfFilter === "all" ? undefined : (p) => String(p.shelf) === shelfFilter}
        create={(): AdminProject => ({
          id: newId("project"), catalogNo: nextCatalogNo(r.projects.getSnapshot()), shelf: 1, status: "draft",
          cover: { pt: "", en: "" }, spine: "", spineText: emptyText(), title: emptyText(), subtitle: emptyText(),
          description: emptyText(), complement: emptyText(), contribution: emptyText(), technologies: [], images: [], links: [],
        })}
        columns={[
          { header: "Catálogo", cell: (p) => <code className="text-xs">{p.catalogNo}</code> },
          { header: "Título", cell: (p) => p.title.pt },
          { header: "Estante · posição", cell: (p) => `${p.shelf} · ${position(p)}`, className: "hidden sm:table-cell" },
          { header: "Status", cell: (p) => <StatusBadge status={p.status} /> },
        ]}
        validate={validateProject}
        renderForm={(p, set, e) => <ProjectEditor p={p} set={set} e={e} />} />
    </>
  );
}

function ProjectEditor({ p, set, e }: { p: AdminProject; set: (p: AdminProject) => void; e: Errors }) {
  const has = (prefix: string) => Object.keys(e).some((k) => k.startsWith(prefix));
  const flag = (bad: boolean) => bad ? <span className="ml-1 h-1.5 w-1.5 rounded-full bg-destructive" aria-label="contém erros" /> : null;
  return (
    <Tabs defaultValue="org">
      <TabsList className="flex h-auto flex-wrap justify-start">
        <TabsTrigger value="org">Organização{flag(has("shelf"))}</TabsTrigger>
        <TabsTrigger value="identity">Identidade{flag(has("cover") || has("spine"))}</TabsTrigger>
        <TabsTrigger value="content">Conteúdo{flag(has("title") || has("description"))}</TabsTrigger>
        <TabsTrigger value="tech">Tecnologias{flag(has("technologies"))}</TabsTrigger>
        <TabsTrigger value="images">Imagens{flag(has("images"))}</TabsTrigger>
        <TabsTrigger value="links">Links{flag(has("links"))}</TabsTrigger>
        <TabsTrigger value="preview">Pré-visualização</TabsTrigger>
      </TabsList>

      <TabsContent value="org" className="space-y-4 pt-2">
        <div className="grid gap-3 sm:grid-cols-3">
          <SelectField label="Estante vinculada" required value={String(p.shelf)} error={e["shelf"]}
            options={SHELVES.map((s) => ({ value: String(s), label: `Estante ${s}` }))} onChange={(v) => set({ ...p, shelf: Number(v) as AdminProject["shelf"] })} />
          <TextField label="Nº de catálogo" value={p.catalogNo} onChange={(catalogNo) => set({ ...p, catalogNo })} />
          <SelectField label="Status" value={p.status} options={STATUS} onChange={(status) => set({ ...p, status })} />
        </div>
        <p className="text-xs text-muted-foreground">A posição na estante é ajustada pelas setas da listagem. Status é apenas administrativo.</p>
      </TabsContent>

      <TabsContent value="identity" className="space-y-4 pt-2">
        <ImagePathField label="Capa (PT-BR)" required value={p.cover.pt} error={e["cover.pt"]} onChange={(pt) => set({ ...p, cover: { ...p.cover, pt } })} />
        <ImagePathField label="Capa (EN)" required value={p.cover.en} error={e["cover.en"]} onChange={(en) => set({ ...p, cover: { ...p.cover, en } })} />
        <ImagePathField label="Lombada" required value={p.spine} error={e["spine"]} onChange={(spine) => set({ ...p, spine })} />
        <LocalizedField label="Texto da lombada" name="spineText" value={p.spineText} errors={e} onChange={(spineText) => set({ ...p, spineText })} />
      </TabsContent>

      <TabsContent value="content" className="space-y-4 pt-2">
        <LocalizedField label="Título" name="title" required value={p.title} errors={e} onChange={(title) => set({ ...p, title })} />
        <LocalizedField label="Subtítulo" name="subtitle" multiline value={p.subtitle} errors={e} onChange={(subtitle) => set({ ...p, subtitle })} />
        <LocalizedField label="Descrição" name="description" multiline required value={p.description} errors={e} onChange={(description) => set({ ...p, description })} />
        <LocalizedField label="Frase complementar (opcional)" name="complement" multiline value={p.complement} errors={e} onChange={(complement) => set({ ...p, complement })} />
        <LocalizedField label="My Contributions (opcional)" name="contribution" multiline value={p.contribution} errors={e} onChange={(contribution) => set({ ...p, contribution })} />
      </TabsContent>

      <TabsContent value="tech" className="space-y-3 pt-2">
        {p.technologies.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma tecnologia.</p>}
        {p.technologies.map((t, i) => (
          <div key={t.id} className="rounded-md border p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-sm font-medium">Tag {i + 1}</span>
              <ItemTools label={`tag ${i + 1}`} i={i} n={p.technologies.length}
                onMove={(d) => set({ ...p, technologies: moveInArray(p.technologies, i, d) })}
                onRemove={() => set({ ...p, technologies: p.technologies.filter((x) => x.id !== t.id) })} />
            </div>
            <LocalizedField label="Nome" name={`technologies.${i}`} required value={t.name} errors={e}
              onChange={(name) => set({ ...p, technologies: p.technologies.map((x) => (x.id === t.id ? { ...x, name } : x)) })} />
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => set({ ...p, technologies: [...p.technologies, { id: newId("tag"), name: emptyText() }] })}>
          <Plus className="mr-1 h-4 w-4" />Adicionar tag
        </Button>
        <p className="text-xs text-muted-foreground">Os nomes em PT-BR e EN podem ser iguais.</p>
      </TabsContent>

      <TabsContent value="images" className="space-y-3 pt-2">
        {e["images"] && <p role="alert" className="text-sm text-destructive">{e["images"]}</p>}
        {p.images.map((m, i) => (
          <div key={m.id} className="space-y-3 rounded-md border p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium">Imagem {i + 1}</span>
              <ItemTools label={`imagem ${i + 1}`} i={i} n={p.images.length}
                onMove={(d) => set({ ...p, images: moveInArray(p.images, i, d) })}
                onRemove={() => set({ ...p, images: p.images.filter((x) => x.id !== m.id) })} />
            </div>
            <ImagePathField label="Arquivo" required value={m.src} error={e[`images.${i}.src`]} onChange={(src) => set({ ...p, images: p.images.map((x) => (x.id === m.id ? { ...x, src } : x)) })} />
            <LocalizedField label="Legenda" name={`images.${i}.caption`} value={m.caption} errors={e} onChange={(caption) => set({ ...p, images: p.images.map((x) => (x.id === m.id ? { ...x, caption } : x)) })} />
            <LocalizedField label="Texto alternativo" name={`images.${i}.alt`} value={m.alt} errors={e} onChange={(alt) => set({ ...p, images: p.images.map((x) => (x.id === m.id ? { ...x, alt } : x)) })} />
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" disabled={p.images.length >= MAX_PROJECT_IMAGES}
          onClick={() => set({ ...p, images: [...p.images, { id: newId("img"), src: "", alt: emptyText(), caption: emptyText() }] })}>
          <Plus className="mr-1 h-4 w-4" />Adicionar imagem ({p.images.length}/{MAX_PROJECT_IMAGES})
        </Button>
      </TabsContent>

      <TabsContent value="links" className="space-y-3 pt-2">
        {e["links"] && <p role="alert" className="text-sm text-destructive">{e["links"]}</p>}
        {p.links.map((l, i) => (
          <div key={l.id} className="rounded-md border p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-sm font-medium">Link {i + 1}</span>
              <ItemTools label={`link ${i + 1}`} i={i} n={p.links.length}
                onMove={(d) => set({ ...p, links: moveInArray(p.links, i, d) })}
                onRemove={() => set({ ...p, links: p.links.filter((x) => x.id !== l.id) })} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <TextField label="Texto de exibição" required placeholder="GitHub, Diagrama, Site, Dashboard…" value={l.label} error={e[`links.${i}.label`]} onChange={(label) => set({ ...p, links: p.links.map((x) => (x.id === l.id ? { ...x, label } : x)) })} />
              <TextField label="URL" type="url" required value={l.url} error={e[`links.${i}.url`]} onChange={(url) => set({ ...p, links: p.links.map((x) => (x.id === l.id ? { ...x, url } : x)) })} />
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" disabled={p.links.length >= MAX_PROJECT_LINKS}
          onClick={() => set({ ...p, links: [...p.links, { id: newId("link"), label: "", url: "" }] })}>
          <Plus className="mr-1 h-4 w-4" />Adicionar link ({p.links.length}/{MAX_PROJECT_LINKS})
        </Button>
      </TabsContent>

      <TabsContent value="preview" className="pt-2"><ProjectPreview p={p} /></TabsContent>
    </Tabs>
  );
}

function ItemTools({ label, i, n, onMove, onRemove }: { label: string; i: number; n: number; onMove: (d: -1 | 1) => void; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-1">
      <ReorderButtons label={label} first={i === 0} last={i === n - 1} onUp={() => onMove(-1)} onDown={() => onMove(1)} />
      <Button type="button" size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={onRemove} aria-label={`Remover ${label}`}><Trash2 className="h-4 w-4" /></Button>
    </div>
  );
}

/** Plain summary of what will be saved — not a replica of the public book. */
function ProjectPreview({ p }: { p: AdminProject }) {
  return (
    <div className="space-y-4 text-sm">
      <div className="flex flex-wrap gap-3">
        <ImagePreview src={p.cover.pt} alt="Capa PT-BR" className="h-40 w-28" />
        <ImagePreview src={p.cover.en} alt="Capa EN" className="h-40 w-28" />
        <ImagePreview src={p.spine} alt="Lombada" className="h-40 w-10" />
      </div>
      <div className="flex flex-wrap items-center gap-2"><code>{p.catalogNo}</code><span>Estante {p.shelf}</span><StatusBadge status={p.status} /></div>
      <div className="grid gap-4 md:grid-cols-2">
        {(["pt", "en"] as const).map((l) => (
          <div key={l} className="space-y-1 rounded-md border p-3">
            <p className="text-xs font-semibold uppercase text-muted-foreground">{l === "pt" ? "PT-BR" : "EN"}</p>
            <p className="font-semibold">{p.title[l] || "—"}</p>
            {p.subtitle[l] && <p className="italic">{p.subtitle[l]}</p>}
            <p className="whitespace-pre-line">{p.description[l] || "—"}</p>
            {p.complement[l] && <p className="text-muted-foreground">{p.complement[l]}</p>}
            {p.contribution[l] && <p><strong>My Contributions:</strong> {p.contribution[l]}</p>}
            <div className="flex flex-wrap gap-1 pt-1">{p.technologies.map((t) => <Badge key={t.id} variant="secondary">{t.name[l] || "—"}</Badge>)}</div>
          </div>
        ))}
      </div>
      {p.images.length > 0 && <div className="flex flex-wrap gap-3">{p.images.map((m) => (
        <figure key={m.id} className="w-32"><ImagePreview src={m.src} alt={m.alt.pt} className="h-24 w-32" /><figcaption className="mt-1 text-xs text-muted-foreground">{m.caption.pt}</figcaption></figure>
      ))}</div>}
      {p.links.length > 0 && <ul className="list-inside list-disc">{p.links.map((l) => <li key={l.id}>{l.label}: <span className="break-all text-muted-foreground">{l.url}</span></li>)}</ul>}
    </div>
  );
}
