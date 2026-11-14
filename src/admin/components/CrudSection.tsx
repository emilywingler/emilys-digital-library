/**
 * Generic list + create/edit dialog + confirmed delete, used by every module
 * so equivalent operations look and behave the same everywhere.
 */
import { useState, type ReactNode } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useCollection } from "../data/repository";
import type { CollectionStore } from "../data/store";
import type { Entity } from "../types";
import type { Errors } from "../validation";
import { EmptyState, ReorderButtons } from "./bits";
import { ConfirmDelete } from "./ConfirmDelete";
import { useAction } from "./useAction";

export interface Column<T> { header: string; cell: (item: T, index: number) => ReactNode; className?: string | undefined }

export interface CrudSectionProps<T extends Entity> {
  title: string;
  description?: string | undefined;
  /** Noun for buttons/toasts, e["g"]. "experiência". */
  singular: string;
  store: CollectionStore<T>;
  /** Optional filter of the store's items (e["g"]. by parent). */
  filter?: ((item: T) => boolean) | undefined;
  columns: Column<NoInfer<T>>[];
  /** Name shown in confirmations and aria labels. */
  itemLabel: (item: T) => string;
  /** Absent = records cannot be created (fixed sets). */
  create?: (() => NoInfer<T>) | undefined;
  canDelete?: boolean | undefined;
  reorderable?: boolean | undefined;
  validate: (draft: NoInfer<T>) => Errors;
  renderForm: (draft: NoInfer<T>, set: (next: NoInfer<T>) => void, errors: Errors) => ReactNode;
  /** Extra content inside the delete confirmation. */
  deleteDetails?: ((item: T) => ReactNode) | undefined;
  /** Return a message to block the deletion. */
  deleteBlocked?: ((item: T) => string | null) | undefined;
  /** Custom delete (e["g"]. cascade); defaults to `store.remove`. */
  onDelete?: ((item: T) => Promise<void>) | undefined;
  emptyHint?: ReactNode | undefined;
  wide?: boolean | undefined;
}

export function CrudSection<T extends Entity>(props: CrudSectionProps<T>) {
  const { title, description, singular, store, filter, columns, itemLabel, create, canDelete = true, reorderable, validate, renderForm, deleteDetails, deleteBlocked, onDelete, emptyHint, wide } = props;
  const all = useCollection(store);
  const items = filter ? all.filter(filter) : all;
  const [editing, setEditing] = useState<{ draft: T; isNew: boolean } | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [deleting, setDeleting] = useState<T | null>(null);
  const save = useAction();
  const del = useAction();
  const move = useAction();

  const open = (draft: T, isNew: boolean) => { setErrors({}); setEditing({ draft: structuredClone(draft), isNew }); };
  const submit = async () => {
    if (!editing) return;
    const errs = validate(editing.draft);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const ok = await save.run(() => store.save(editing.draft), editing.isNew ? `${cap(singular)} criado(a).` : "Alterações salvas localmente.");
    if (ok) setEditing(null);
  };
  const confirmDelete = async () => {
    if (!deleting) return;
    const ok = await del.run(() => (onDelete ? onDelete(deleting) : store.remove(deleting.id)), `${cap(singular)} excluído(a).`);
    if (ok) setDeleting(null);
  };
  const blocked = deleting && deleteBlocked ? deleteBlocked(deleting) : null;
  const errorCount = Object.keys(errors).length;

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 space-y-0">
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {create && <Button size="sm" onClick={() => open(create(), true)}><Plus className="mr-1 h-4 w-4" />Adicionar {singular}</Button>}
      </CardHeader>
      <CardContent>
        {items.length === 0 ? <EmptyState title={`Nenhum(a) ${singular} cadastrado(a).`}>{emptyHint}</EmptyState> : (
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {reorderable && <TableHead className="w-12">Nº</TableHead>}
                  {columns.map((c) => <TableHead key={c.header} className={c.className}>{c.header}</TableHead>)}
                  <TableHead className="w-px text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, i) => (
                  <TableRow key={item.id}>
                    {reorderable && <TableCell className="tabular-nums text-muted-foreground">{i + 1}</TableCell>}
                    {columns.map((c) => <TableCell key={c.header} className={c.className}>{c.cell(item, i)}</TableCell>)}
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        {reorderable && <ReorderButtons label={itemLabel(item)} first={i === 0} last={i === items.length - 1} disabled={move.pending}
                          onUp={() => move.run(() => store.move(item.id, -1, filter), "Ordem atualizada.")}
                          onDown={() => move.run(() => store.move(item.id, 1, filter), "Ordem atualizada.")} />}
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => open(item, false)} aria-label={`Editar ${itemLabel(item)}`}><Pencil className="h-4 w-4" /></Button>
                        {canDelete && <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleting(item)} aria-label={`Excluir ${itemLabel(item)}`}><Trash2 className="h-4 w-4" /></Button>}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={!!editing} onOpenChange={(o) => !o && !save.pending && setEditing(null)}>
        <DialogContent className={cn("max-h-[90dvh] overflow-y-auto", wide ? "sm:max-w-4xl" : "sm:max-w-2xl")}>
          <DialogHeader>
            <DialogTitle>{editing?.isNew ? `Adicionar ${singular}` : `Editar ${singular}`}</DialogTitle>
            <DialogDescription>Campos com * são obrigatórios. As alterações ficam apenas nesta sessão.</DialogDescription>
          </DialogHeader>
          {editing && (
            <form id="crud-form" className="space-y-4" noValidate onSubmit={(e) => { e.preventDefault(); void submit(); }}>
              {renderForm(editing.draft, (draft) => setEditing({ ...editing, draft }), errors)}
            </form>
          )}
          {errorCount > 0 && <p role="alert" className="text-sm text-destructive">Corrija {errorCount} campo(s) destacado(s) antes de salvar.</p>}
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" disabled={save.pending} onClick={() => setEditing(null)}>Cancelar</Button>
            <Button type="submit" form="crud-form" disabled={save.pending}>{save.pending ? "Salvando…" : "Salvar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDelete open={!!deleting} onOpenChange={(o) => !o && !del.pending && setDeleting(null)}
        title={`Excluir ${singular}?`} pending={del.pending}
        description={blocked ?? `“${deleting ? itemLabel(deleting) : ""}” será removido(a) desta sessão.`}
        onConfirm={blocked ? () => setDeleting(null) : confirmDelete} confirmLabel={blocked ? "Entendi" : "Excluir"}>
        {!blocked && deleting && deleteDetails?.(deleting)}
      </ConfirmDelete>
    </Card>
  );
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
