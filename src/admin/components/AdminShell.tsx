/** Admin chrome: collapsible sidebar + top bar. Separate from the public site's look. */
import { useEffect, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, Briefcase, FileText, Home, LayoutDashboard, Library, LogOut, Mail, ScrollText } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

export const ADMIN_NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/home", label: "Home", icon: Home },
  { to: "/admin/experiences", label: "Experiências", icon: Briefcase },
  { to: "/admin/skills", label: "Habilidades", icon: Library },
  { to: "/admin/projects", label: "Projetos", icon: BookOpen },
  { to: "/admin/journal", label: "Journal", icon: FileText },
  { to: "/admin/footer", label: "Footer", icon: Mail },
  { to: "/admin/manuscripts", label: "Manuscritos", icon: ScrollText },
] as const;

/** Applies the admin theme to <body> too, so portalled dialogs/toasts match. */
export function useAdminTheme() {
  useEffect(() => {
    document.body.classList.add("admin-theme");
    return () => document.body.classList.remove("admin-theme");
  }, []);
}

export function AdminShell({ children }: { children: ReactNode }) {
  useAdminTheme();
  const path = useRouterState({ select: (s) => s.location.pathname.replace(/\/$/, "") });
  const current = ADMIN_NAV.find((n) => n.to === path)?.label ?? "Admin";
  return (
    <div className="admin-theme min-h-dvh">
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <SidebarHeader className="px-3 py-4">
            <span className="truncate text-sm font-semibold group-data-[collapsible=icon]:hidden">The Wingler Archive · Admin</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Conteúdo</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {ADMIN_NAV.map((n) => (
                    <SidebarMenuItem key={n.to}>
                      <SidebarMenuButton asChild isActive={path === n.to} tooltip={n.label}>
                        <Link to={n.to}><n.icon className="h-4 w-4" /><span>{n.label}</span></Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                {/* Visual only: there is no session to end yet. */}
                <SidebarMenuButton asChild tooltip="Sair">
                  <Link to="/admin/login"><LogOut className="h-4 w-4" /><span>Sair</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <div className="flex min-w-0 flex-1 flex-col bg-background">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b bg-card px-4">
            <SidebarTrigger aria-label="Alternar menu lateral" />
            <span className="text-sm font-medium text-muted-foreground">{current}</span>
          </header>
          <main className="mx-auto w-full max-w-6xl flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </SidebarProvider>
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}

export const adminHead = (title: string) => ({
  meta: [
    { title: `${title} · Admin · The Wingler Archive` },
    { name: "description", content: `Painel administrativo (demonstração): ${title}.` },
    { name: "robots", content: "noindex, nofollow" },
    { property: "og:title", content: `${title} · Admin` },
    { property: "og:description", content: "Painel administrativo de demonstração." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ],
});
