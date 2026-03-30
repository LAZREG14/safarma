"use client";
// ══════════════════════════════════════════
// SaFarma — Header
// ══════════════════════════════════════════

import { Menu, Bell, Sparkles } from "lucide-react";
import { theme, glassCard } from "@/lib/theme";
import type { NavItem } from "@/lib/types";

interface HeaderProps {
  page: string;
  nav: NavItem[];
  onMenuClick: () => void;
}

export function Header({ page, nav, onMenuClick }: HeaderProps) {
  return (
    <header
      style={{
        ...glassCard,
        borderRadius: 0, borderTop: "none", borderLeft: "none", borderRight: "none",
        padding: "14px 28px", display: "flex", alignItems: "center", gap: 16, flexShrink: 0,
        background: "rgba(10,10,15,0.6)", backdropFilter: "blur(60px) saturate(180%)",
      }}
    >
      <button
        onClick={onMenuClick}
        style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: typeof window !== "undefined" && window.innerWidth >= 768 ? "none" : "flex" }}
      >
        <Menu size={22} color={theme.textMuted} />
      </button>
      <div style={{ flex: 1 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: theme.text, letterSpacing: -0.3 }}>
          {nav.find((n) => n.id === page)?.label || ""}
        </h2>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ position: "relative", ...glassCard, borderRadius: 10, padding: "8px 10px", cursor: "pointer" }}>
          <Bell size={17} color={theme.textMuted} />
          <div style={{ position: "absolute", top: 6, right: 7, width: 7, height: 7, background: theme.rose, borderRadius: "50%", border: "2px solid rgba(10,10,15,0.8)" }} />
        </div>
        <div style={{ ...glassCard, borderRadius: 10, padding: "6px 12px", display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
          <Sparkles size={13} color={theme.amber} />
          <span style={{ fontWeight: 600, color: theme.amber }}>PRO</span>
        </div>
      </div>
    </header>
  );
}
