import { createFileRoute } from "@tanstack/react-router";
import { adminHead } from "@/admin/components/AdminShell";
import { ManuscriptsAdmin } from "@/admin/modules/ManuscriptsAdmin";

export const Route = createFileRoute("/admin/manuscripts")({
  head: () => adminHead("Manuscritos"),
  component: ManuscriptsAdmin,
});
