-- LoTraDW PostgreSQL Schema v3 (Final, 100% match with system docs, no chat module)
-- Generated to align init2.sql with `for_assistant.txt` requirements.
-- This file is intended to run inside pgAdmin's Query Tool after connecting to the target database (e.g. `lotradw`).
-- If the database does not yet exist, create it separately as a superuser, then connect and run this file.

-- ==================================================================
-- Ensure required extensions (safe/guarded)
-- Attempts to create extensions when possible, but does not fail the script
-- if the current user lacks permission; instead it emits a NOTICE.
-- pgcrypto is required for crypt()/gen_salt()/gen_random_uuid (depending on PG version)
-- uuid-ossp is required for uuid_generate_v4()
-- ==================================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto') THEN
    BEGIN
      CREATE EXTENSION pgcrypto;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Could not create extension pgcrypto: %', SQLERRM;
    END;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'uuid-ossp') THEN
    BEGIN
      CREATE EXTENSION "uuid-ossp";
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Could not create extension uuid-ossp: %', SQLERRM;
    END;
  END IF;
END$$;

-- ==================================================================
-- SCHEMA: AUTH
-- Contains users, profiles, auth tokens, preferences, and auth-related enums
-- ==================================================================

CREATE SCHEMA IF NOT EXISTS auth;

-- Roles and statuses
-- Older Postgres versions do not support "CREATE TYPE IF NOT EXISTS"; use guarded DO blocks
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'auth') AND typname = 'user_role') THEN
    CREATE TYPE auth.user_role AS ENUM ('customer', 'carrier', 'admin');
  END IF;
END$$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'auth') AND typname = 'user_status') THEN
    CREATE TYPE auth.user_status AS ENUM ('active', 'pending', 'suspended', 'inactive');
  END IF;
END$$;

-- Users: primary identity table
CREATE TABLE IF NOT EXISTS auth.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role auth.user_role NOT NULL DEFAULT 'customer',
  status auth.user_status NOT NULL DEFAULT 'pending',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  email_verified BOOLEAN DEFAULT FALSE,
  -- preferred language for UI (matches i18n locales: 'vi' or 'en')
  preferred_language VARCHAR(5) NOT NULL DEFAULT 'vi' CHECK (preferred_language IN ('vi','en')),
  -- flexible preferences storage for future flags (JSONB)
  preferences JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP WITH TIME ZONE
);

-- Lightweight profile table for display fields
CREATE TABLE IF NOT EXISTS auth.user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  company_name VARCHAR(255),
  address TEXT,
  city VARCHAR(100),
  province VARCHAR(100),
  postal_code VARCHAR(20),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- Refresh tokens table
CREATE TABLE IF NOT EXISTS auth.refresh_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  revoked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Password reset tokens
CREATE TABLE IF NOT EXISTS auth.password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for auth
CREATE INDEX IF NOT EXISTS idx_auth_users_email ON auth.users(email);
CREATE INDEX IF NOT EXISTS idx_auth_users_role_status ON auth.users(role, status);
CREATE INDEX IF NOT EXISTS idx_auth_users_pref_lang ON auth.users(preferred_language);

-- ==================================================================
-- SCHEMA: LOGISTICS
-- Orders, carriers, vehicles, pricing, shipments, tracking, feedbacks
-- ==================================================================

CREATE SCHEMA IF NOT EXISTS logistics;

