/** Small shared admin pieces: headers, badges, empty states, reorder buttons. */
import type { ReactNode } from "react";
import { ArrowDown, ArrowUp, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PublishStatus } from "../types";

export function PageHeader({ title, description, actions }: { title: string; description?: string | undefined; actions?: ReactNode | undefined }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function StatusBadge({ status }: { status: PublishStatus }) {
  return status === "published"
    ? <Badge className="border-transparent bg-success text-success-foreground hover:bg-success">Publicado</Badge>
    : <Badge variant="outline" className="border-warning text-foreground">Rascunho</Badge>;
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode | undefined }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-md border border-dashed p-8 text-center">
      <Inbox className="h-6 w-6 text-muted-foreground" aria-hidden />
      <p className="text-sm font-medium">{title}</p>
      {children && <div className="text-sm text-muted-foreground">{children}</div>}
    </div>
  );
}

export function ReorderButtons({ label, onUp, onDown, first, last, disabled }: { label: string; onUp: () => void; onDown: () => void; first: boolean; last: boolean; disabled?: boolean | undefined }) {
  return (
    <div className="flex gap-1">
      <Button type="button" size="icon" variant="ghost" className="h-8 w-8" disabled={first || disabled} onClick={onUp} aria-label={`Mover ${label} para cima`}><ArrowUp className="h-4 w-4" /></Button>
      <Button type="button" size="icon" variant="ghost" className="h-8 w-8" disabled={last || disabled} onClick={onDown} aria-label={`Mover ${label} para baixo`}><ArrowDown className="h-4 w-4" /></Button>
    </div>
  );
}

/** Reminder shown on every module: nothing here reaches the public site. */
export function LocalOnlyNotice() {
  return (
    <p className="mb-4 rounded-md border border-info/40 bg-info/10 px-3 py-2 text-xs text-foreground">
      Modo de demonstração: as alterações ficam apenas nesta aba, são perdidas ao recarregar e não alteram o portfólio público.
      “Publicado” e “Rascunho” são apenas rótulos administrativos.
    </p>
  );
}

/** Moves an item inside a local array (for nested lists in forms). */
export function moveInArray<T>(list: T[], index: number, dir: -1 | 1): T[] {
  const to = index + dir;
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  [next[index], next[to]] = [next[to]!, next[index]!];
  return next;
}
