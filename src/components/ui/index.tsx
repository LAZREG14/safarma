"use client";
// ══════════════════════════════════════════
// SaFarma — Composants UI réutilisables
// ══════════════════════════════════════════
// Badge, Modal, Label, GlassTooltip
// Pour modifier l'apparence globale des composants,
// c'est ici qu'il faut intervenir.

import { X, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import { theme, glassElevated } from "@/lib/theme";

// ─── Status Badge ───
export function Badge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string; border: string; label: string; Icon: typeof CheckCircle2 }> = {
    ok:       { bg: `${theme.emerald}18`, color: theme.emerald, border: `${theme.emerald}25`, label: "Conforme", Icon: CheckCircle2 },
    conforme: { bg: `${theme.emerald}18`, color: theme.emerald, border: `${theme.emerald}25`, label: "Conforme", Icon: CheckCircle2 },
    ecart:    { bg: `${theme.rose}18`,    color: theme.rose,    border: `${theme.rose}25`,    label: "Écart",    Icon: XCircle },
  };
  const s = map[status] || map.ecart;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      <s.Icon size={12} /> {s.label}
    </span>
  );
}

// ─── Modal ───
export function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20 }}
    >
      <div style={{ ...glassElevated, padding: "28px", width: "100%", maxWidth: 500, maxHeight: "85vh", overflowY: "auto", animation: "fadeUp .3s cubic-bezier(.16,1,.3,1)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: theme.text }}>{title}</h3>
          <button onClick={onClose} style={{ background: theme.glass2, border: `1px solid ${theme.glassBorder}`, borderRadius: 8, cursor: "pointer", padding: 6, display: "flex" }}>
            <X size={16} color={theme.textMuted} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Label ───
export function Label({ children }: { children: React.ReactNode }) {
  return (
    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: theme.textMuted, marginBottom: 6, letterSpacing: 0.3 }}>
      {children}
    </label>
  );
}

// ─── Glass Tooltip (recharts) ───
export function GlassTooltip({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ ...glassElevated, padding: "10px 14px", borderRadius: 12, fontSize: 13 }}>
      <p style={{ color: theme.text, fontWeight: 600, marginBottom: 4 }}>{label}</p>
      <p style={{ color, fontWeight: 700 }}>{value}</p>
    </div>
  );
}
