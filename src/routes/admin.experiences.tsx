import { createFileRoute } from "@tanstack/react-router";
import { adminHead } from "@/admin/components/AdminShell";
import { ExperiencesAdmin } from "@/admin/modules/ExperiencesAdmin";

export const Route = createFileRoute("/admin/experiences")({
  head: () => adminHead("Experiências"),
  component: ExperiencesAdmin,
});
