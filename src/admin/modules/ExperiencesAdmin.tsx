import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CrudSection } from "../components/CrudSection";
import { LocalizedField, SelectField, TextField } from "../components/fields";
import { LocalOnlyNotice, PageHeader } from "../components/bits";
import { adminRepository as r, useCollection } from "../data/repository";
import { newId } from "../data/store";
import { emptyText, type ExperienceTab } from "../types";
import { requireField, requireText, type Errors } from "../validation";

export function ExperiencesAdmin() {
  const tabs = useCollection(r.tabs);
  const experiences = useCollection(r.experiences);
  const [tabFilter, setTabFilter] = useState("all");
  const [orphanMode, setOrphanMode] = useState<"move" | "delete">("move");
  const [moveTo, setMoveTo] = useState("");
  const tabName = (id: string) => tabs.find((t) => t.id === id)?.name.pt ?? "—";
  const countIn = (id: string) => experiences.filter((e) => e["tabId"] === id).length;

  const deleteTab = async (tab: ExperienceTab) => {
    const target = moveTo && moveTo !== tab.id ? moveTo : tabs.find((t) => t.id !== tab.id)?.id;
    if (countIn(tab.id)) {
      if (orphanMode === "move" && target) await r.experiences.updateWhere((e) => e["tabId"] === tab.id, (e) => ({ ...e, tabId: target }));
      else await r.experiences.removeWhere((e) => e["tabId"] === tab.id);
    }
    await r.tabs.remove(tab.id);
    if (tabFilter === tab.id) setTabFilter("all");
  };

  return (
    <>
      <PageHeader title="Experiências" description="Abas da pasta e as experiências de cada uma." />
      <LocalOnlyNotice />
      <CrudSection title="Abas" singular="aba" store={r.tabs} reorderable itemLabel={(t) => t.name.pt || "aba"}
        create={() => ({ id: newId("tab"), name: emptyText() })}
        columns={[{ header: "Nome (PT-BR)", cell: (t) => t.name.pt }, { header: "Nome (EN)", cell: (t) => t.name.en, className: "hidden sm:table-cell" }, { header: "Experiências", cell: (t) => countIn(t.id) }]}
        validate={(t) => { const e: Errors = {}; requireText(e, "name", t.name); return e; }}
        renderForm={(t, set, e) => <LocalizedField label="Nome" name="name" required value={t.name} errors={e} onChange={(name) => set({ ...t, name })} />}
        onDelete={deleteTab}
        deleteDetails={(t) => {
          const n = countIn(t.id);
          const others = tabs.filter((o) => o.id !== t.id);
          if (!n) return null;
          return (
            <div className="space-y-3 text-sm">
              <p>Esta aba tem {n} experiência(s) vinculada(s). O que fazer com elas?</p>
              <RadioGroup value={others.length ? orphanMode : "delete"} onValueChange={(v) => setOrphanMode(v as "move" | "delete")}>
                {others.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <RadioGroupItem id="orphan-move" value="move" /><Label htmlFor="orphan-move">Mover para</Label>
                    <select aria-label="Aba de destino" className="h-8 rounded-md border bg-card px-2" value={moveTo || others[0]!.id} onChange={(ev) => setMoveTo(ev.target.value)}>
                      {others.map((o) => <option key={o.id} value={o.id}>{o.name.pt}</option>)}
                    </select>
                  </div>
                )}
                <div className="flex items-center gap-2"><RadioGroupItem id="orphan-delete" value="delete" /><Label htmlFor="orphan-delete">Excluir as experiências junto com a aba</Label></div>
              </RadioGroup>
            </div>
          );
        }} />

      <div className="mb-3 max-w-xs">
        <SelectField label="Filtrar experiências por aba" value={tabFilter} onChange={setTabFilter}
          options={[{ value: "all", label: "Todas as abas" }, ...tabs.map((t) => ({ value: t.id, label: t.name.pt }))]} />
      </div>
      <CrudSection title="Experiências" description={tabFilter === "all" ? "A ordem é aplicada dentro de cada aba." : undefined} singular="experiência"
        store={r.experiences} reorderable
        filter={tabFilter === "all" ? undefined : (x) => x.tabId === tabFilter}
        itemLabel={(x) => x.role.pt || "experiência"}
        emptyHint={tabs.length ? undefined : "Crie uma aba primeiro."}
        create={tabs.length ? () => ({ id: newId("exp"), tabId: tabFilter !== "all" ? tabFilter : tabs[0]!.id, period: emptyText(), role: emptyText(), location: "", description: emptyText() }) : undefined}
        columns={[{ header: "Cargo", cell: (x) => x.role.pt }, { header: "Aba", cell: (x) => tabName(x.tabId) }, { header: "Duração", cell: (x) => x.period.pt, className: "hidden md:table-cell" }]}
        validate={(x) => { const e: Errors = {}; requireText(e, "role", x.role); requireText(e, "period", x.period); requireField(e, "location", x.location); if (!tabs.some((t) => t.id === x.tabId)) e["tabId"] = "Escolha uma aba."; return e; }}
        renderForm={(x, set, e) => (<>
          <SelectField label="Aba vinculada" required value={x.tabId} error={e["tabId"]} onChange={(tabId) => set({ ...x, tabId })} options={tabs.map((t) => ({ value: t.id, label: t.name.pt }))} />
          <LocalizedField label="Duração" name="period" required value={x.period} errors={e} onChange={(period) => set({ ...x, period })} />
          <LocalizedField label="Título do cargo" name="role" required value={x.role} errors={e} onChange={(role) => set({ ...x, role })} />
          <TextField label="Local" required value={x.location} error={e["location"]} onChange={(location) => set({ ...x, location })} />
          <LocalizedField label="Descrição" name="description" multiline value={x.description} errors={e} onChange={(description) => set({ ...x, description })} />
        </>)} />
    </>
  );
}
