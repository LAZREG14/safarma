# 💊 SaFarma — Gestion Intelligente des Factures Fournisseurs

Application de gestion des factures fournisseurs pour pharmacies algériennes.
Architecture SaaS multi-tenant, design Apple glassmorphism.

## 🏗 Stack Technique

| Composant | Technologie |
|---|---|
| Frontend | Next.js 15 + React 19 + TypeScript |
| Styling | Tailwind CSS 4 + CSS glassmorphism |
| Charts | Recharts |
| Icons | Lucide React |
| Auth & BDD | Supabase (PostgreSQL + Auth + RLS + Storage) |
| Hébergement | Vercel (gratuit) |

## 📁 Structure du Projet

```
safarma/
├── src/
│   ├── app/                          # Pages (Next.js App Router)
│   │   ├── layout.tsx                # Layout racine + AppProvider
│   │   ├── page.tsx                  # Redirect → /dashboard ou /login
│   │   ├── login/
│   │   │   └── page.tsx              # Écran de connexion
│   │   └── dashboard/
│   │       ├── layout.tsx            # Sidebar + Header
│   │       ├── page.tsx              # Tableau de bord (KPI + Charts)
│   │       ├── invoices/
│   │       │   └── page.tsx          # Saisie quotidienne des factures
│   │       ├── suppliers/
│   │       │   └── page.tsx          # Gestion des fournisseurs
│   │       ├── reconciliation/
│   │       │   └── page.tsx          # ⭐ Rapprochement mensuel (cœur)
│   │       ├── team/
│   │       │   └── page.tsx          # Gestion de l'équipe (pharmacien)
│   │       └── audit/
│   │           └── page.tsx          # Journal d'audit (pharmacien)
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   └── index.tsx             # Badge, Modal, Label, GlassTooltip
│   │   └── layout/
│   │       ├── Sidebar.tsx           # Sidebar navigation
│   │       └── Header.tsx            # Top bar
│   │
│   ├── lib/
│   │   ├── types.ts                  # Interfaces TypeScript
│   │   ├── theme.ts                  # Design tokens (couleurs, glass)
│   │   ├── utils.ts                  # Fonctions utilitaires (fmt, uid...)
│   │   ├── store.tsx                 # État global (React Context)
│   │   ├── seed-data.ts             # Données de démo
│   │   └── supabase/
│   │       ├── client.ts            # Client navigateur
│   │       └── server.ts            # Client serveur (SSR)
│   │
│   ├── styles/
│   │   └── globals.css               # Styles glassmorphism globaux
│   │
│   └── middleware.ts                 # Protection des routes
│
├── supabase/
│   └── schema.sql                    # Schéma BDD + RLS complet
│
├── .env.local.example               # Template variables d'environnement
├── .gitignore
├── next.config.ts                    # Headers de sécurité
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

## 🚀 Démarrage Rapide (Mode Démo)

```bash
# 1. Cloner le repo
git clone https://github.com/TON-USERNAME/safarma.git
cd safarma

# 2. Installer les dépendances
npm install

# 3. Lancer en dev
npm run dev

# 4. Ouvrir http://localhost:3000
# Comptes : pharmacien / Pharma2025! ou assistant / Assist2025!
```

## 🌐 Déploiement Production (Vercel + Supabase)

### Étape 1 : Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Aller dans **SQL Editor** → coller le contenu de `supabase/schema.sql` → **Run**
3. Dans **Storage** → créer un bucket `invoices` (privé)
4. Noter l'URL et la clé anon dans **Settings → API**

### Étape 2 : Variables d'environnement

```bash
cp .env.local.example .env.local
# Remplir NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Étape 3 : Passer en mode Supabase

Dans `src/lib/store.tsx`, remplacer les appels `localStorage` par les appels Supabase
(voir les commentaires dans le fichier).

### Étape 4 : Vercel

1. Push sur GitHub
2. Connecter le repo sur [vercel.com](https://vercel.com)
3. Ajouter les variables d'environnement dans Vercel Settings
4. Deploy !

### Étape 5 : Premier utilisateur

```sql
-- Dans Supabase SQL Editor :
INSERT INTO tenants (name, owner_name, address, phone)
VALUES ('Pharmacie LAZREG', 'LAZREG Abdellah', 'Tlemcen', '0555 00 00 00')
RETURNING id;

-- Après inscription sur l'app :
UPDATE profiles
SET role = 'pharmacien', tenant_id = 'UUID-RETOURNÉ'
WHERE email = 'ton-email@example.com';
```

## 🔒 Sécurité

- **RLS PostgreSQL** : isolation parfaite entre pharmacies
- **RBAC** : pharmacien (admin) vs assistant (saisie uniquement)
- **Audit trail** : toute modification de facture est tracée automatiquement
- **Headers OWASP** : X-Frame-Options, HSTS, CSP configurés
- **Mots de passe** : hashés en bcrypt par Supabase Auth

## 📋 Guide de Modification

| Je veux modifier... | Fichier à éditer |
|---|---|
| Couleurs / design | `src/lib/theme.ts` |
| Animations / boutons / inputs | `src/styles/globals.css` |
| Composants réutilisables | `src/components/ui/index.tsx` |
| Sidebar | `src/components/layout/Sidebar.tsx` |
| Page de connexion | `src/app/login/page.tsx` |
| Dashboard (graphiques) | `src/app/dashboard/page.tsx` |
| Saisie des factures | `src/app/dashboard/invoices/page.tsx` |
| Rapprochement mensuel | `src/app/dashboard/reconciliation/page.tsx` |
| Gestion fournisseurs | `src/app/dashboard/suppliers/page.tsx` |
| Gestion équipe | `src/app/dashboard/team/page.tsx` |
| Journal d'audit | `src/app/dashboard/audit/page.tsx` |
| Types TypeScript | `src/lib/types.ts` |
| Données de démo | `src/lib/seed-data.ts` |
| Schéma BDD | `supabase/schema.sql` |
