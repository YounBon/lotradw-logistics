-- initFix.sql
-- Fixes for init3.sql to align with `for_assistant.txt` requirements
-- Idempotent SQL script for pgAdmin 4. Run in target DB after reviewing.
-- This script will NOT modify project code. It only creates/updates DB objects as needed.

-- ==================================================================================
-- 1) Ensure pgcrypto and uuid-ossp are available when possible (safe, non-fatal)
-- ==================================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto') THEN
    BEGIN
      CREATE EXTENSION IF NOT EXISTS pgcrypto;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'initFix: could not create extension pgcrypto: %', SQLERRM;
    END;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'uuid-ossp') THEN
    BEGIN
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'initFix: could not create extension uuid-ossp: %', SQLERRM;
    END;
  END IF;
END$$;

-- ==================================================================================
-- 2) Ensure auth.set_is_active_by_role trigger exists: set is_active = FALSE for carriers
-- ==================================================================================
CREATE OR REPLACE FUNCTION auth.set_is_active_by_role()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.role = 'carrier' THEN
      NEW.is_active := FALSE;
    ELSE
      NEW.is_active := COALESCE(NEW.is_active, TRUE);
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE event_object_schema = 'auth' AND event_object_table = 'users' AND trigger_name = 'auth_set_is_active_by_role') THEN
    EXECUTE 'CREATE TRIGGER auth_set_is_active_by_role BEFORE INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION auth.set_is_active_by_role()';
  END IF;
END$$;

-- ==================================================================================
-- 3) Create logistics.drivers (driver management)
-- ==================================================================================
CREATE SCHEMA IF NOT EXISTS logistics;

CREATE TABLE IF NOT EXISTS logistics.drivers (
  id UUID PRIMARY KEY DEFAULT COALESCE(NULLIF(CAST(uuid_generate_v4() AS UUID), NULL), gen_random_uuid()),
  carrier_id UUID NOT NULL REFERENCES logistics.carriers(id) ON DELETE CASCADE,
  full_name VARCHAR(200) NOT NULL,
  license_number VARCHAR(100),
  license_type VARCHAR(50),
  license_expiry DATE,
  phone VARCHAR(20),
  assigned_vehicle_id UUID REFERENCES logistics.vehicles(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_drivers_carrier_id ON logistics.drivers(carrier_id);

-- ==================================================================================
-- 4) Create logistics.offers (quotes / carrier offers)
-- ==================================================================================
CREATE TABLE IF NOT EXISTS logistics.offers (
  id UUID PRIMARY KEY DEFAULT COALESCE(NULLIF(CAST(uuid_generate_v4() AS UUID), NULL), gen_random_uuid()),
  order_id UUID NOT NULL REFERENCES logistics.orders(id) ON DELETE CASCADE,
  carrier_id UUID NOT NULL REFERENCES logistics.carriers(id) ON DELETE CASCADE,
  price DECIMAL(12,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'VND',
  expires_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, rejected
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_offers_order_id ON logistics.offers(order_id);
CREATE INDEX IF NOT EXISTS idx_offers_carrier_id ON logistics.offers(carrier_id);

-- ==================================================================================
-- 5) Create logistics.invoices (optional but matches spec C6 invoice download)
-- ==================================================================================
CREATE TABLE IF NOT EXISTS logistics.invoices (
  id UUID PRIMARY KEY DEFAULT COALESCE(NULLIF(CAST(uuid_generate_v4() AS UUID), NULL), gen_random_uuid()),
  order_id UUID NOT NULL REFERENCES logistics.orders(id) ON DELETE CASCADE,
  invoice_number VARCHAR(50) UNIQUE,
  amount DECIMAL(12,2),
  currency VARCHAR(3) DEFAULT 'VND',
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  paid_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'issued',
  pdf_url TEXT
);
CREATE INDEX IF NOT EXISTS idx_invoices_order_id ON logistics.invoices(order_id);

-- ==================================================================================
-- 6) Approval automation: when an admin approves carrier, activate corresponding user
-- ==================================================================================
CREATE OR REPLACE FUNCTION admin.activate_carrier_user_on_approval()
RETURNS TRIGGER AS $$
BEGIN
  -- If there's a corresponding carrier -> user, set user active
  UPDATE auth.users u
  SET is_active = TRUE, updated_at = CURRENT_TIMESTAMP
  FROM logistics.carriers c
  WHERE c.user_id = u.id AND c.id = NEW.carrier_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_schema='admin' AND trigger_name='admin_activate_carrier_user') THEN
    EXECUTE 'CREATE TRIGGER admin_activate_carrier_user AFTER INSERT OR UPDATE ON admin.carrier_approvals FOR EACH ROW EXECUTE FUNCTION admin.activate_carrier_user_on_approval()';
  END IF;
END$$;

-- ==================================================================================
-- 7) Order numbering: create sequence and a safe generator function to avoid concurrency collisions
-- ==================================================================================
CREATE SEQUENCE IF NOT EXISTS logistics.order_seq START 1;

CREATE OR REPLACE FUNCTION logistics.generate_order_number_seq()
RETURNS TEXT AS $$
DECLARE
  seqnum BIGINT;
  year_suffix TEXT;
