import { createFileRoute } from "@tanstack/react-router";
import { adminHead } from "@/admin/components/AdminShell";
import { AdminLogin } from "@/admin/modules/AdminLogin";

/** Standalone page (no sidebar): un-nested from the /admin layout. */
export const Route = createFileRoute("/admin_/login")({
  head: () => adminHead("Entrar"),
  component: AdminLogin,
});
