/**
 * Texts of the seven manuscripts and the final letter. The set is fixed by the
 * game (discovery, placement, progress, reward), so records are edited only —
 * never created or deleted. The dedication stays in code.
 */
import { CrudSection } from "../components/CrudSection";
import { LocalizedField } from "../components/fields";
import { LocalOnlyNotice, PageHeader } from "../components/bits";
import { adminRepository as r } from "../data/repository";
import { requireText, type Errors } from "../validation";

export function ManuscriptsAdmin() {
  return (
    <>
      <PageHeader title="Manuscritos" description="Textos dos objetos escondidos e da carta final. A lógica do jogo não muda aqui." />
      <LocalOnlyNotice />
      <CrudSection title="Textos" singular="manuscrito" store={r.manuscripts} canDelete={false}
        itemLabel={(m) => m.title.pt}
        columns={[
          { header: "Nº", cell: (m) => (m.number ? String(m.number).padStart(2, "0") : "Carta final") },
          { header: "Título (PT-BR)", cell: (m) => m.title.pt },
          { header: "Título (EN)", cell: (m) => m.title.en, className: "hidden md:table-cell" },
        ]}
        validate={(m) => { const e: Errors = {}; requireText(e, "title", m.title); requireText(e, "description", m.description); return e; }}
        renderForm={(m, set, e) => (<>
          <LocalizedField label="Título" name="title" required value={m.title} errors={e} onChange={(title) => set({ ...m, title })} />
          <LocalizedField label="Descrição" name="description" required multiline value={m.description} errors={e} onChange={(description) => set({ ...m, description })} />
          <p className="text-xs text-muted-foreground">Parágrafos são separados por uma linha em branco.</p>
        </>)} />
    </>
  );
}
