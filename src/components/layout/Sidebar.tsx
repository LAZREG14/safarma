"use client";
// ══════════════════════════════════════════
// SaFarma — Sidebar
// ══════════════════════════════════════════

import { Pill, LogOut, Crown, UserCheck } from "lucide-react";
import { theme } from "@/lib/theme";
import { useApp } from "@/lib/store";
import type { NavItem } from "@/lib/types";

interface SidebarProps {
  nav: NavItem[];
  page: string;
  setPage: (page: string) => void;
  mob: boolean;
  setMob: (open: boolean) => void;
}

export function Sidebar({ nav, page, setPage, mob, setMob }: SidebarProps) {
  const { auth, logout, isPharma } = useApp();

  return (
    <>
      <aside
        style={{
          width: 260,
          background: theme.sidebar,
          backdropFilter: "blur(80px) saturate(200%)",
          WebkitBackdropFilter: "blur(80px) saturate(200%)",
          borderRight: `1px solid ${theme.glassBorder}`,
          display: "flex",
          flexDirection: "column",
          position: typeof window !== "undefined" && window.innerWidth < 768 ? "fixed" : "relative",
          zIndex: 60,
          height: "100vh",
          transform: typeof window !== "undefined" && window.innerWidth < 768 && !mob ? "translateX(-100%)" : "none",
          transition: "transform .35s cubic-bezier(.4,0,.2,1)",
        }}
      >
        {/* Logo */}
        <div style={{ padding: "24px 20px 20px", borderBottom: `1px solid ${theme.glassBorder}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 44, height: 44,
                background: `linear-gradient(135deg, ${theme.emerald}, ${theme.blue})`,
                borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 4px 16px ${theme.emerald}30`,
              }}
            >
              <Pill size={22} color="#fff" strokeWidth={2.5} />
            </div>
            <div>
              <h1 style={{ color: theme.text, fontSize: 18, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1 }}>SaFarma</h1>
              <p style={{ color: theme.textDim, fontSize: 11, fontWeight: 500, marginTop: 3 }}>Gestion Intelligente</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "14px 10px", overflowY: "auto" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: theme.textDim, letterSpacing: 1.5, padding: "8px 14px 6px", textTransform: "uppercase" }}>
            Menu
          </div>
          {nav.map((item) => {
            const active = page === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => { setPage(item.id); setMob(false); }}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 11, padding: "10px 14px",
                  background: active ? theme.sidebarActive : "transparent",
                  color: active ? theme.emerald : theme.textMuted,
                  border: active ? `1px solid ${theme.emerald}20` : "1px solid transparent",
                  borderRadius: 12, cursor: "pointer", fontSize: 13.5,
                  fontWeight: active ? 600 : 450, transition: "all .25s", marginBottom: 2, textAlign: "left",
                }}
              >
                <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
                {item.label}
                {active && (
                  <div style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: theme.emerald, boxShadow: `0 0 8px ${theme.emerald}` }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* User profile */}
        <div style={{ padding: "14px", borderTop: `1px solid ${theme.glassBorder}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div
              style={{
                width: 38, height: 38,
                background: `linear-gradient(135deg, ${theme.emerald}30, ${theme.blue}30)`,
                borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                color: theme.emerald, fontWeight: 700, fontSize: 14, border: `1px solid ${theme.emerald}20`,
              }}
            >
              {auth?.name.charAt(0)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: theme.text, fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{auth?.name}</p>
              <p style={{ color: theme.textDim, fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
                {isPharma ? <Crown size={10} color={theme.amber} /> : <UserCheck size={10} />}
                {isPharma ? "Pharmacien" : "Assistant"}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
              padding: "9px", background: theme.roseSoft, color: theme.rose,
              border: `1px solid ${theme.rose}20`, borderRadius: 10, cursor: "pointer", fontSize: 12.5, fontWeight: 600,
            }}
          >
            <LogOut size={14} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mob && typeof window !== "undefined" && window.innerWidth < 768 && (
        <div
          onClick={() => setMob(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 55 }}
        />
      )}
    </>
  );
}
