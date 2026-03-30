// ══════════════════════════════════════════
// SaFarma — Design System (Apple Glassmorphism)
// ══════════════════════════════════════════
// Modifier les couleurs ici affecte TOUTE l'app

export const theme = {
  // Backgrounds
  bg: "rgba(10,10,15,1)",
  bgGrad:
    "linear-gradient(145deg, #0a0a12 0%, #0d1117 30%, #0f0f1a 60%, #0a0e14 100%)",
  bgMesh:
    "radial-gradient(ellipse at 20% 50%, rgba(16,185,129,0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(59,130,246,0.05) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(168,85,247,0.04) 0%, transparent 50%)",

  // Glass layers
  glass: "rgba(255,255,255,0.03)",
  glass2: "rgba(255,255,255,0.05)",
  glass3: "rgba(255,255,255,0.08)",
  glassBorder: "rgba(255,255,255,0.08)",
  glassBorder2: "rgba(255,255,255,0.12)",
  glassHover: "rgba(255,255,255,0.06)",

  // Sidebar
  sidebar: "rgba(12,12,20,0.85)",
  sidebarActive: "rgba(16,185,129,0.12)",

  // Text hierarchy
  text: "#F1F5F9",
  textSoft: "rgba(241,245,249,0.85)",
  textMuted: "rgba(148,163,184,0.9)",
  textDim: "rgba(100,116,139,0.8)",

  // Brand colors
  emerald: "#10B981",
  emeraldSoft: "rgba(16,185,129,0.15)",
  blue: "#3B82F6",
  blueSoft: "rgba(59,130,246,0.15)",
  violet: "#8B5CF6",
  violetSoft: "rgba(139,92,246,0.15)",
  amber: "#F59E0B",
  amberSoft: "rgba(245,158,11,0.15)",
  rose: "#F43F5E",
  roseSoft: "rgba(244,63,94,0.15)",
  cyan: "#06B6D4",

  // Border radius
  rLg: 20,
} as const;

// Reusable glass card styles
export const glassCard = {
  background: theme.glass,
  backdropFilter: "blur(40px) saturate(180%)",
  WebkitBackdropFilter: "blur(40px) saturate(180%)",
  border: `1px solid ${theme.glassBorder}`,
  borderRadius: theme.rLg,
} as const;

export const glassElevated = {
  background: theme.glass2,
  backdropFilter: "blur(60px) saturate(200%)",
  WebkitBackdropFilter: "blur(60px) saturate(200%)",
  border: `1px solid ${theme.glassBorder2}`,
  borderRadius: theme.rLg,
  boxShadow:
    "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
} as const;

// Chart colors (for recharts)
export const chartColors = [
  theme.emerald,
  theme.blue,
  theme.violet,
  theme.amber,
  theme.rose,
  theme.cyan,
  "#EC4899",
  "#F97316",
];

// Months
export const MONTHS_FULL = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

export const MONTHS_SHORT = [
  "Jan", "Fév", "Mar", "Avr", "Mai", "Jun",
  "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc",
];

// Audit log action colors
export const auditColors: Record<string, string> = {
  SAISIE_FACTURE: theme.emerald,
  EDIT_FACTURE: theme.amber,
  SUPPR_FACTURE: theme.rose,
  AJOUT_FOURNISSEUR: theme.emerald,
  EDIT_FOURNISSEUR: theme.amber,
  RAPPROCHEMENT: theme.violet,
  PAIEMENT: theme.blue,
  AJOUT_MEMBRE: theme.cyan,
  MODIF_MEMBRE: theme.amber,
  LOGOUT: theme.textDim,
};
