import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { CrudSection } from "../components/CrudSection";
import { LocalizedField, SelectField, TextField } from "../components/fields";
import { LocalOnlyNotice, PageHeader, StatusBadge } from "../components/bits";
import { adminRepository as r, useCollection } from "../data/repository";
import { newId } from "../data/store";
import { emptyText, type PublishStatus, type SkillDrawer } from "../types";
import { cardNumber, requireText, validateDrawer, type Errors } from "../validation";

const STATUS = [{ value: "published" as PublishStatus, label: "Publicado" }, { value: "draft" as PublishStatus, label: "Rascunho" }];

export function SkillsAdmin() {
  const drawers = useCollection(r.drawers);
  const cards = useCollection(r.cards);
  const [drawerFilter, setDrawerFilter] = useState(drawers[0]?.id ?? "");
  const current = drawers.find((d) => d.id === drawerFilter) ?? drawers[0];
  const cardsIn = (id: string) => cards.filter((c) => c.drawerId === id);
  const numberOf = (cardId: string, drawerId: string) => {
    const d = drawers.find((x) => x.id === drawerId);
    return d ? cardNumber(d.code, cardsIn(drawerId).findIndex((c) => c.id === cardId)) : "—";
  };

  return (
    <>
      <PageHeader title="Habilidades" description="Gavetas do catálogo e seus cartões." />
      <LocalOnlyNotice />
      <CrudSection title="Gavetas" singular="gaveta" store={r.drawers} reorderable itemLabel={(d) => d.name.pt || "gaveta"}
        create={(): SkillDrawer => ({ id: newId("drawer"), name: emptyText(), code: "", status: "draft" })}
        columns={[
          { header: "Nome", cell: (d) => d.name.pt }, { header: "Abrev.", cell: (d) => <code>{d.code}</code> },
          { header: "Cartões", cell: (d) => cardsIn(d.id).length },
          { header: "Status", cell: (d) => <span className="flex flex-wrap gap-1"><StatusBadge status={d.status} />{d.status === "published" && !cardsIn(d.id).length && <Badge variant="destructive">Sem cartões</Badge>}</span> },
        ]}
        validate={(d) => validateDrawer(d, cardsIn(d.id).length)}
        renderForm={(d, set, e) => (<>
          <LocalizedField label="Nome" name="name" required value={d.name} errors={e} onChange={(name) => set({ ...d, name })} />
          <TextField label="Abreviação" required hint="Usada na numeração dos cartões, ex.: PRG → PRG-01." value={d.code} error={e["code"]} onChange={(code) => set({ ...d, code: code.toUpperCase() })} />
          <SelectField label="Status" value={d.status} error={e["status"]} options={STATUS} onChange={(status) => set({ ...d, status })} />
        </>)}
        onDelete={async (d) => { await r.cards.removeWhere((c) => c.drawerId === d.id); await r.drawers.remove(d.id); }}
        deleteDetails={(d) => cardsIn(d.id).length ? <p className="text-sm">Os {cardsIn(d.id).length} cartão(ões) desta gaveta também serão excluídos.</p> : null} />

      {current && (
        <div className="mb-3 max-w-xs">
          <SelectField label="Cartões da gaveta" value={current.id} onChange={setDrawerFilter} options={drawers.map((d) => ({ value: d.id, label: `${d.code} · ${d.name.pt}` }))} />
        </div>
      )}
      <CrudSection title={current ? `Cartões — ${current.name.pt}` : "Cartões"} description="O número do cartão é gerado pela posição." singular="cartão"
        store={r.cards} reorderable filter={(c) => c.drawerId === current?.id}
        itemLabel={(c) => c.title.pt || "cartão"}
        emptyHint={drawers.length ? undefined : "Crie uma gaveta primeiro."}
        create={current ? () => ({ id: newId("card"), drawerId: current.id, title: emptyText(), description: emptyText() }) : undefined}
        columns={[{ header: "Número", cell: (c) => <code>{numberOf(c.id, c.drawerId)}</code> }, { header: "Título", cell: (c) => c.title.pt }, { header: "Descrição", cell: (c) => c.description.pt, className: "hidden lg:table-cell" }]}
        validate={(c) => {
          const e: Errors = {}; requireText(e, "title", c.title); requireText(e, "description", c.description);
          const before = r.cards.get(c.id);
          const from = before && before.drawerId !== c.drawerId ? drawers.find((d) => d.id === before.drawerId) : undefined;
          if (from?.status === "published" && cardsIn(from.id).length <= 1) e["drawerId"] = "A gaveta de origem é publicada e ficaria sem cartões.";
          return e;
        }}
        deleteBlocked={(c) => {
          const d = drawers.find((x) => x.id === c.drawerId);
          return d?.status === "published" && cardsIn(d.id).length <= 1 ? "Este é o único cartão de uma gaveta publicada. Adicione outro cartão ou mude a gaveta para rascunho antes de excluí-lo." : null;
        }}
        renderForm={(c, set, e) => (<>
          <SelectField label="Gaveta vinculada" required value={c.drawerId} error={e["drawerId"]} onChange={(drawerId) => set({ ...c, drawerId })} options={drawers.map((d) => ({ value: d.id, label: d.name.pt }))} />
          <LocalizedField label="Título" name="title" required value={c.title} errors={e} onChange={(title) => set({ ...c, title })} />
          <LocalizedField label="Pequena descrição" name="description" multiline required value={c.description} errors={e} onChange={(description) => set({ ...c, description })} />
        </>)} />
    </>
  );
}
