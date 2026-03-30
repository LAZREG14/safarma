"use client";
import { useState } from "react";
import { Plus, Edit2, Check, Package } from "lucide-react";
import { theme, glassCard, chartColors } from "@/lib/theme";
import { useApp } from "@/lib/store";
import { uid, fmt } from "@/lib/utils";
import { Modal, Label } from "@/components/ui";

export default function SuppliersPage() {
  const { suppliers, setSuppliers, invoices, isPharma, addLog } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", contact: "", phone: "", email: "", address: "" });

  const save = () => {
    if (!form.name.trim()) return;
    if (editing) {
      setSuppliers(p => p.map(s => s.id === editing ? { ...s, ...form } : s));
      addLog("EDIT_FOURNISSEUR", form.name);
    } else {
      setSuppliers(p => [...p, { id: uid(), ...form, color: chartColors[p.length % chartColors.length] }]);
      addLog("AJOUT_FOURNISSEUR", form.name);
    }
    setShowForm(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
        <p style={{ fontSize: 14, color: theme.textMuted }}>{suppliers.length} fournisseur(s)</p>
        {isPharma && <button className="btn-primary" onClick={() => { setForm({ name: "", contact: "", phone: "", email: "", address: "" }); setEditing(null); setShowForm(true); }}><Plus size={16} /> Ajouter</button>}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))", gap: 14 }}>
        {suppliers.map((s, i) => {
          const cnt = invoices.filter(inv => inv.supplierId === s.id).length;
          const tot = invoices.filter(inv => inv.supplierId === s.id).reduce((sum, inv) => sum + inv.amount, 0);
          return (
            <div key={s.id} className="glass-hover" style={{ ...glassCard, padding: "22px", cursor: "default", animation: `fadeUp .4s ${i * 60}ms both` }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 46, height: 46, background: `${s.color}15`, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${s.color}25` }}><Package size={22} color={s.color} /></div>
                  <div><h3 style={{ fontSize: 16, fontWeight: 700, color: theme.text }}>{s.name}</h3><p style={{ fontSize: 12, color: theme.textDim }}>{s.contact}</p></div>
                </div>
                {isPharma && <button onClick={() => { setForm(s as any); setEditing(s.id); setShowForm(true); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><Edit2 size={14} color={theme.textDim} /></button>}
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                {s.phone && <span style={{ ...glassCard, padding: "3px 10px", borderRadius: 8, fontSize: 11, color: theme.textDim, background: theme.glass2 }}>📞 {s.phone}</span>}
                {s.address && <span style={{ ...glassCard, padding: "3px 10px", borderRadius: 8, fontSize: 11, color: theme.textDim, background: theme.glass2 }}>📍 {s.address}</span>}
              </div>
              <div style={{ display: "flex", gap: 20, paddingTop: 14, borderTop: `1px solid ${theme.glassBorder}` }}>
                <div><p style={{ fontSize: 11, color: theme.textDim }}>Factures</p><p style={{ fontSize: 20, fontWeight: 800, color: theme.text }}>{cnt}</p></div>
                <div><p style={{ fontSize: 11, color: theme.textDim }}>Total</p><p style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{fmt(tot)}</p></div>
              </div>
            </div>
          );
        })}
      </div>
      {showForm && (
        <Modal title={editing ? "Modifier" : "Nouveau fournisseur"} onClose={() => setShowForm(false)}>
          {[{ k: "name", l: "Nom *" }, { k: "contact", l: "Contact" }, { k: "phone", l: "Téléphone" }, { k: "email", l: "Email" }, { k: "address", l: "Adresse" }].map(f => (
            <div key={f.k} style={{ marginBottom: 12 }}><Label>{f.l}</Label><input className="input-glass" value={(form as any)[f.k] || ""} onChange={e => setForm({ ...form, [f.k]: e.target.value })} /></div>
          ))}
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button className="btn-primary" onClick={save} style={{ flex: 1, justifyContent: "center" }}><Check size={16} /> Enregistrer</button>
            <button className="btn-ghost" onClick={() => setShowForm(false)}>Annuler</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
