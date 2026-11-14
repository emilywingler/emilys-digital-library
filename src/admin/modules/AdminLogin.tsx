/**
 * DEMO LOGIN — visual only. There is no authentication: credentials are never
 * sent or stored, and "success" simply opens the dashboard. Replace `fakeCheck`
 * with a real sign-in call when a backend exists.
 */
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TextField } from "../components/fields";
import { useAdminTheme } from "../components/AdminShell";

type State = "idle" | "loading" | "error" | "success";
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function AdminLogin() {
  useAdminTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");

  const submit = async () => {
    // Only shape checks: this is not authentication.
    if (!EMAIL.test(email) || !password) {
      setState("error");
      setMessage(!EMAIL.test(email) ? "Informe um e-mail válido." : "Informe a senha.");
      return;
    }
    setState("loading");
    await new Promise((r) => setTimeout(r, 700));
    setPassword("");
    setState("success");
    setMessage("Interface de demonstração: abrindo o painel…");
    setTimeout(() => void navigate({ to: "/admin" }), 600);
  };

  return (
    <div className="admin-theme flex min-h-dvh items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">The Wingler Archive · Admin</CardTitle>
          <CardDescription>Entre para gerenciar o conteúdo.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 flex gap-2 rounded-md border border-info/40 bg-info/10 p-2 text-xs">
            <Info className="h-4 w-4 shrink-0" aria-hidden />
            Tela demonstrativa: não há autenticação real e nenhuma senha é enviada ou armazenada.
          </p>
          <form className="space-y-4" noValidate onSubmit={(e) => { e.preventDefault(); void submit(); }}>
            <TextField label="E-mail" type="email" value={email} onChange={setEmail} required />
            <TextField label="Senha" type="password" value={password} onChange={setPassword} required />
            <div aria-live="polite">
              {state === "error" && <p className="flex items-center gap-2 text-sm text-destructive"><AlertCircle className="h-4 w-4" />{message}</p>}
              {state === "success" && <p className="flex items-center gap-2 text-sm text-success"><CheckCircle2 className="h-4 w-4" />{message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={state === "loading" || state === "success"}>
              {state === "loading" ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Entrando…</> : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
