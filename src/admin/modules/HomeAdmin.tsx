import { CrudSection } from "../components/CrudSection";
import { DocEditor } from "../components/DocEditor";
import { ImagePathField, LocalizedField, TextField } from "../components/fields";
import { LocalOnlyNotice, PageHeader } from "../components/bits";
import { adminRepository as r } from "../data/repository";
import { newId } from "../data/store";
import { emptyText } from "../types";
import { isValidLink, requireField, requireText, type Errors } from "../validation";

export function HomeAdmin() {
  return (
    <>
      <PageHeader title="Home" description="Descrição, foto de perfil e botões da página inicial." />
      <LocalOnlyNotice />
      <DocEditor title="Perfil" store={r.home}
        validate={(v) => { const e: Errors = {}; requireText(e, "description", v.description); requireField(e, "portraitSrc", v.portraitSrc); requireText(e, "portraitAlt", v.portraitAlt); return e; }}
        renderForm={(v, set, e) => (<>
          <LocalizedField label="Descrição" name="description" multiline required value={v.description} errors={e} onChange={(description) => set({ ...v, description })} />
          <ImagePathField label="Foto de perfil" required value={v.portraitSrc} error={e["portraitSrc"]} onChange={(portraitSrc) => set({ ...v, portraitSrc })} />
          <LocalizedField label="Texto alternativo da foto" name="portraitAlt" required value={v.portraitAlt} errors={e} onChange={(portraitAlt) => set({ ...v, portraitAlt })} />
        </>)} />
      <CrudSection title="Botões (CTAs)" description="Texto e destino. O comportamento dos botões continua definido no código." singular="botão"
        store={r.ctas} reorderable itemLabel={(c) => c.label.pt || "botão"}
        create={() => ({ id: newId("cta"), label: emptyText(), href: "" })}
        columns={[{ header: "Texto (PT-BR)", cell: (c) => c.label.pt }, { header: "Texto (EN)", cell: (c) => c.label.en, className: "hidden md:table-cell" }, { header: "Destino", cell: (c) => <code className="break-all text-xs">{c.href}</code> }]}
        validate={(c) => { const e: Errors = {}; requireText(e, "label", c.label); if (!isValidLink(c.href)) e["href"] = "Use https://, mailto: ou uma âncora como #projects."; return e; }}
        renderForm={(c, set, e) => (<>
          <LocalizedField label="Texto" name="label" required value={c.label} errors={e} onChange={(label) => set({ ...c, label })} />
          <TextField label="Destino/link" required value={c.href} error={e["href"]} onChange={(href) => set({ ...c, href })} />
        </>)} />
    </>
  );
}
