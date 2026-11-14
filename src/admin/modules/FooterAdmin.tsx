import { Github, Globe, Linkedin, Mail, Rss, Youtube, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CrudSection } from "../components/CrudSection";
import { DocEditor } from "../components/DocEditor";
import { LocalizedField, SelectField, TextField } from "../components/fields";
import { LocalOnlyNotice, PageHeader } from "../components/bits";
import { adminRepository as r } from "../data/repository";
import { newId } from "../data/store";
import { FOOTER_ICONS, type FooterIcon, type FooterLink } from "../types";
import { isValidLink, requireField, requireText, type Errors } from "../validation";

const ICONS: Record<FooterIcon, { icon: LucideIcon; label: string }> = {
  github: { icon: Github, label: "GitHub" }, linkedin: { icon: Linkedin, label: "LinkedIn" }, mail: { icon: Mail, label: "E-mail" },
  youtube: { icon: Youtube, label: "YouTube" }, rss: { icon: Rss, label: "Blog / Medium / Substack" }, globe: { icon: Globe, label: "Site" },
};

export function FooterAdmin() {
  return (
    <>
      <PageHeader title="Footer / marca-página" description="Título, descrição e links de contato." />
      <LocalOnlyNotice />
      <DocEditor title="Textos" store={r.footer}
        validate={(v) => { const e: Errors = {}; requireText(e, "title", v.title); requireText(e, "description", v.description); return e; }}
        renderForm={(v, set, e) => (<>
          <LocalizedField label="Título" name="title" required value={v.title} errors={e} onChange={(title) => set({ ...v, title })} />
          <LocalizedField label="Descrição" name="description" required multiline value={v.description} errors={e} onChange={(description) => set({ ...v, description })} />
        </>)} />
      <CrudSection title="Links externos" singular="link" store={r.footerLinks} reorderable itemLabel={(l) => l.platform || "link"}
        create={(): FooterLink => ({ id: newId("footer-link"), platform: "", url: "", icon: "globe", active: true })}
        columns={[
          { header: "Plataforma", cell: (l) => { const I = ICONS[l.icon].icon; return <span className="flex items-center gap-2"><I className="h-4 w-4" aria-hidden />{l.platform}</span>; } },
          { header: "Endereço", cell: (l) => <span className="break-all text-xs">{l.url}</span>, className: "hidden md:table-cell" },
          { header: "Estado", cell: (l) => l.active ? <Badge className="border-transparent bg-success text-success-foreground hover:bg-success">Ativo</Badge> : <Badge variant="outline">Inativo</Badge> },
        ]}
        validate={(l) => { const e: Errors = {}; requireField(e, "platform", l.platform); if (!isValidLink(l.url)) e["url"] = "Use https:// ou mailto:."; return e; }}
        renderForm={(l, set, e) => (<>
          <TextField label="Nome da plataforma" required value={l.platform} error={e["platform"]} onChange={(platform) => set({ ...l, platform })} />
          <TextField label="URL ou endereço" required value={l.url} error={e["url"]} hint="Para e-mail use mailto:nome@exemplo.com" onChange={(url) => set({ ...l, url })} />
          <SelectField label="Ícone" value={l.icon} options={FOOTER_ICONS.map((i) => ({ value: i, label: ICONS[i].label }))} onChange={(icon) => set({ ...l, icon })} />
          <div className="flex items-center gap-2"><Switch id="link-active" checked={l.active} onCheckedChange={(active) => set({ ...l, active })} /><Label htmlFor="link-active">Ativo</Label></div>
        </>)} />
    </>
  );
}
