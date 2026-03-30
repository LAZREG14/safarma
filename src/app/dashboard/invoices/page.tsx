"use client";
// ══════════════════════════════════════════
// SaFarma — Saisie des Factures
// ══════════════════════════════════════════
import { useState, useMemo } from "react";
import { Search, Plus, Hash, Wallet, Edit2, Trash2, Check, Upload, Receipt } from "lucide-react";
import { theme, glassCard } from "@/lib/theme";
import { useApp } from "@/lib/store";
import { uid, fmt, fmtDate } from "@/lib/utils";
import { Modal, Label } from "@/components/ui";

export default function InvoicesPage() {
  const { invoices, setInvoices, suppliers, isPharma, addLog, auth } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [fSup, setFSup] = useState("");
  const [fMonth, setFMonth] = useState("");
  const [form, setForm] = useState({ supplierId: "", number: "", date: "", amount: "", notes: "" });

  const filtered = useMemo(() => invoices.filter(inv => {
    const sup = suppliers.find(s => s.id === inv.supplierId);
    return (!search || inv.number.toLowerCase().includes(search.toLowerCase()) || sup?.name.toLowerCase().includes(search.toLowerCase()))
      && (!fSup || inv.supplierId === fSup) && (!fMonth || inv.date.startsWith(fMonth));
  }), [invoices, search, fSup, fMonth, suppliers]);

  const totalF = filtered.reduce((s, i) => s + i.amount, 0);

  const openNew = () => { setForm({ supplierId: suppliers[0]?.id || "", number: "", date: new Date().toISOString().split("T")[0], amount: "", notes: "" }); setEditing(null); setShowForm(true); };
  const openEdit = (inv: any) => { setForm({ supplierId: inv.supplierId, number: inv.number, date: inv.date, amount: String(inv.amount), notes: inv.notes || "" }); setEditing(inv.id); setShowForm(true); };

  const doSave = () => {
    if (!form.supplierId || !form.number || !form.date || !form.amount) return;
    const amount = parseFloat(form.amount);
    if (isNaN(amount) || amount <= 0) return;
    if (editing) {
      setInvoices(p => p.map(i => i.id === editing ? { ...i, ...form, amount } : i));
      addLog("EDIT_FACTURE", `${form.number} modifiée → ${fmt(amount)}`);
    } else {
      setInvoices(p => [{ id: uid(), ...form, amount, createdBy: auth!.id, createdAt: new Date().toISOString(), attachment: null }, ...p]);
      addLog("SAISIE_FACTURE", `${form.number} — ${fmt(amount)} (${suppliers.find(s => s.id === form.supplierId)?.name})`);
    }
    setShowForm(false);
  };

  const doDelete = (inv: any) => { if (!isPharma) return; setInvoices(p => p.filter(i => i.id !== inv.id)); addLog("SUPPR_FACTURE", `${inv.number} (${fmt(inv.amount)})`); };

  return (
    <div>
      <div style={{ ...glassCard, padding: "16px 20px", marginBottom: 18, display: "flex", alignItems: "center", gap: 14, background: `${theme.emerald}08`, borderColor: `${theme.emerald}20` }}>
        <Receipt size={20} color={theme.emerald} />
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>Saisie quotidienne</p>
          <p style={{ fontSize: 12, color: theme.textMuted }}>Chaque facture reçue d&apos;un fournisseur doit être saisie ici. En fin de mois → <strong style={{ color: theme.emerald }}>Rapprochement</strong>.</p>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: "1 1 220px" }}>
          <Search size={16} color={theme.textDim} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
          <input className="input-glass" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 40 }} />
        </div>
        <select className="select-glass" value={fSup} onChange={e => setFSup(e.target.value)} style={{ flex: "0 1 170px" }}>
          <option value="">Tous fournisseurs</option>
          {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <input className="input-glass" type="month" value={fMonth} onChange={e => setFMonth(e.target.value)} style={{ flex: "0 1 160px" }} />
        <button className="btn-primary" onClick={openNew}><Plus size={16} /> Saisir une facture</button>
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
        <div style={{ ...glassCard, padding: "10px 18px", display: "flex", alignItems: "center", gap: 8 }}><Hash size={14} color={theme.emerald} /><span style={{ fontSize: 12, color: theme.textDim }}>{filtered.length} facture(s)</span></div>
        <div style={{ ...glassCard, padding: "10px 18px", display: "flex", alignItems: "center", gap: 8 }}><Wallet size={14} color={theme.emerald} /><span style={{ fontSize: 13, fontWeight: 700, color: theme.emerald }}>{fmt(totalF)}</span></div>
      </div>
      <div style={{ ...glassCard, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>
              {["N° Facture", "Fournisseur", "Date", "Montant", ""].map(h => <th key={h} style={{ padding: "13px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: theme.textDim, textTransform: "uppercase", letterSpacing: .8, borderBottom: `1px solid ${theme.glassBorder}`, background: theme.glass }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {filtered.slice(0, 60).map(inv => {
                const sup = suppliers.find(s => s.id === inv.supplierId);
                return (
                  <tr key={inv.id} className="row-hover" style={{ borderBottom: `1px solid ${theme.glassBorder}` }}>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: theme.text }}>{inv.number}</td>
                    <td style={{ padding: "12px 16px" }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: sup?.color, boxShadow: `0 0 6px ${sup?.color}40` }} /><span style={{ fontSize: 13, color: theme.textSoft }}>{sup?.name}</span></div></td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: theme.textMuted }}>{fmtDate(inv.date)}</td>
                    <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 700, color: theme.text }}>{fmt(inv.amount)}</td>
                    <td style={{ padding: "12px 16px" }}><div style={{ display: "flex", gap: 4 }}>
                      <button onClick={() => openEdit(inv)} style={{ background: "none", border: "none", cursor: "pointer", padding: 5 }}><Edit2 size={14} color={theme.textDim} /></button>
                      {isPharma && <button onClick={() => doDelete(inv)} style={{ background: "none", border: "none", cursor: "pointer", padding: 5 }}><Trash2 size={14} color={theme.rose} /></button>}
                    </div></td>
                  </tr>
                );
              })}
              {filtered.length === 0 && <tr><td colSpan={5} style={{ padding: 40, textAlign: "center", color: theme.textDim }}>Aucune facture</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {showForm && (
        <Modal title={editing ? "Modifier la facture" : "Saisir une facture"} onClose={() => setShowForm(false)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ gridColumn: "1/-1" }}><Label>Fournisseur *</Label><select className="select-glass" value={form.supplierId} onChange={e => setForm({ ...form, supplierId: e.target.value })}>{suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
            <div><Label>N° Facture *</Label><input className="input-glass" value={form.number} onChange={e => setForm({ ...form, number: e.target.value })} placeholder="FAC-001" /></div>
            <div><Label>Date *</Label><input className="input-glass" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
            <div><Label>Montant (DZD) *</Label><input className="input-glass" type="number" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} /></div>
            <div><Label>Notes</Label><input className="input-glass" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Optionnel" /></div>
            <div style={{ gridColumn: "1/-1" }}><label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: 16, border: `2px dashed ${theme.glassBorder2}`, borderRadius: 14, justifyContent: "center", color: theme.textDim, fontSize: 13 }}><Upload size={18} /> Joindre PDF / Photo</label></div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button className="btn-primary" onClick={doSave} style={{ flex: 1, justifyContent: "center" }}><Check size={16} /> Enregistrer</button>
            <button className="btn-ghost" onClick={() => setShowForm(false)}>Annuler</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
