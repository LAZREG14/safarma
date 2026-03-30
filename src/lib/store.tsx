"use client";
// ══════════════════════════════════════════
// SaFarma — App Store (React Context)
// ══════════════════════════════════════════
// État global de l'application.
// En production, remplacer par des appels Supabase.

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { uid } from "@/lib/utils";
import { DEMO_SUPPLIERS, DEMO_USERS, generateInvoices, generateSettlements } from "@/lib/seed-data";
import type { User, Supplier, Invoice, Settlement, AuditLog } from "@/lib/types";

// ─── Context shape ───
interface AppState {
  auth: User | null;
  suppliers: Supplier[];
  invoices: Invoice[];
  settlements: Settlement[];
  users: User[];
  logs: AuditLog[];
  isPharma: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addLog: (action: string, details: string) => void;
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  setSettlements: React.Dispatch<React.SetStateAction<Settlement[]>>;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const AppContext = createContext<AppState | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

// ─── Local storage helpers (demo mode) ───
// En production : remplacer par Supabase
const loadLocal = (key: string, fallback: any) => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(`sf_${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const saveLocal = (key: string, data: any) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`sf_${key}`, JSON.stringify(data));
  } catch {}
};

// ─── Provider ───
export function AppProvider({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [auth, setAuth] = useState<User | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);

  // Init
  useEffect(() => {
    const demoInvoices = generateInvoices();
    setSuppliers(loadLocal("sup", DEMO_SUPPLIERS));
    setInvoices(loadLocal("inv", demoInvoices));
    setSettlements(loadLocal("set", generateSettlements(demoInvoices)));
    setUsers(loadLocal("usr", DEMO_USERS));
    setLogs(loadLocal("log", []));
    setAuth(loadLocal("auth", null));
    setLoaded(true);
  }, []);

  // Persist
  useEffect(() => { if (loaded) saveLocal("sup", suppliers); }, [suppliers, loaded]);
  useEffect(() => { if (loaded) saveLocal("inv", invoices); }, [invoices, loaded]);
  useEffect(() => { if (loaded) saveLocal("set", settlements); }, [settlements, loaded]);
  useEffect(() => { if (loaded) saveLocal("usr", users); }, [users, loaded]);
  useEffect(() => { if (loaded) saveLocal("log", logs); }, [logs, loaded]);
  useEffect(() => { if (loaded) saveLocal("auth", auth); }, [auth, loaded]);

  const addLog = useCallback(
    (action: string, details: string) => {
      setLogs((p) =>
        [
          { id: uid(), userName: auth?.name || "", action, details, ts: new Date().toISOString() },
          ...p,
        ].slice(0, 500)
      );
    },
    [auth]
  );

  const login = (username: string, password: string) => {
    const user = users.find((u) => u.username === username && u.password === password && u.active);
    if (user) {
      setAuth(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    addLog("LOGOUT", auth?.name || "");
    setAuth(null);
    saveLocal("auth", null);
  };

  if (!loaded) return null;

  return (
    <AppContext.Provider
      value={{
        auth,
        suppliers,
        invoices,
        settlements,
        users,
        logs,
        isPharma: auth?.role === "pharmacien",
        login,
        logout,
        addLog,
        setSuppliers,
        setInvoices,
        setSettlements,
        setUsers,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
