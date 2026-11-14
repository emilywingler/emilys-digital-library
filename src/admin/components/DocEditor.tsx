import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDoc } from "../data/repository";
import type { DocStore } from "../data/store";
import type { Errors } from "../validation";
import { useAction } from "./useAction";

interface Props<T> { title: string; description?: string | undefined; store: DocStore<T>; validate: (v: T) => Errors; renderForm: (v: T, set: (v: T) => void, errors: Errors) => ReactNode }
/** Edits a single settings record (Home, Footer) with save/discard. */
export function DocEditor<T>({ title, description, store, validate, renderForm }: Props<T>) {
  const saved = useDoc(store);
  const [draft, setDraft] = useState<T>(() => structuredClone(saved));
  const [errors, setErrors] = useState<Errors>({});
  const { pending, run } = useAction();
  useEffect(() => setDraft(structuredClone(saved)), [saved]);
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
  const submit = async () => {
    const e = validate(draft);
    setErrors(e);
    if (!Object.keys(e).length) await run(() => store.update(draft), "Alterações salvas localmente.");
  };
  return (
    <Card className="mb-6">
      <CardHeader><CardTitle className="text-lg">{title}</CardTitle>{description && <CardDescription>{description}</CardDescription>}</CardHeader>
      <CardContent>
        <form className="space-y-4" noValidate onSubmit={(e) => { e.preventDefault(); void submit(); }}>
          {renderForm(draft, setDraft, errors)}
          {Object.keys(errors).length > 0 && <p role="alert" className="text-sm text-destructive">Corrija os campos destacados antes de salvar.</p>}
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={pending || !dirty}>{pending ? "Salvando…" : "Salvar"}</Button>
            <Button type="button" variant="outline" disabled={pending || !dirty} onClick={() => { setDraft(structuredClone(saved)); setErrors({}); }}>Descartar alterações</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
