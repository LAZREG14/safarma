import type { Metadata } from "next";
import "@/styles/globals.css";
import { AppProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "SaFarma — Gestion Intelligente",
  description: "Gestion des factures fournisseurs pour pharmacies",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
