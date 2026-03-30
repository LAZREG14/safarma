"use client";
import { useState, useMemo, useEffect } from "react";
import { Scale, CheckCircle2, XCircle, Banknote, BadgeCheck, FileText, ClipboardList } from "lucide-react";
import { theme, glassCard, glassElevated, MONTHS_FULL } from "@/lib/theme";
import { useApp } from "@/lib/store";
import { uid, fmt, fmtDate } from "@/lib/utils";
import { Badge, Label } from "@/components/ui";

export default function ReconciliationPage() {
  const { invoices, suppliers, settlements, setSettlements, addLog, isPharma } = useApp();
  const [selSup, setSelSup] = useState(suppliers[0]?.id || "");
  const [selMonth, setSelMonth] = useState(new Date().getMonth() + 1);
  const [selYear, setSelYear] = useState(2025);
  const [supAmount, setSupAmount] = useState("");

  const curInvs = useMemo(() => invoices.filter(inv => {
    const d = new Date(inv.date);
    return inv.supplierId === selSup && (d.getMonth() + 1) === selMonth && d.getFullYear() === selYear;
  }), [invoices, selSup, selMonth, selYear]);

  const myTotal = curInvs.reduce((s, i) => s + i.amount, 0);
  const supVal = parseFloat(supAmount) || 0;
  const diff = Math.abs(myTotal - supVal);
  const isOk = diff < 1;
  const hasInput = supAmount !== "";
  const existing = settlements.find(s => s.supplierId === selSup && s.month === selMonth && s.year === selYear);

  useEffect(() => { if (existing) setSupAmount(String(existing.supplierTotal)); else setSupAmount(""); }, [selSup, selMonth, selYear, existing]);

  const doCompare = () => {
    if (!supAmount || isNaN(supVal)) return;
    const status = isOk ? "conforme" : "ecart";
    if (existing) {
      setSettlements(p => p.map(s => s.id === existing.id ? { ...s, myTotal: Math.round(myTotal * 100) / 100, supplierTotal: supVal, ecart: Math.round(diff * 100) / 100, status: status as any, paid: false, paidAt: null } : s));
    } else {
      setSettlements(p => [...p, { id: uid(), supplierId: selSup, month: selMonth, year: selYear, myTotal: Math.round(myTotal * 100) / 100, supplierTotal: supVal, ecart: Math.round(diff * 100) / 100, status: status as any, paid: false, paidAt: null, notes: "" }]);
    }
    const supName = suppliers.find(s => s.id === selSup)?.name;
    addLog("RAPPROCHEMENT", supName + " — " + MONTHS_FULL[selMonth - 1] + " " + selYear + ": " + (status === "conforme" ? "Conforme" : "Ecart " + fmt(diff)));
  };

  const markPaid = (sett: any) => {
    if (!isPharma) return;
    setSettlements(p => p.map(s => s.id === sett.id ? { ...s, paid: true, paidAt: new Date().toISOString().split("T")[0] } : s));
    const supName = suppliers.find(s => s.id === sett.supplierId)?.name;
    addLog("PAIEMENT", supName + " — " + MONTHS_FULL[sett.month - 1] + " " + sett.year + " Paye " + fmt(sett.supplierTotal));
  };

  return (
    <div>
      <div style={{ ...glassCard, padding: "16px 20px", marginBottom: 18, display: "flex", alignItems: "center", gap: 14, background: theme.violet + "08", borderColor: theme.violet + "20" }}>
        <Scale size={20} color={theme.violet} />
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>Confrontation de fin de mois</p>
          <p style={{ fontSize: 12, color: theme.textMuted }}>Selectionnez un fournisseur et un mois, saisissez le montant reclame. L app compare avec vos factures.</p>
        </div>
      </div>

      <div style={{ ...glassElevated, padding: "26px", marginBottom: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12, marginBottom: 24 }}>
          <div><Label>Fournisseur</Label><select className="select-glass" value={selSup} onChange={e => setSelSup(e.target.value)}>{suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
          <div><Label>Mois</Label><select className="select-glass" value={selMonth} onChange={e => setSelMonth(+e.target.value)}>{MONTHS_FULL.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}</select></div>
          <div><Label>Annee</Label><select className="select-glass" value={selYear} onChange={e => setSelYear(+e.target.value)}>{[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}</select></div>
          <div><Label>Le fournisseur reclame (DZD)</Label><input className="input-glass" type="number" step="0.01" value={supAmount} onChange={e => setSupAmount(e.target.value)} placeholder="Montant..." /></div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 20, alignItems: "center", marginBottom: 24 }}>
          <div style={{ ...glassCard, padding: "24px", textAlign: "center", borderColor: theme.emerald + "30", background: theme.emerald + "06" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: theme.textDim, marginBottom: 4, letterSpacing: 1, textTransform: "uppercase" }}>Mon total</p>
            <p style={{ fontSize: 32, fontWeight: 800, color: theme.emerald, letterSpacing: -1, margin: "8px 0" }}>{fmt(myTotal)}</p>
            <p style={{ fontSize: 12, color: theme.textDim }}>{curInvs.length} facture(s)</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 58, height: 58, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: !hasInput ? theme.glass2 : isOk ? theme.emeraldSoft : theme.roseSoft, border: "2px solid " + (!hasInput ? theme.glassBorder : isOk ? theme.emerald + "50" : theme.rose + "50"), transition: "all .5s" }}>
              {!hasInput ? <Scale size={24} color={theme.textDim} /> : isOk ? <CheckCircle2 size={26} color={theme.emerald} /> : <XCircle size={26} color={theme.rose} />}
            </div>
            {hasInput && <div style={{ marginTop: 10 }}><p style={{ fontSize: 14, fontWeight: 800, color: isOk ? theme.emerald : theme.rose }}>{isOk ? "CONFORME" : "ECART"}</p>{!isOk && <p style={{ fontSize: 20, fontWeight: 800, color: theme.rose }}>{fmt(diff)}</p>}</div>}
          </div>
          <div style={{ ...glassCard, padding: "24px", textAlign: "center", borderColor: hasInput ? (isOk ? theme.emerald + "30" : theme.rose + "30") : theme.glassBorder, background: hasInput ? (isOk ? theme.emerald + "06" : theme.rose + "06") : theme.glass }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: theme.textDim, marginBottom: 4, letterSpacing: 1, textTransform: "uppercase" }}>Fournisseur reclame</p>
            <p style={{ fontSize: 32, fontWeight: 800, color: hasInput ? theme.text : theme.textDim, letterSpacing: -1, margin: "8px 0" }}>{hasInput ? fmt(supVal) : "—"}</p>
            <p style={{ fontSize: 12, color: theme.textDim }}>Releve fin de mois</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn-primary" onClick={doCompare} disabled={!supAmount} style={{ opacity: supAmount ? 1 : .4 }}><Scale size={16} /> Comparer</button>
          {existing && isOk && !existing.paid && isPharma && <button className="btn-primary" onClick={() => markPaid(existing)} style={{ background: "linear-gradient(135deg," + theme.blue + "," + theme.violet + ")" }}><Banknote size={16} /> Marquer paye</button>}
          {existing?.paid && <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", background: theme.emerald + "15", borderRadius: 12, border: "1px solid " + theme.emerald + "25" }}><BadgeCheck size={16} color={theme.emerald} /><span style={{ fontSize: 13, fontWeight: 600, color: theme.emerald }}>Paye le {fmtDate(existing.paidAt!)}</span></div>}
        </div>
      </div>

      {curInvs.length > 0 && <div style={{ ...glassCard, padding: "20px", marginBottom: 18 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: theme.text, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}><FileText size={16} color={theme.blue} /> Detail</h4>
        <table style={{ width: "100%", borderCollapse: "collapse" }}><tbody>
          {curInvs.map(inv => <tr key={inv.id} className="row-hover" style={{ borderBottom: "1px solid " + theme.glassBorder }}><td style={{ padding: "10px 12px", fontSize: 13, fontWeight: 600, color: theme.text }}>{inv.number}</td><td style={{ padding: "10px 12px", fontSize: 13, color: theme.textMuted }}>{fmtDate(inv.date)}</td><td style={{ padding: "10px 12px", fontSize: 14, fontWeight: 700, color: theme.text, textAlign: "right" }}>{fmt(inv.amount)}</td></tr>)}
          <tr style={{ background: theme.glass2 }}><td colSpan={2} style={{ padding: "10px 12px", fontSize: 13, fontWeight: 700, color: theme.emerald, textAlign: "right" }}>TOTAL</td><td style={{ padding: "10px 12px", fontSize: 16, fontWeight: 800, color: theme.emerald, textAlign: "right" }}>{fmt(myTotal)}</td></tr>
        </tbody></table>
      </div>}

      <div style={{ ...glassCard, padding: "20px" }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: theme.text, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}><ClipboardList size={16} color={theme.violet} /> Historique</h4>
        <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse" }}><thead><tr>{["Fournisseur","Periode","Mes factures","Il reclame","Ecart","Statut","Paiement"].map(h => <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 600, color: theme.textDim, borderBottom: "1px solid " + theme.glassBorder }}>{h}</th>)}</tr></thead><tbody>
          {settlements.map(s => { const sup = suppliers.find(x => x.id === s.supplierId); return (
            <tr key={s.id} className="row-hover" style={{ borderBottom: "1px solid " + theme.glassBorder }}>
              <td style={{ padding: "10px 12px" }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: sup?.color }} /><span style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>{sup?.name}</span></div></td>
              <td style={{ padding: "10px 12px", fontSize: 13, color: theme.textMuted }}>{MONTHS_FULL[s.month - 1]} {s.year}</td>
              <td style={{ padding: "10px 12px", fontSize: 13, color: theme.text }}>{fmt(s.myTotal)}</td>
              <td style={{ padding: "10px 12px", fontSize: 13, color: theme.text }}>{fmt(s.supplierTotal)}</td>
              <td style={{ padding: "10px 12px", fontSize: 13, fontWeight: 700, color: s.ecart < 1 ? theme.emerald : theme.rose }}>{fmt(s.ecart)}</td>
              <td style={{ padding: "10px 12px" }}><Badge status={s.status} /></td>
              <td style={{ padding: "10px 12px" }}>{s.paid ? <span style={{ fontSize: 12, fontWeight: 600, color: theme.emerald }}>Paye</span> : isPharma && s.status === "conforme" ? <button onClick={() => markPaid(s)} className="btn-ghost" style={{ fontSize: 11 }}>Payer</button> : <span style={{ fontSize: 12, color: theme.amber }}>En attente</span>}</td>
            </tr>); })}
        </tbody></table></div>
      </div>
    </div>
  );
}