// ══════════════════════════════════════════
// SaFarma — Types & Interfaces
// ══════════════════════════════════════════

export type UserRole = "pharmacien" | "assistant";

export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  name: string;
  active: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  color: string;
}

export interface Invoice {
  id: string;
  supplierId: string;
  number: string;
  date: string;
  amount: number;
  notes: string;
  attachment: string | null;
  createdBy: string;
  createdAt: string;
}

export interface Settlement {
  id: string;
  supplierId: string;
  month: number;
  year: number;
  myTotal: number;
  supplierTotal: number;
  ecart: number;
  status: "conforme" | "ecart";
  paid: boolean;
  paidAt: string | null;
  notes: string;
}

export interface AuditLog {
  id: string;
  userName: string;
  action: string;
  details: string;
  ts: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
}
