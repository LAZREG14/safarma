// ══════════════════════════════════════════
// SaFarma — Utility Functions
// ══════════════════════════════════════════

export const uid = () => Math.random().toString(36).substr(2, 9);

export const fmt = (n: number) =>
  new Intl.NumberFormat("fr-DZ", {
    style: "currency",
    currency: "DZD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);

export const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const fmtShort = (n: number) =>
  n >= 1e6
    ? (n / 1e6).toFixed(1) + "M"
    : n >= 1e3
      ? (n / 1e3).toFixed(0) + "k"
      : String(n);
