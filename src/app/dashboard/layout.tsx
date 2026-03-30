"use client";
// Dashboard layout — Sidebar + Header + Content
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Receipt, Package, Scale, Users, Shield } from "lucide-react";
import { theme } from "@/lib/theme";
import { useApp } from "@/lib/store";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import type { NavItem } from "@/lib/types";

const NAV_BASE: NavItem[] = [
  { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { id: "invoices", label: "Saisie Factures", icon: Receipt },
  { id: "suppliers", label: "Fournisseurs", icon: Package },
  { id: "reconciliation", label: "Rapprochement", icon: Scale },
];

const NAV_PHARMA: NavItem[] = [
  { id: "team", label: "Équipe", icon: Users },
  { id: "audit", label: "Journal", icon: Shield },
];

// Map page IDs to route segments
const pageToRoute: Record<string, string> = {
  dashboard: "/dashboard",
  invoices: "/dashboard/invoices",
  suppliers: "/dashboard/suppliers",
  reconciliation: "/dashboard/reconciliation",
  team: "/dashboard/team",
  audit: "/dashboard/audit",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { auth, isPharma } = useApp();
  const router = useRouter();
  const [mob, setMob] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");

  if (!auth) { router.replace("/login"); return null; }

  const nav = [...NAV_BASE, ...(isPharma ? NAV_PHARMA : [])];

  const handleNav = (pageId: string) => {
    setCurrentPage(pageId);
    const route = pageToRoute[pageId] || "/dashboard";
    router.push(route);
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: theme.bgGrad, overflow: "hidden" }}>
      <div style={{ position: "fixed", inset: 0, background: theme.bgMesh, pointerEvents: "none", zIndex: 0 }} />
      <Sidebar nav={nav} page={currentPage} setPage={handleNav} mob={mob} setMob={setMob} />
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative", zIndex: 1 }}>
        <Header page={currentPage} nav={nav} onMenuClick={() => setMob(!mob)} />
        <div style={{ flex: 1, overflow: "auto", padding: "24px 28px" }} className="fade-up">
          {children}
        </div>
      </main>
    </div>
  );
}
