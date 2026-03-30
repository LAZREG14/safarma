// ══════════════════════════════════════════
// SaFarma — Données de démonstration
// ══════════════════════════════════════════
// En production, supprimer ce fichier.
// Les données viendront de Supabase.

import { theme, chartColors } from "./theme";
import { uid } from "./utils";
import type { User, Supplier, Invoice, Settlement } from "./types";

export const DEMO_SUPPLIERS: Supplier[] = [
  { id: "s1", name: "BIOPHARMA", contact: "M. Rachid Belkacem", phone: "0550 111 222", email: "contact@biopharma.dz", address: "Alger", color: theme.emerald },
  { id: "s2", name: "EL KENDI", contact: "Mme Fatima Zerouali", phone: "0551 333 444", email: "info@elkendi.dz", address: "Constantine", color: theme.blue },
  { id: "s3", name: "SAIDAL", contact: "M. Karim Djebbar", phone: "0552 555 666", email: "ventes@saidal.dz", address: "Médéa", color: theme.violet },
  { id: "s4", name: "BIOPHARM", contact: "M. Yacine Ait", phone: "0553 777 888", email: "contact@biopharm.dz", address: "Blida", color: theme.amber },
  { id: "s5", name: "LPA", contact: "Mme Nora Saadi", phone: "0554 999 000", email: "lpa@lpa.dz", address: "Oran", color: theme.rose },
];

export const DEMO_USERS: User[] = [
  { id: "u1", username: "pharmacien", password: "Pharma2025!", role: "pharmacien", name: "LAZREG Abdellah", active: true },
  { id: "u2", username: "assistant", password: "Assist2025!", role: "assistant", name: "Amina Bouchrit", active: true },
];

export function generateInvoices(): Invoice[] {
  const inv: Invoice[] = [];
  DEMO_SUPPLIERS.forEach((s) => {
    for (let m = 0; m < 6; m++) {
      const count = 3 + Math.floor(Math.random() * 6);
      for (let i = 0; i < count; i++) {
        const day = 1 + Math.floor(Math.random() * 28);
        inv.push({
          id: uid(),
          supplierId: s.id,
          number: `FAC-${s.name.substring(0, 3)}-${2025}${String(m + 1).padStart(2, "0")}${String(i + 1).padStart(3, "0")}`,
          date: `2025-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
          amount: Math.round((5000 + Math.random() * 120000) * 100) / 100,
          notes: "",
          attachment: null,
          createdBy: "u1",
          createdAt: new Date().toISOString(),
        });
      }
    }
  });
  return inv.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function generateSettlements(invoices: Invoice[]): Settlement[] {
  const r: Settlement[] = [];
  DEMO_SUPPLIERS.forEach((s) => {
    for (let m = 0; m < 5; m++) {
      const mi = invoices.filter(
        (i) => i.supplierId === s.id && new Date(i.date).getMonth() === m
      );
      const myTotal = mi.reduce((a, b) => a + b.amount, 0);
      if (myTotal > 0) {
        const variance =
          Math.random() > 0.75
            ? Math.round((Math.random() * 6000 - 3000) * 100) / 100
            : 0;
        const supplierTotal = Math.round((myTotal + variance) * 100) / 100;
        const isMatch = Math.abs(variance) < 1;
        r.push({
          id: uid(),
          supplierId: s.id,
          month: m + 1,
          year: 2025,
          myTotal: Math.round(myTotal * 100) / 100,
          supplierTotal,
          ecart: Math.round(Math.abs(variance) * 100) / 100,
          status: isMatch ? "conforme" : "ecart",
          paid: isMatch || Math.random() > 0.5,
          paidAt: isMatch ? `2025-${String(m + 2).padStart(2, "0")}-05` : null,
          notes: "",
        });
      }
    }
  });
  return r;
}