BEGIN
  year_suffix := TO_CHAR(CURRENT_DATE, 'YY');
  seqnum := nextval('logistics.order_seq');
  RETURN 'LTD' || year_suffix || LPAD(seqnum::text, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Update set_order_defaults to prefer sequence-based generator but keep fallback
CREATE OR REPLACE FUNCTION logistics.set_order_defaults()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    BEGIN
      NEW.order_number := logistics.generate_order_number_seq();
    EXCEPTION WHEN OTHERS THEN
      -- fallback to previous implementation
      NEW.order_number := (SELECT 'LTD' || TO_CHAR(CURRENT_DATE,'YY') || LPAD(COALESCE(MAX(CAST(regexp_replace(order_number,'\D','','g') AS INTEGER)),0)+1,6,'0') FROM logistics.orders WHERE order_number LIKE 'LTD' || TO_CHAR(CURRENT_DATE,'YY') || '%');
    END;
  END IF;
  IF NEW.tracking_number IS NULL THEN
    NEW.tracking_number := logistics.generate_tracking_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ensure trigger exists (replace if present)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='logistics' AND table_name='orders') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'logistics_set_order_defaults') THEN
      EXECUTE 'CREATE TRIGGER logistics_set_order_defaults BEFORE INSERT ON logistics.orders FOR EACH ROW EXECUTE FUNCTION logistics.set_order_defaults()';
    END IF;
  END IF;
END$$;

-- ==================================================================================
-- 8) Add recommended indexes for performance and unread notification quick queries
-- ==================================================================================
CREATE INDEX IF NOT EXISTS idx_log_orders_created_at ON logistics.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_log_orders_pickup_date ON logistics.orders(pickup_date);
CREATE INDEX IF NOT EXISTS idx_log_orders_customer_status_created ON logistics.orders(customer_id, status, created_at);
CREATE INDEX IF NOT EXISTS idx_sys_notifications_unread ON system.notifications(user_id, is_read) WHERE is_read = FALSE;

-- ==================================================================================
-- 9) Add view to present users with profile fields (compatibility with spec)
-- ==================================================================================
CREATE OR REPLACE VIEW auth.v_users_with_profile AS
SELECT u.id, u.email, u.role, u.status, u.is_active, u.email_verified, u.preferred_language, u.preferences, u.created_at, u.updated_at,
  p.first_name, p.last_name, p.phone, p.address, p.company_name
FROM auth.users u
LEFT JOIN auth.user_profiles p ON p.user_id = u.id;

-- ==================================================================================
-- 10) Make admin seed tolerant: insert admin with precomputed hash if pgcrypto unavailable
-- Note: Replace '<BCRYPT_HASH>' with an actual bcrypt hash you generate offline if you want.
-- ==================================================================================
DO $$
BEGIN
  -- Try crypt-based insert only if pgcrypto functions exist
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'gen_salt') THEN
    INSERT INTO auth.users (email, password_hash, role, status, is_active, email_verified, preferred_language)
    VALUES ('admin@lotradw.com', crypt('admin123', gen_salt('bf')), 'admin', 'active', TRUE, TRUE, 'vi')
    ON CONFLICT (email) DO NOTHING;
  ELSE
    -- If gen_salt not available, insert with a placeholder hash (update manually later)
    INSERT INTO auth.users (email, password_hash, role, status, is_active, email_verified, preferred_language)
    VALUES ('admin@lotradw.com', '<BCRYPT_HASH_OR_SET_LATER>', 'admin', 'active', TRUE, TRUE, 'vi')
    ON CONFLICT (email) DO NOTHING;
  END IF;
END$$;

-- ==================================================================================
-- 11) Sync triggers: if logistics.carriers.approval_status is updated, ensure users.is_active reflects that
-- ==================================================================================
CREATE OR REPLACE FUNCTION logistics.sync_carrier_approval_to_user()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.approval_status IS DISTINCT FROM OLD.approval_status THEN
    UPDATE auth.users u
    SET is_active = (CASE WHEN NEW.approval_status = 'active' THEN TRUE ELSE FALSE END), updated_at = CURRENT_TIMESTAMP
    FROM logistics.carriers c
    WHERE c.user_id = u.id AND c.id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='logistics' AND table_name='carriers') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE event_object_schema = 'logistics' AND event_object_table = 'carriers' AND trigger_name = 'logistics_sync_carrier_approval_to_user') THEN
      EXECUTE 'CREATE TRIGGER logistics_sync_carrier_approval_to_user AFTER UPDATE ON logistics.carriers FOR EACH ROW EXECUTE FUNCTION logistics.sync_carrier_approval_to_user()';
    END IF;
  END IF;
END$$;

-- ==================================================================================
-- 12) Add drivers -> shipments relation convenience index
-- ==================================================================================
ALTER TABLE IF EXISTS logistics.shipments
  ADD COLUMN IF NOT EXISTS driver_id UUID REFERENCES logistics.drivers(id);

CREATE INDEX IF NOT EXISTS idx_shipments_driver_id ON logistics.shipments(driver_id);

-- ==================================================================================
-- 13) Provide note for DBA actions
-- ==================================================================================
-- Note: If placeholders like '<BCRYPT_HASH_OR_SET_LATER>' exist, please replace them with a real bcrypt hash generated offline or run 'CREATE EXTENSION pgcrypto' as a superuser and re-run part of the seed.

SELECT 'initFix.sql created - review & run in pgAdmin. This file attempts to be idempotent and safe. Review <BCRYPT_HASH_OR_SET_LATER> placeholder.' AS info;