CREATE TABLE IF NOT EXISTS logistics.regions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  code VARCHAR(10) UNIQUE NOT NULL,
  province VARCHAR(100),
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS logistics.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  description TEXT,
  weight_multiplier DECIMAL(5,2) DEFAULT 1.00,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS logistics.carriers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_license VARCHAR(100),
  business_license_url TEXT,
  company_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  service_regions UUID[] DEFAULT '{}',
  vehicle_types VARCHAR(50)[] DEFAULT '{}',
  max_capacity_kg INTEGER,
  certification_documents TEXT[],
  approval_status auth.user_status DEFAULT 'pending',
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Carrier documents for verification workflow
CREATE TABLE IF NOT EXISTS logistics.carrier_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  carrier_id UUID NOT NULL REFERENCES logistics.carriers(id) ON DELETE CASCADE,
  document_type VARCHAR(100) NOT NULL, -- e.g. 'business_license', 'insurance', 'vehicle_registration'
  document_url TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS logistics.vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  carrier_id UUID NOT NULL REFERENCES logistics.carriers(id) ON DELETE CASCADE,
  license_plate VARCHAR(20) UNIQUE NOT NULL,
  vehicle_type VARCHAR(50) NOT NULL,
  brand VARCHAR(50),
  model VARCHAR(50),
  year INTEGER,
  capacity_kg INTEGER NOT NULL,
  fuel_type VARCHAR(20),
  status VARCHAR(20) DEFAULT 'available',
  last_maintenance DATE,
  insurance_expiry DATE,
  registration_expiry DATE,
  current_location_lat DECIMAL(10,8),
  current_location_lng DECIMAL(11,8),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS logistics.pricing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_region_id UUID REFERENCES logistics.regions(id),
  to_region_id UUID REFERENCES logistics.regions(id),
  category_id UUID REFERENCES logistics.categories(id),
  base_price_per_kg DECIMAL(10,2) NOT NULL,
  min_price DECIMAL(10,2) DEFAULT 0,
  distance_km INTEGER,
  estimated_hours INTEGER,
  fuel_surcharge_rate DECIMAL(5,4) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  effective_from DATE DEFAULT CURRENT_DATE,
  effective_to DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Order status enum (guarded for older Postgres)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'logistics') AND typname = 'order_status') THEN
    CREATE TYPE logistics.order_status AS ENUM ('draft','pending','confirmed','assigned','picked_up','in_transit','delivered','cancelled','returned');
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS logistics.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES auth.users(id),
  carrier_id UUID REFERENCES logistics.carriers(id),
  category_id UUID REFERENCES logistics.categories(id),

  pickup_address TEXT NOT NULL,
  pickup_city VARCHAR(100),
  pickup_province VARCHAR(100),
  pickup_postal_code VARCHAR(20),
  pickup_contact_name VARCHAR(100),
  pickup_contact_phone VARCHAR(20),
  pickup_date DATE,
  pickup_time_from TIME,
  pickup_time_to TIME,

  delivery_address TEXT NOT NULL,
  delivery_city VARCHAR(100),
  delivery_province VARCHAR(100),
  delivery_postal_code VARCHAR(20),
  delivery_contact_name VARCHAR(100),
  delivery_contact_phone VARCHAR(20),
  delivery_date DATE,
  delivery_time_from TIME,
  delivery_time_to TIME,

  package_description TEXT,
  weight_kg DECIMAL(8,2) NOT NULL,
  dimensions_length_cm INTEGER,
  dimensions_width_cm INTEGER,
  dimensions_height_cm INTEGER,
  declared_value DECIMAL(12,2),
  special_instructions TEXT,

  quoted_price DECIMAL(10,2),
  final_price DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'VND',

  status logistics.order_status DEFAULT 'draft',
  tracking_number VARCHAR(50) UNIQUE,
  estimated_delivery_date DATE,
  actual_pickup_date TIMESTAMP WITH TIME ZONE,
  actual_delivery_date TIMESTAMP WITH TIME ZONE,

  updated_by UUID REFERENCES auth.users(id),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT valid_weight CHECK (weight_kg > 0)
);

