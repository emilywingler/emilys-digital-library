import { createFileRoute } from "@tanstack/react-router";
import { adminHead } from "@/admin/components/AdminShell";
import { JournalAdmin } from "@/admin/modules/JournalAdmin";

export const Route = createFileRoute("/admin/journal")({
  head: () => adminHead("Journal"),
  component: JournalAdmin,
});
