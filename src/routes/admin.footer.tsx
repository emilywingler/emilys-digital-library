import { createFileRoute } from "@tanstack/react-router";
import { adminHead } from "@/admin/components/AdminShell";
import { FooterAdmin } from "@/admin/modules/FooterAdmin";

export const Route = createFileRoute("/admin/footer")({
  head: () => adminHead("Footer"),
  component: FooterAdmin,
});
