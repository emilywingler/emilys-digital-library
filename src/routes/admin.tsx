import { Outlet, createFileRoute } from "@tanstack/react-router";
import { AdminShell, adminHead } from "@/admin/components/AdminShell";

/** Admin layout (UI only, local mock data). No access control exists yet. */
export const Route = createFileRoute("/admin")({
  head: () => adminHead("Painel"),
  component: AdminLayout,
});

function AdminLayout() {
  return <AdminShell><Outlet /></AdminShell>;
}
