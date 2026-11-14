import { useCallback, useState } from "react";
import { toast } from "sonner";

/** Runs an async store mutation with a pending flag and success/error toasts. */
export function useAction() {
  const [pending, setPending] = useState(false);
  const run = useCallback(async (fn: () => Promise<unknown>, success: string) => {
    setPending(true);
    try { await fn(); toast.success(success); return true; }
    catch (e) { toast.error(e instanceof Error ? e.message : "Não foi possível concluir a operação."); return false; }
    finally { setPending(false); }
  }, []);
  return { pending, run };
}
