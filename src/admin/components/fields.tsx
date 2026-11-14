/** Reusable admin form fields. Every field shows its validation message inline. */
import { useId, useState, type ReactNode } from "react";
import { ImageOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { LocalizedText } from "@/types/content";
import type { Errors } from "../validation";

interface FieldShellProps { label: string; error?: string | undefined; hint?: string | undefined; required?: boolean | undefined; children: (id: string, describedBy?: string) => ReactNode }
export function FieldShell({ label, error, hint, required, children }: FieldShellProps) {
  const id = useId();
  const msgId = `${id}-msg`;
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}{required && <span className="text-destructive" aria-hidden> *</span>}
      </Label>
      {children(id, error || hint ? msgId : undefined)}
      {error ? <p id={msgId} className="text-xs text-destructive">{error}</p>
        : hint ? <p id={msgId} className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

interface TextFieldProps { label: string; value: string; onChange: (v: string) => void; error?: string | undefined; hint?: string | undefined; required?: boolean | undefined; multiline?: boolean | undefined; type?: string | undefined; placeholder?: string | undefined }
export function TextField({ label, value, onChange, error, hint, required, multiline, type = "text", placeholder }: TextFieldProps) {
  return (
    <FieldShell label={label} error={error} hint={hint} required={required}>
      {(id, d) => multiline
        ? <Textarea id={id} aria-describedby={d} aria-invalid={!!error} value={value} placeholder={placeholder} rows={4} onChange={(e) => onChange(e.target.value)} />
        : <Input id={id} aria-describedby={d} aria-invalid={!!error} type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />}
    </FieldShell>
  );
}

interface LocalizedFieldProps { label: string; name: string; value: LocalizedText; onChange: (v: LocalizedText) => void; errors?: Errors | undefined; required?: boolean | undefined; multiline?: boolean | undefined }
/** A PT-BR / EN pair, side by side on wide screens. */
export function LocalizedField({ label, name, value, onChange, errors = {}, required, multiline }: LocalizedFieldProps) {
  return (
    <fieldset className="grid gap-3 sm:grid-cols-2">
      <legend className="sr-only">{label}</legend>
      <TextField label={`${label} (PT-BR)`} value={value.pt} required={required} multiline={multiline} error={errors[`${name}.pt`]} onChange={(pt) => onChange({ ...value, pt })} />
      <TextField label={`${label} (EN)`} value={value.en} required={required} multiline={multiline} error={errors[`${name}.en`]} onChange={(en) => onChange({ ...value, en })} />
    </fieldset>
  );
}

/** File reference (path or URL) with a live preview. No upload happens here. */
export function ImagePathField({ label, value, onChange, error, required }: { label: string; value: string; onChange: (v: string) => void; error?: string | undefined; required?: boolean | undefined }) {
  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_7rem] sm:items-start">
      <TextField label={label} value={value} onChange={onChange} error={error} required={required} hint="Caminho ou URL do arquivo (sem upload nesta etapa)." />
      <ImagePreview src={value} alt={`Pré-visualização: ${label}`} />
    </div>
  );
}

export function ImagePreview({ src, alt, className = "h-28 w-28" }: { src: string; alt: string; className?: string | undefined }) {
  const [failed, setFailed] = useState<string | null>(null);
  const broken = !src || failed === src;
  return (
    <div className={`${className} flex shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted`}>
      {broken ? <ImageOff className="h-5 w-5 text-muted-foreground" aria-label="Sem pré-visualização" />
        : <img src={src} alt={alt} className="h-full w-full object-contain" onError={() => setFailed(src)} />}
    </div>
  );
}

interface SelectFieldProps<V extends string> { label: string; value: V; options: { value: V; label: string }[]; onChange: (v: V) => void; error?: string | undefined; required?: boolean | undefined }
/** Native select: keyboard- and mobile-friendly with no extra wiring. */
export function SelectField<V extends string>({ label, value, options, onChange, error, required }: SelectFieldProps<V>) {
  return (
    <FieldShell label={label} error={error} required={required}>
      {(id, d) => (
        <select id={id} aria-describedby={d} aria-invalid={!!error} value={value} onChange={(e) => onChange(e.target.value as V)}
          className="flex h-9 w-full rounded-md border border-input bg-card px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      )}
    </FieldShell>
  );
}