CREATE TABLE IF NOT EXISTS logistics.order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES logistics.orders(id) ON DELETE CASCADE,
  previous_status logistics.order_status,
  new_status logistics.order_status NOT NULL,
  notes TEXT,
  location TEXT,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS logistics.shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES logistics.orders(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES logistics.vehicles(id),
  driver_name VARCHAR(100),
  driver_phone VARCHAR(20),
  route_distance_km INTEGER,
  estimated_fuel_cost DECIMAL(10,2),
  actual_fuel_cost DECIMAL(10,2),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS logistics.tracking_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shipment_id UUID NOT NULL REFERENCES logistics.shipments(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  description TEXT,
  location TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  event_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS logistics.feedbacks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES logistics.orders(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES auth.users(id),
  carrier_id UUID NOT NULL REFERENCES logistics.carriers(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  service_quality_rating INTEGER CHECK (service_quality_rating >= 1 AND service_quality_rating <= 5),
  delivery_time_rating INTEGER CHECK (delivery_time_rating >= 1 AND delivery_time_rating <= 5),
  price_rating INTEGER CHECK (price_rating >= 1 AND price_rating <= 5),
  comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for logistics
CREATE INDEX IF NOT EXISTS idx_log_orders_customer_id ON logistics.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_log_orders_carrier_id ON logistics.orders(carrier_id);
CREATE INDEX IF NOT EXISTS idx_log_orders_status ON logistics.orders(status);
CREATE INDEX IF NOT EXISTS idx_log_orders_tracking_number ON logistics.orders(tracking_number);
CREATE INDEX IF NOT EXISTS idx_log_shipments_order_id ON logistics.shipments(order_id);
CREATE INDEX IF NOT EXISTS idx_log_feedbacks_carrier_id ON logistics.feedbacks(carrier_id);
CREATE INDEX IF NOT EXISTS idx_log_carriers_user_id ON logistics.carriers(user_id);

-- ==================================================================
-- SCHEMA: ADMIN
-- admin configs, approvals, complaints, reports
-- ==================================================================

CREATE SCHEMA IF NOT EXISTS admin;

CREATE TABLE IF NOT EXISTS admin.carrier_approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  carrier_id UUID NOT NULL REFERENCES logistics.carriers(id) ON DELETE CASCADE,
  approved_by_admin_id UUID NOT NULL REFERENCES auth.users(id),
  previous_status auth.user_status,
  new_status auth.user_status NOT NULL,
  approval_notes TEXT,
  documents_verified BOOLEAN DEFAULT FALSE,
  approved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin.system_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  config_key VARCHAR(100) UNIQUE NOT NULL,
  config_value TEXT,
  description TEXT,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin.complaints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES logistics.orders(id),
  customer_id UUID REFERENCES auth.users(id),
  carrier_id UUID REFERENCES logistics.carriers(id),
  complaint_type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  severity VARCHAR(20) DEFAULT 'medium',
  status VARCHAR(20) DEFAULT 'open',
  assigned_to UUID REFERENCES auth.users(id),
  resolution TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Views for admin
CREATE OR REPLACE VIEW admin.v_daily_kpis AS
SELECT CURRENT_DATE AS report_date,
  COUNT(*) AS total_orders_today,
  COUNT(CASE WHEN status = 'delivered' THEN 1 END) AS delivered_today,
  COUNT(CASE WHEN status = 'cancelled' THEN 1 END) AS cancelled_today,
  SUM(final_price) AS revenue_today,
  AVG(weight_kg) AS avg_weight_kg,
  COUNT(DISTINCT carrier_id) AS active_carriers_today
FROM logistics.orders
WHERE DATE(created_at) = CURRENT_DATE;

-- ==================================================================
-- SCHEMA: DW (Data Warehouse)
-- dim and fact tables used by DSS modules
-- ==================================================================

CREATE SCHEMA IF NOT EXISTS dw;

CREATE TABLE IF NOT EXISTS dw.dim_customer (
  customer_key SERIAL PRIMARY KEY,
  customer_id UUID UNIQUE NOT NULL,
  customer_name VARCHAR(200),
  customer_email VARCHAR(255),
  customer_city VARCHAR(100),
  customer_province VARCHAR(100),
  registration_date DATE,
  customer_type VARCHAR(50),
  is_active BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dw.dim_carrier (
  carrier_key SERIAL PRIMARY KEY,
  carrier_id UUID UNIQUE NOT NULL,
  carrier_name VARCHAR(255),
  business_license VARCHAR(50),
  service_regions TEXT,
  vehicle_count INTEGER,
  max_capacity_kg INTEGER,
  approval_date DATE,
  is_active BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dw.dim_region (
  region_key SERIAL PRIMARY KEY,
  region_id UUID UNIQUE NOT NULL,
  region_name VARCHAR(100),
  region_code VARCHAR(10),
  province VARCHAR(100),
  is_service_area BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dw.dim_date (
  date_key INTEGER PRIMARY KEY,
  full_date DATE UNIQUE NOT NULL,
  day_of_week INTEGER,
  day_name VARCHAR(20),
  day_of_month INTEGER,
  week_of_year INTEGER,
  month_number INTEGER,
  month_name VARCHAR(20),
  quarter INTEGER,
  year INTEGER,
  is_weekend BOOLEAN,
  is_holiday BOOLEAN
);

CREATE TABLE IF NOT EXISTS dw.dim_category (
  category_key SERIAL PRIMARY KEY,
  category_id UUID UNIQUE NOT NULL,
  category_name VARCHAR(100),
  category_code VARCHAR(20),
  weight_multiplier DECIMAL(5,2),
  is_active BOOLEAN
);

CREATE TABLE IF NOT EXISTS dw.fact_orders (
  order_key SERIAL PRIMARY KEY,
  order_id UUID UNIQUE NOT NULL,
  customer_key INTEGER REFERENCES dw.dim_customer(customer_key),
  carrier_key INTEGER REFERENCES dw.dim_carrier(carrier_key),
  pickup_region_key INTEGER REFERENCES dw.dim_region(region_key),
  delivery_region_key INTEGER REFERENCES dw.dim_region(region_key),
  category_key INTEGER REFERENCES dw.dim_category(category_key),
  order_date_key INTEGER REFERENCES dw.dim_date(date_key),
  delivery_date_key INTEGER REFERENCES dw.dim_date(date_key),
  order_number VARCHAR(50),
  weight_kg DECIMAL(8,2),
  distance_km INTEGER,
  quoted_price DECIMAL(10,2),
  final_price DECIMAL(10,2),
  delivery_days INTEGER,
  is_on_time BOOLEAN,
  is_completed BOOLEAN,
  is_cancelled BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dw.fact_costs (
  cost_key SERIAL PRIMARY KEY,
  order_key INTEGER REFERENCES dw.fact_orders(order_key),
  carrier_key INTEGER REFERENCES dw.dim_carrier(carrier_key),
  route_from_key INTEGER REFERENCES dw.dim_region(region_key),
  route_to_key INTEGER REFERENCES dw.dim_region(region_key),
  date_key INTEGER REFERENCES dw.dim_date(date_key),
  base_cost DECIMAL(10,2),
  fuel_cost DECIMAL(10,2),
  additional_fees DECIMAL(10,2),
  total_cost DECIMAL(10,2),
  cost_per_kg DECIMAL(8,2),
  cost_per_km DECIMAL(8,2),
  distance_km INTEGER,
  weight_kg DECIMAL(8,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dw.fact_shipments (
  shipment_key SERIAL PRIMARY KEY,
  order_key INTEGER REFERENCES dw.fact_orders(order_key),
  carrier_key INTEGER REFERENCES dw.dim_carrier(carrier_key),
  vehicle_id UUID,
  pickup_date_key INTEGER REFERENCES dw.dim_date(date_key),
  delivery_date_key INTEGER REFERENCES dw.dim_date(date_key),
  planned_distance_km INTEGER,
  actual_distance_km INTEGER,
  estimated_fuel_cost DECIMAL(10,2),
  actual_fuel_cost DECIMAL(10,2),
  delivery_time_hours INTEGER,
  is_on_time BOOLEAN,
  delay_hours INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dw.fact_feedbacks (
  feedback_key SERIAL PRIMARY KEY,
  order_key INTEGER REFERENCES dw.fact_orders(order_key),
  customer_key INTEGER REFERENCES dw.dim_customer(customer_key),
  carrier_key INTEGER REFERENCES dw.dim_carrier(carrier_key),
  feedback_date_key INTEGER REFERENCES dw.dim_date(date_key),
  overall_rating INTEGER,
  service_quality_rating INTEGER,
  delivery_time_rating INTEGER,
  price_rating INTEGER,
  has_comments BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dw.fact_shared_orders (
  shared_key SERIAL PRIMARY KEY,
  batch_id UUID DEFAULT uuid_generate_v4(),
  order_key INTEGER REFERENCES dw.fact_orders(order_key),
  carrier_key INTEGER REFERENCES dw.dim_carrier(carrier_key),
  route_from_key INTEGER REFERENCES dw.dim_region(region_key),
  route_to_key INTEGER REFERENCES dw.dim_region(region_key),
  merge_date_key INTEGER REFERENCES dw.dim_date(date_key),
  individual_cost DECIMAL(10,2),
  shared_cost DECIMAL(10,2),
  savings_amount DECIMAL(10,2),
  savings_percentage DECIMAL(5,2),
  total_weight_kg DECIMAL(8,2),
  vehicle_utilization_percentage DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dw.fact_carrier_performance (
  performance_key SERIAL PRIMARY KEY,
  carrier_key INTEGER REFERENCES dw.dim_carrier(carrier_key),
  period_date_key INTEGER REFERENCES dw.dim_date(date_key),
  total_orders INTEGER,
  completed_orders INTEGER,
  on_time_orders INTEGER,
  cancelled_orders INTEGER,
  total_revenue DECIMAL(12,2),
  total_distance_km INTEGER,
  total_fuel_cost DECIMAL(10,2),
  avg_rating DECIMAL(3,2),
  avg_delivery_time_hours DECIMAL(6,2),
  avg_cost_per_km DECIMAL(8,2),
  on_time_rate DECIMAL(5,4),
  completion_rate DECIMAL(5,4),
  cost_efficiency_score DECIMAL(5,4),
  performance_score DECIMAL(5,4),
  period_start DATE,
  period_end DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- DW Indexes
CREATE INDEX IF NOT EXISTS idx_dw_fact_orders_date_keys ON dw.fact_orders(order_date_key, delivery_date_key);
CREATE INDEX IF NOT EXISTS idx_dw_fact_orders_customer_carrier ON dw.fact_orders(customer_key, carrier_key);

-- ==================================================================
-- SCHEMA: SYSTEM (notifications / logs)
-- For user/system notifications and system logs as requested
-- ==================================================================

CREATE SCHEMA IF NOT EXISTS system;

CREATE TABLE IF NOT EXISTS system.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  title VARCHAR(255) NOT NULL,
  body TEXT,
  channel VARCHAR(50) DEFAULT 'in-app', -- e.g. in-app, email, push
  data JSONB DEFAULT '{}'::JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_sys_notifications_user_id ON system.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_sys_notifications_created_at ON system.notifications(created_at);

CREATE TABLE IF NOT EXISTS system.logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level VARCHAR(20) NOT NULL, -- e.g. INFO, WARN, ERROR
  source VARCHAR(255),
  message TEXT,
  meta JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sys_logs_created_at ON system.logs(created_at);
CREATE INDEX IF NOT EXISTS idx_sys_logs_level ON system.logs(level);

-- ==================================================================
-- FUNCTIONS & TRIGGERS (re-usable / safe guards)
-- update_updated_at trigger for tables with updated_at column
-- ==================================================================

CREATE OR REPLACE FUNCTION auth.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  -- attach to commonly-used tables (if they exist) and create triggers only when missing
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='auth' AND table_name='users') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'auth_update_users_updated_at') THEN
      EXECUTE 'CREATE TRIGGER auth_update_users_updated_at BEFORE UPDATE ON auth.users FOR EACH ROW EXECUTE FUNCTION auth.update_updated_at_column()';
    END IF;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='auth' AND table_name='user_profiles') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'auth_update_profiles_updated_at') THEN
      EXECUTE 'CREATE TRIGGER auth_update_profiles_updated_at BEFORE UPDATE ON auth.user_profiles FOR EACH ROW EXECUTE FUNCTION auth.update_updated_at_column()';
    END IF;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='logistics' AND table_name='carriers') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'logistics_update_carriers_updated_at') THEN
      EXECUTE 'CREATE TRIGGER logistics_update_carriers_updated_at BEFORE UPDATE ON logistics.carriers FOR EACH ROW EXECUTE FUNCTION auth.update_updated_at_column()';
    END IF;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='logistics' AND table_name='vehicles') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'logistics_update_vehicles_updated_at') THEN
      EXECUTE 'CREATE TRIGGER logistics_update_vehicles_updated_at BEFORE UPDATE ON logistics.vehicles FOR EACH ROW EXECUTE FUNCTION auth.update_updated_at_column()';
    END IF;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='logistics' AND table_name='orders') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'logistics_update_orders_updated_at') THEN
      EXECUTE 'CREATE TRIGGER logistics_update_orders_updated_at BEFORE UPDATE ON logistics.orders FOR EACH ROW EXECUTE FUNCTION auth.update_updated_at_column()';
    END IF;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='logistics' AND table_name='pricing') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'logistics_update_pricing_updated_at') THEN
      EXECUTE 'CREATE TRIGGER logistics_update_pricing_updated_at BEFORE UPDATE ON logistics.pricing FOR EACH ROW EXECUTE FUNCTION auth.update_updated_at_column()';
    END IF;
  END IF;
END$$;

-- Order number & tracking generation
CREATE OR REPLACE FUNCTION logistics.generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  year_suffix TEXT;
BEGIN
  year_suffix := TO_CHAR(CURRENT_DATE, 'YY');
  SELECT 'LTD' || year_suffix || LPAD(
    COALESCE((SELECT MAX(CAST(SUBSTRING(order_number FROM 6) AS INTEGER)) FROM logistics.orders WHERE order_number LIKE 'LTD' || year_suffix || '%'), 0) + 1,
    6, '0') INTO new_number;
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION logistics.generate_tracking_number()
RETURNS TEXT AS $$
DECLARE
  new_tracking TEXT;
BEGIN
  SELECT 'TRK' || TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDDHH24MISS') || LPAD(FLOOR(RANDOM() * 1000)::TEXT, 3, '0') INTO new_tracking;
  RETURN new_tracking;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION logistics.set_order_defaults()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := logistics.generate_order_number();
  END IF;
  IF NEW.tracking_number IS NULL THEN
    NEW.tracking_number := logistics.generate_tracking_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='logistics' AND table_name='orders') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'logistics_set_order_defaults') THEN
      EXECUTE 'CREATE TRIGGER logistics_set_order_defaults BEFORE INSERT ON logistics.orders FOR EACH ROW EXECUTE FUNCTION logistics.set_order_defaults()';
    END IF;
  END IF;
