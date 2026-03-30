"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pill, Lock, Eye, EyeOff, AlertCircle, Receipt, Scale, Banknote, Shield } from "lucide-react";
import { theme, glassCard } from "@/lib/theme";
import { useApp } from "@/lib/store";
import { Label } from "@/components/ui";

export default function LoginPage() {
  const { auth, login } = useApp();
  const router = useRouter();
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  if (auth) { router.replace("/dashboard"); return null; }

  const submit = () => {
    setLoading(true); setErr("");
    setTimeout(() => {
      if (login(u, p)) router.push("/dashboard");
      else setErr("Identifiants incorrects");
      setLoading(false);
    }, 600);
  };

  const features = [
    { icon: Receipt, text: "Saisie quotidienne des factures", color: theme.emerald },
    { icon: Scale, text: "Confrontation mensuelle automatique", color: theme.blue },
    { icon: Banknote, text: "Suivi des paiements fournisseurs", color: theme.amber },
    { icon: Shield, text: "Traçabilité & sécurité complètes", color: theme.violet },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: theme.bgGrad, position: "relative" }}>
      <div style={{ position: "fixed", inset: 0, background: theme.bgMesh, pointerEvents: "none" }} />
      <div className="hide-mob" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 48, position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <div style={{ width: 80, height: 80, background: `linear-gradient(135deg, ${theme.emerald}, ${theme.blue})`, borderRadius: 26, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", boxShadow: `0 12px 40px ${theme.emerald}30`, animation: "float 4s ease-in-out infinite" }}>
            <Pill size={40} color="#fff" strokeWidth={2} />
          </div>
          <h1 style={{ color: theme.text, fontSize: 40, fontWeight: 800, letterSpacing: -1.5, lineHeight: 1.1 }}>Sa<span style={{ color: theme.emerald }}>Farma</span></h1>
          <p style={{ color: theme.textMuted, fontSize: 16, marginTop: 12, lineHeight: 1.6 }}>Gestion intelligente des factures fournisseurs</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 36 }}>
            {features.map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, ...glassCard, padding: "14px 18px", borderRadius: 14, animation: `fadeUp .5s cubic-bezier(.16,1,.3,1) ${300 + i * 100}ms both` }}>
                <div style={{ width: 36, height: 36, background: `${f.color}15`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${f.color}20` }}><f.icon size={18} color={f.color} /></div>
                <span style={{ color: theme.textSoft, fontSize: 14, fontWeight: 500 }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="full-mob" style={{ width: 460, minWidth: 320, display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 40px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 360, width: "100%", margin: "0 auto" }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: theme.text, letterSpacing: -0.5, marginBottom: 6 }}>Connexion</h2>
          <p style={{ color: theme.textDim, fontSize: 14, marginBottom: 28 }}>Accédez à votre espace de gestion</p>
          {err && <div style={{ background: theme.roseSoft, border: `1px solid ${theme.rose}30`, padding: "10px 14px", borderRadius: 12, fontSize: 13, color: theme.rose, marginBottom: 16, display: "flex", alignItems: "center", gap: 8, fontWeight: 500 }}><AlertCircle size={16} /> {err}</div>}
          <div style={{ marginBottom: 18 }}><Label>Nom d&apos;utilisateur</Label><input className="input-glass" value={u} onChange={e => setU(e.target.value)} placeholder="pharmacien" onKeyDown={e => e.key === "Enter" && submit()} /></div>
          <div style={{ marginBottom: 24 }}><Label>Mot de passe</Label>
            <div style={{ position: "relative" }}>
              <input className="input-glass" type={show ? "text" : "password"} value={p} onChange={e => setP(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && submit()} style={{ paddingRight: 44 }} />
              <button onClick={() => setShow(!show)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer" }}>{show ? <EyeOff size={17} color={theme.textDim} /> : <Eye size={17} color={theme.textDim} />}</button>
            </div>
          </div>
          <button className="btn-primary" onClick={submit} disabled={loading} style={{ width: "100%", justifyContent: "center", padding: 13, fontSize: 15, opacity: loading ? 0.7 : 1 }}>
            {loading ? <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .8s linear infinite" }} /> : <><Lock size={16} /> Se connecter</>}
          </button>
          <div style={{ ...glassCard, marginTop: 28, padding: 16, borderRadius: 14 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: theme.textMuted, marginBottom: 8 }}>Comptes démo</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: theme.textDim }}>👨‍⚕️ <strong style={{ color: theme.text }}>pharmacien</strong> / Pharma2025!</span><span style={{ color: theme.emerald, fontWeight: 600, fontSize: 11 }}>Admin</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: theme.textDim }}>👩‍💼 <strong style={{ color: theme.text }}>assistant</strong> / Assist2025!</span><span style={{ color: theme.amber, fontWeight: 600, fontSize: 11 }}>Saisie</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
