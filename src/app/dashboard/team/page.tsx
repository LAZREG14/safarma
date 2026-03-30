"use client";
import { useState } from "react";
import { Plus, Check, Crown, UserCheck } from "lucide-react";
import { theme, glassCard } from "@/lib/theme";
import { useApp } from "@/lib/store";
import { uid } from "@/lib/utils";
import { Modal, Label } from "@/components/ui";

export default function TeamPage() {
  const { users, setUsers, addLog } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ username: "", password: "", name: "", role: "assistant" });

  const addUser = () => {
    if (!form.username || !form.password || !form.name) return;
    setUsers(p => [...p, { id: uid(), ...form, active: true } as any]);
    addLog("AJOUT_MEMBRE", `${form.name} (${form.role})`);
    setShowForm(false);
  };

  const toggle = (u: any) => {
    setUsers(p => p.map(x => x.id === u.id ? { ...x, active: !x.active } : x));
    addLog("MODIF_MEMBRE", `${u.name}: ${u.active ? "désactivé" : "activé"}`);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
        <p style={{ color: theme.textMuted, fontSize: 14 }}>{users.length} membre(s)</p>
        <button className="btn-primary" onClick={() => { setForm({ username: "", password: "", name: "", role: "assistant" }); setShowForm(true); }}><Plus size={16} /> Inviter</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
        {users.map((u, i) => (
          <div key={u.id} className="glass-hover" style={{ ...glassCard, padding: "22px", opacity: u.active ? 1 : .5, animation: `fadeUp .4s ${i * 80}ms both` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 16, background: u.role === "pharmacien" ? `linear-gradient(135deg,${theme.emerald}30,${theme.blue}30)` : `linear-gradient(135deg,${theme.amber}30,${theme.rose}30)`, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${u.role === "pharmacien" ? theme.emerald : theme.amber}25` }}>
                {u.role === "pharmacien" ? <Crown size={22} color={theme.emerald} /> : <UserCheck size={22} color={theme.amber} />}
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: theme.text }}>{u.name}</h3>
                <p style={{ fontSize: 12, color: theme.textDim }}>@{u.username} · <span style={{ color: u.role === "pharmacien" ? theme.emerald : theme.amber, fontWeight: 600 }}>{u.role === "pharmacien" ? "Accès complet" : "Saisie uniquement"}</span></p>
              </div>
            </div>
            <button onClick={() => toggle(u)} className={u.active ? "btn-danger" : "btn-primary"} style={{ width: "100%", justifyContent: "center", display: "flex", alignItems: "center", gap: 6 }}>{u.active ? "Désactiver" : "Activer"}</button>
          </div>
        ))}
      </div>
      {showForm && (
        <Modal title="Inviter un membre" onClose={() => setShowForm(false)}>
          {[{ k: "name", l: "Nom complet", t: "text" }, { k: "username", l: "Identifiant", t: "text" }, { k: "password", l: "Mot de passe", t: "password" }].map(f => (
            <div key={f.k} style={{ marginBottom: 12 }}><Label>{f.l}</Label><input className="input-glass" type={f.t} value={(form as any)[f.k]} onChange={e => setForm({ ...form, [f.k]: e.target.value })} /></div>
          ))}
          <div style={{ marginBottom: 12 }}><Label>Rôle</Label>
            <select className="select-glass" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              <option value="assistant">Assistant (saisie uniquement)</option><option value="pharmacien">Pharmacien (accès complet)</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button className="btn-primary" onClick={addUser} style={{ flex: 1, justifyContent: "center" }}><Check size={16} /> Créer</button>
            <button className="btn-ghost" onClick={() => setShowForm(false)}>Annuler</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
