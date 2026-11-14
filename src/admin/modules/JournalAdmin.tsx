import { CrudSection } from "../components/CrudSection";
import { ImagePathField, LocalizedField, SelectField, TextField } from "../components/fields";
import { LocalOnlyNotice, PageHeader, StatusBadge } from "../components/bits";
import { adminRepository as r } from "../data/repository";
import { newId } from "../data/store";
import { emptyText, type AdminJournalArticle, type PublishStatus } from "../types";
import { validateJournal } from "../validation";

const LANGS = [{ value: "pt-BR" as const, label: "Português" }, { value: "en" as const, label: "Inglês" }];
const STATUS = [{ value: "draft" as PublishStatus, label: "Rascunho" }, { value: "published" as PublishStatus, label: "Publicado" }];
const titleOf = (a: AdminJournalArticle) => (a.lang === "pt-BR" ? a.title.pt : a.title.en) || a.title.pt || a.title.en || "artigo";

export function JournalAdmin() {
  return (
    <>
      <PageHeader title="Journal" description="Artigos do diário. Rascunhos exibirão o selo “Em desenvolvimento” e não terão botão de leitura." />
      <LocalOnlyNotice />
      <CrudSection title="Artigos" singular="artigo" store={r.journal} reorderable wide itemLabel={titleOf}
        create={(): AdminJournalArticle => ({ id: newId("article"), title: emptyText(), description: emptyText(), coverSrc: "", lang: "pt-BR", status: "draft", url: "" })}
        columns={[
          { header: "Título", cell: titleOf },
          { header: "Idioma", cell: (a) => (a.lang === "pt-BR" ? "PT-BR" : "EN"), className: "hidden sm:table-cell" },
          { header: "Status", cell: (a) => <StatusBadge status={a.status} /> },
          { header: "Botão de leitura", cell: (a) => (a.status === "published" ? "Disponível" : "Indisponível"), className: "hidden md:table-cell" },
        ]}
        validate={validateJournal}
        renderForm={(a, set, e) => (<>
          <div className="grid gap-3 sm:grid-cols-2">
            <SelectField label="Idioma do artigo" value={a.lang} options={LANGS} onChange={(lang) => set({ ...a, lang })} />
            <SelectField label="Status" value={a.status} options={STATUS} onChange={(status) => set({ ...a, status })} />
          </div>
          <LocalizedField label="Título" name="title" value={a.title} errors={e} onChange={(title) => set({ ...a, title })} />
          <LocalizedField label="Descrição" name="description" multiline value={a.description} errors={e} onChange={(description) => set({ ...a, description })} />
          <ImagePathField label="Imagem de capa" required value={a.coverSrc} error={e["coverSrc"]} onChange={(coverSrc) => set({ ...a, coverSrc })} />
          <TextField label="Link externo do artigo" type="url" value={a.url} error={e["url"]} hint="Obrigatório (https://) quando o status for Publicado." onChange={(url) => set({ ...a, url })} />
        </>)} />
    </>
  );
}
