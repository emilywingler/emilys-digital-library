import { createFileRoute } from "@tanstack/react-router";
import { adminHead } from "@/admin/components/AdminShell";
import { Dashboard } from "@/admin/modules/Dashboard";

export const Route = createFileRoute("/admin/")({
  head: () => adminHead("Dashboard"),
  component: Dashboard,
});
