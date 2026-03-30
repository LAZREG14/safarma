-- ══════════════════════════════════════════════════════
-- SAFARMA — Schéma PostgreSQL + RLS
-- À exécuter dans Supabase SQL Editor
-- ══════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── TENANTS (Pharmacies) ───
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── PROFILES ───
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  full_name TEXT NOT NULL,
  email TEXT,
  role TEXT NOT NULL CHECK (role IN ('pharmacien', 'assistant')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, tenant_id, full_name, email, role)
  VALUES (
    NEW.id,
    '00000000-0000-0000-0000-000000000000',
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    'assistant'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── SUPPLIERS ───
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  color TEXT DEFAULT '#10B981',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── INVOICES ───
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  supplier_id UUID NOT NULL REFERENCES suppliers(id),
  number TEXT NOT NULL,
  date DATE NOT NULL,
  amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
  notes TEXT,
  attachment_path TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, number)
);

-- ─── SETTLEMENTS (Rapprochements mensuels) ───
CREATE TABLE settlements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  supplier_id UUID NOT NULL REFERENCES suppliers(id),
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INTEGER NOT NULL CHECK (year >= 2020),
  my_total NUMERIC(12,2) NOT NULL DEFAULT 0,
  supplier_total NUMERIC(12,2) NOT NULL DEFAULT 0,
  ecart NUMERIC(12,2) GENERATED ALWAYS AS (ABS(my_total - supplier_total)) STORED,
  status TEXT GENERATED ALWAYS AS (
    CASE WHEN ABS(my_total - supplier_total) < 1 THEN 'conforme' ELSE 'ecart' END
  ) STORED,
  paid BOOLEAN DEFAULT false,
  paid_at DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, supplier_id, month, year)
);

-- ─── AUDIT LOGS ───
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  user_id UUID REFERENCES profiles(id),
  user_name TEXT,
  action TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── INDEXES ───
CREATE INDEX idx_invoices_tenant_sup ON invoices(tenant_id, supplier_id, date);
CREATE INDEX idx_audit_tenant_date ON audit_logs(tenant_id, created_at DESC);

-- ─── HELPER FUNCTION ───
CREATE OR REPLACE FUNCTION get_my_tenant_id()
RETURNS UUID AS $$
  SELECT tenant_id FROM profiles WHERE id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- ─── AUTO-FILL TENANT ───
CREATE OR REPLACE FUNCTION auto_set_tenant()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.tenant_id IS NULL THEN
    NEW.tenant_id := get_my_tenant_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_suppliers BEFORE INSERT ON suppliers FOR EACH ROW EXECUTE FUNCTION auto_set_tenant();
CREATE TRIGGER trg_invoices BEFORE INSERT ON invoices FOR EACH ROW EXECUTE FUNCTION auto_set_tenant();
CREATE TRIGGER trg_settlements BEFORE INSERT ON settlements FOR EACH ROW EXECUTE FUNCTION auto_set_tenant();
CREATE TRIGGER trg_audit BEFORE INSERT ON audit_logs FOR EACH ROW EXECUTE FUNCTION auto_set_tenant();

-- ═══════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "read" ON profiles FOR SELECT USING (tenant_id = get_my_tenant_id());

-- SUPPLIERS
CREATE POLICY "read" ON suppliers FOR SELECT USING (tenant_id = get_my_tenant_id());
CREATE POLICY "insert" ON suppliers FOR INSERT WITH CHECK (tenant_id = get_my_tenant_id());
CREATE POLICY "update" ON suppliers FOR UPDATE USING (tenant_id = get_my_tenant_id() AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'pharmacien');
CREATE POLICY "delete" ON suppliers FOR DELETE USING (tenant_id = get_my_tenant_id() AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'pharmacien');

-- INVOICES
CREATE POLICY "read" ON invoices FOR SELECT USING (tenant_id = get_my_tenant_id());
CREATE POLICY "insert" ON invoices FOR INSERT WITH CHECK (tenant_id = get_my_tenant_id());
CREATE POLICY "update" ON invoices FOR UPDATE USING (tenant_id = get_my_tenant_id());
CREATE POLICY "delete" ON invoices FOR DELETE USING (tenant_id = get_my_tenant_id() AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'pharmacien');

-- SETTLEMENTS
CREATE POLICY "read" ON settlements FOR SELECT USING (tenant_id = get_my_tenant_id());
CREATE POLICY "insert" ON settlements FOR INSERT WITH CHECK (tenant_id = get_my_tenant_id());
CREATE POLICY "update" ON settlements FOR UPDATE USING (tenant_id = get_my_tenant_id());

-- AUDIT LOGS
CREATE POLICY "read" ON audit_logs FOR SELECT USING (tenant_id = get_my_tenant_id() AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'pharmacien');
CREATE POLICY "insert" ON audit_logs FOR INSERT WITH CHECK (tenant_id = get_my_tenant_id());

-- ═══════════════════════════════════════
-- AUTO AUDIT ON INVOICE CHANGES
-- ═══════════════════════════════════════
CREATE OR REPLACE FUNCTION log_invoice_changes()
RETURNS TRIGGER AS $$
DECLARE uname TEXT;
BEGIN
  SELECT full_name INTO uname FROM profiles WHERE id = auth.uid();
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (tenant_id, user_id, user_name, action, details)
    VALUES (NEW.tenant_id, auth.uid(), uname, 'SAISIE_FACTURE', format('Facture %s: %s DZD', NEW.number, NEW.amount));
  ELSIF TG_OP = 'UPDATE' AND OLD.amount != NEW.amount THEN
    INSERT INTO audit_logs (tenant_id, user_id, user_name, action, details)
    VALUES (NEW.tenant_id, auth.uid(), uname, 'EDIT_FACTURE', format('Facture %s: %s -> %s DZD', NEW.number, OLD.amount, NEW.amount));
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (tenant_id, user_id, user_name, action, details)
    VALUES (OLD.tenant_id, auth.uid(), uname, 'SUPPR_FACTURE', format('Facture %s supprimee (%s DZD)', OLD.number, OLD.amount));
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER audit_invoices AFTER INSERT OR UPDATE OR DELETE ON invoices FOR EACH ROW EXECUTE FUNCTION log_invoice_changes();
