"use client";
// ══════════════════════════════════════════
// SaFarma — Dashboard (Tableau de bord)
// ══════════════════════════════════════════
import { useMemo } from "react";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import { Wallet, Banknote, BadgeCheck, AlertTriangle, BarChart3, Target, CalendarCheck, Receipt } from "lucide-react";
import { theme, glassCard, MONTHS_SHORT, MONTHS_FULL } from "@/lib/theme";
import { useApp } from "@/lib/store";
import { fmt, fmtShort } from "@/lib/utils";
import { Badge, GlassTooltip } from "@/components/ui";

export default function DashboardPage() {
  const { invoices, suppliers, settlements } = useApp();

  const totalOwed = settlements.filter(s => !s.paid).reduce((a, s) => a + s.supplierTotal, 0);
  const totalPaid = settlements.filter(s => s.paid).reduce((a, s) => a + s.supplierTotal, 0);
  const disputes = settlements.filter(s => s.status === "ecart").length;
  const unpaidMonths = settlements.filter(s => !s.paid).length;

  const monthlyData = useMemo(() => {
    const d: Record<number, { name: string; total: number }> = {};
    invoices.forEach(inv => {
      const m = new Date(inv.date).getMonth();
      if (!d[m]) d[m] = { name: MONTHS_SHORT[m], total: 0 };
      d[m].total += inv.amount;
    });
    return Object.values(d).sort((a, b) => MONTHS_SHORT.indexOf(a.name) - MONTHS_SHORT.indexOf(b.name));
  }, [invoices]);

  const supplierData = useMemo(() =>
    suppliers.map(s => ({
      name: s.name,
      value: invoices.filter(i => i.supplierId === s.id).reduce((sum, i) => sum + i.amount, 0),
      color: s.color,
    })).filter(d => d.value > 0), [invoices, suppliers]);

  const currentMonth = new Date().getMonth() + 1;
  const supplierStatus = suppliers.map(s => {
    const myTotal = invoices.filter(i => i.supplierId === s.id && new Date(i.date).getMonth() + 1 === currentMonth).reduce((a, b) => a + b.amount, 0);
    const invoiceCount = invoices.filter(i => i.supplierId === s.id && new Date(i.date).getMonth() + 1 === currentMonth).length;
    const settlement = settlements.find(st => st.supplierId === s.id && st.month === currentMonth && st.year === 2025);
    return { ...s, myTotal, invoiceCount, settlement };
  }).filter(s => s.myTotal > 0);

  const stats = [
    { label: "Factures saisies", value: String(invoices.length), sub: "toutes périodes", icon: Receipt, color: theme.emerald, bg: theme.emeraldSoft },
    { label: "Reste à payer", value: fmt(totalOwed), sub: `${unpaidMonths} mois en cours`, icon: Banknote, color: theme.amber, bg: theme.amberSoft },
    { label: "Déjà réglé", value: fmt(totalPaid), sub: "total payé", icon: BadgeCheck, color: theme.blue, bg: theme.blueSoft },
    { label: "Écarts détectés", value: String(disputes), sub: "à vérifier", icon: AlertTriangle, color: theme.rose, bg: theme.roseSoft },
  ];

  return (
    <div>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 14, marginBottom: 22 }}>
        {stats.map((s, i) => (
          <div key={i} className="glass-hover" style={{ ...glassCard, padding: "20px", cursor: "default", animation: `fadeUp .5s cubic-bezier(.16,1,.3,1) ${i * 80}ms both` }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: 12, color: theme.textDim, fontWeight: 500, marginBottom: 8 }}>{s.label}</p>
                <p style={{ fontSize: 24, fontWeight: 800, color: theme.text, letterSpacing: -0.5 }}>{s.value}</p>
                <p style={{ fontSize: 12, color: s.color, fontWeight: 600, marginTop: 4 }}>{s.sub}</p>
              </div>
              <div style={{ width: 44, height: 44, background: s.bg, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${s.color}20` }}>
                <s.icon size={20} color={s.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 16, marginBottom: 22 }}>
        <div style={{ ...glassCard, padding: "22px" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: theme.text, marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
            <BarChart3 size={17} color={theme.emerald} /> Achats mensuels
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={monthlyData}>
              <defs><linearGradient id="aG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={theme.emerald} stopOpacity={.3} /><stop offset="100%" stopColor={theme.emerald} stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: theme.textDim }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: theme.textDim }} axisLine={false} tickLine={false} tickFormatter={fmtShort} />
              <Tooltip content={({ active, payload, label }) => active && payload?.[0] ? <GlassTooltip label={label as string} value={fmt(payload[0].value as number)} color={theme.emerald} /> : null} />
              <Area type="monotone" dataKey="total" stroke={theme.emerald} strokeWidth={2.5} fill="url(#aG)" dot={{ r: 4, fill: theme.emerald, stroke: theme.bg, strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={{ ...glassCard, padding: "22px" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: theme.text, marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
            <Target size={17} color={theme.blue} /> Par fournisseur
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={supplierData} cx="50%" cy="50%" innerRadius={55} outerRadius={88} paddingAngle={4} dataKey="value" stroke="none">
                {supplierData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip content={({ active, payload }) => active && payload?.[0] ? <GlassTooltip label={payload[0].name as string} value={fmt(payload[0].value as number)} color={(payload[0].payload as any).color} /> : null} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 8 }}>
            {supplierData.map((d, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: theme.textMuted }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: d.color }} />{d.name}</div>)}
          </div>
        </div>
      </div>

      {/* Current month supplier overview */}
      <div style={{ ...glassCard, padding: "22px" }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: theme.text, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <CalendarCheck size={17} color={theme.violet} /> Situation du mois en cours
        </h3>
        <p style={{ fontSize: 12, color: theme.textDim, marginBottom: 14 }}>Vos totaux par fournisseur pour {MONTHS_FULL[currentMonth - 1]}. Fin du mois → aller dans Rapprochement.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 12 }}>
          {supplierStatus.map(s => (
            <div key={s.id} style={{ ...glassCard, padding: "16px", background: theme.glass2 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.color, boxShadow: `0 0 8px ${s.color}50` }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>{s.name}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <p style={{ fontSize: 11, color: theme.textDim }}>Mon total ({s.invoiceCount} factures)</p>
                  <p style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{fmt(s.myTotal)}</p>
                </div>
                {s.settlement ? <Badge status={s.settlement.status} /> : (
                  <span style={{ fontSize: 11, color: theme.textDim, background: theme.glass2, padding: "4px 10px", borderRadius: 8, border: `1px solid ${theme.glassBorder}` }}>En attente</span>
                )}
              </div>
            </div>
          ))}
          {supplierStatus.length === 0 && <p style={{ color: theme.textDim, fontSize: 13, gridColumn: "1/-1", textAlign: "center", padding: 20 }}>Aucune facture ce mois</p>}
        </div>
      </div>
    </div>
  );
}
