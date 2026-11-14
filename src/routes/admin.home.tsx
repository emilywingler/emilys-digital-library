import { createFileRoute } from "@tanstack/react-router";
import { adminHead } from "@/admin/components/AdminShell";
import { HomeAdmin } from "@/admin/modules/HomeAdmin";

export const Route = createFileRoute("/admin/home")({
  head: () => adminHead("Home"),
  component: HomeAdmin,
});