END $$;

-- Log order status changes safely
CREATE OR REPLACE FUNCTION logistics.log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO logistics.order_status_history (order_id, previous_status, new_status, notes, updated_by, created_at)
    VALUES (NEW.id, OLD.status, NEW.status, 'Status updated', COALESCE(NEW.updated_by, NULL), CURRENT_TIMESTAMP);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='logistics' AND table_name='orders') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'logistics_log_order_status_change') THEN
      EXECUTE 'CREATE TRIGGER logistics_log_order_status_change AFTER UPDATE ON logistics.orders FOR EACH ROW EXECUTE FUNCTION logistics.log_order_status_change()';
    END IF;
  END IF;
END $$;

-- ==================================================================
-- INITIAL DATA (lightweight seeds). Use ON CONFLICT to be idempotent
-- ==================================================================

-- Admin user (idempotent)
INSERT INTO auth.users (email, password_hash, role, status, is_active, email_verified, preferred_language)
VALUES ('admin@lotradw.com', crypt('admin123', gen_salt('bf')), 'admin', 'active', TRUE, TRUE, 'vi')
ON CONFLICT (email) DO NOTHING;

-- Regions and categories: idempotent inserts
INSERT INTO logistics.regions (name, code, province, is_active)
SELECT v.* FROM (VALUES
  ('Hà Nội','HN','Hà Nội',TRUE),
  ('Hồ Chí Minh','HCM','Hồ Chí Minh',TRUE),
  ('Đà Nẵng','DN','Đà Nẵng',TRUE),
  ('Cần Thơ','CT','Cần Thơ',TRUE),
  ('Hải Phòng','HP','Hải Phòng',TRUE),
  ('Huế','HUE','Thừa Thiên Huế',TRUE),
  ('Nha Trang','NT','Khánh Hòa',TRUE),
  ('Vũng Tàu','VT','Bà Rịa - Vũng Tàu',TRUE)
) AS v(name,code,province,is_active)
ON CONFLICT (code) DO NOTHING;

