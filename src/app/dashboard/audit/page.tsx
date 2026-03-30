"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { theme, glassCard, auditColors } from "@/lib/theme";
import { useApp } from "@/lib/store";

export default function AuditPage() {
  const { logs } = useApp();
  const [search, setSearch] = useState("");
  const filtered = logs.filter(l => l.action?.toLowerCase().includes(search.toLowerCase()) || l.details?.toLowerCase().includes(search.toLowerCase()) || l.userName?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
          <Search size={16} color={theme.textDim} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
          <input className="input-glass" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 40 }} />
        </div>
        <span style={{ fontSize: 13, color: theme.textDim }}>{filtered.length} entrée(s)</span>
      </div>
      <div style={{ ...glassCard, overflow: "hidden" }}>
        {filtered.slice(0, 80).map(l => (
          <div key={l.id} style={{ padding: "14px 20px", borderBottom: `1px solid ${theme.glassBorder}`, display: "flex", alignItems: "flex-start", gap: 14 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: auditColors[l.action] || theme.textDim, marginTop: 6, flexShrink: 0, boxShadow: `0 0 6px ${auditColors[l.action] || theme.textDim}40` }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
                <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, background: `${auditColors[l.action] || theme.textDim}18`, color: auditColors[l.action] || theme.text, letterSpacing: .3 }}>{l.action}</span>
                <span style={{ fontSize: 12, color: theme.textDim }}>{l.userName}</span>
              </div>
              <p style={{ fontSize: 13, color: theme.textSoft }}>{l.details}</p>
              <p style={{ fontSize: 11, color: theme.textDim, marginTop: 3 }}>{new Date(l.ts).toLocaleString("fr-FR")}</p>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ padding: 40, textAlign: "center", color: theme.textDim }}>Aucune entrée</div>}
      </div>
    </div>
  );
}
