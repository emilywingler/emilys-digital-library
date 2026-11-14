import { createFileRoute } from "@tanstack/react-router";
import { adminHead } from "@/admin/components/AdminShell";
import { ProjectsAdmin } from "@/admin/modules/ProjectsAdmin";

export const Route = createFileRoute("/admin/projects")({
  head: () => adminHead("Projetos"),
  component: ProjectsAdmin,
});