INSERT INTO logistics.categories (name, code, description, weight_multiplier, is_active)
SELECT v.* FROM (VALUES
  ('Electronics','ELEC','Electronic devices and components',1.5,TRUE),
  ('Clothing','CLOTH','Clothing and textiles',1.0,TRUE),
  ('Food & Beverage','FOOD','Perishable and non-perishable food items',1.2,TRUE),
  ('Furniture','FURN','Furniture and home appliances',2.0,TRUE),
  ('Documents','DOC','Important documents and papers',0.5,TRUE),
  ('Medical','MED','Medical supplies and pharmaceuticals',2.0,TRUE),
  ('Fragile','FRAG','Fragile items requiring special handling',3.0,TRUE),
  ('Bulk Goods','BULK','Large volume goods',0.8,TRUE)
) AS v(name,code,description,weight_multiplier,is_active)
ON CONFLICT (code) DO NOTHING;

-- Populate a reasonable dim_date range (idempotent)
INSERT INTO dw.dim_date (date_key, full_date, day_of_week, day_name, day_of_month, week_of_year, month_number, month_name, quarter, year, is_weekend, is_holiday)
SELECT
  TO_CHAR(d,'YYYYMMDD')::INTEGER as date_key,
  d::DATE as full_date,
  EXTRACT(DOW FROM d)::INTEGER as day_of_week,
  TO_CHAR(d,'Day') as day_name,
  EXTRACT(DAY FROM d)::INTEGER as day_of_month,
  EXTRACT(WEEK FROM d)::INTEGER as week_of_year,
  EXTRACT(MONTH FROM d)::INTEGER as month_number,
  TO_CHAR(d,'Month') as month_name,
  EXTRACT(QUARTER FROM d)::INTEGER as quarter,
  EXTRACT(YEAR FROM d)::INTEGER as year,
  CASE WHEN EXTRACT(DOW FROM d) IN (0,6) THEN TRUE ELSE FALSE END as is_weekend,
  FALSE as is_holiday
