import { createFileRoute } from "@tanstack/react-router";
import { adminHead } from "@/admin/components/AdminShell";
import { SkillsAdmin } from "@/admin/modules/SkillsAdmin";

export const Route = createFileRoute("/admin/skills")({
  head: () => adminHead("Habilidades"),
  component: SkillsAdmin,
});