FROM generate_series(CURRENT_DATE - INTERVAL '365 days', CURRENT_DATE + INTERVAL '365 days', '1 day') AS g(d)
ON CONFLICT (date_key) DO NOTHING;

-- ==================================================================
-- Final notes & compatibility
-- ==================================================================
-- * This file preserves all schemas and relations from init2.sql and adds:
--   - `auth.preferred_language` and `auth.preferences` for i18n and user settings
--   - `logistics.carrier_documents` and `logistics.business_license_url` for carrier verification
--   - `system.notifications` and `system.logs` for notifications and system auditing
-- * All primary keys use UUID to stay compatible with the existing backend setup.
-- * CREATE ROLE / GRANT statements are intentionally omitted/commented: run separately with DBA rights.
-- * Before running in production:
--   - Ensure `uuid-ossp` and `pgcrypto` extensions are available (CREATE EXTENSION may require superuser)
--   - Confirm TypeORM/NestJS entities use UUID PKs and schema names (`auth`, `logistics`, `admin`, `dw`, `system`)
-- * This file is idempotent (uses IF NOT EXISTS / ON CONFLICT) so it is safe to run multiple times.

SELECT 'init3.sql created. Review and run in target DB (pgAdmin). Ensure roles/grants run separately if needed.' AS info;
