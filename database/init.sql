-- LoTraDW Logistics Database Schema
-- Created for PostgreSQL 15+
-- Supports: Authentication, Logistics Operations, Data Warehouse, RBAC

-- Create Database
CREATE DATABASE lotradw
  WITH TEMPLATE = template0
       ENCODING = 'UTF8'
       LC_COLLATE = 'C'
       LC_CTYPE = 'C';

-- Connect to the database
\c lotradw;

-- Create Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create Schemas
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS logistics;
CREATE SCHEMA IF NOT EXISTS admin;
CREATE SCHEMA IF NOT EXISTS dw;

-- ================================
-- AUTHENTICATION SCHEMA (auth)
-- ================================

-- User Roles Enum
CREATE TYPE auth.user_role AS ENUM ('customer', 'carrier', 'admin');
CREATE TYPE auth.user_status AS ENUM ('active', 'pending', 'suspended', 'inactive');

-- Main Users Table
CREATE TABLE auth.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role auth.user_role NOT NULL DEFAULT 'customer',
    status auth.user_status NOT NULL DEFAULT 'pending',
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- User Profiles
CREATE TABLE auth.user_profiles (
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Refresh Tokens for JWT
CREATE TABLE auth.refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Password Reset Tokens
CREATE TABLE auth.password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- LOGISTICS SCHEMA (logistics)
-- ================================

-- Service Regions
CREATE TABLE logistics.regions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    province VARCHAR(100),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Product Categories
CREATE TABLE logistics.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    weight_multiplier DECIMAL(5,2) DEFAULT 1.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Carriers Information
CREATE TABLE logistics.carriers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    business_license VARCHAR(50),
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

-- Vehicle Fleet Management
CREATE TABLE logistics.vehicles (
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

-- Pricing Tables
CREATE TABLE logistics.pricing (
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

-- Orders
CREATE TYPE logistics.order_status AS ENUM (
    'draft', 'pending', 'confirmed', 'assigned', 'picked_up', 
    'in_transit', 'delivered', 'cancelled', 'returned'
);

CREATE TABLE logistics.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES auth.users(id),
    carrier_id UUID REFERENCES logistics.carriers(id),
    category_id UUID REFERENCES logistics.categories(id),
    
    -- Pickup Information
    pickup_address TEXT NOT NULL,
    pickup_city VARCHAR(100),
    pickup_province VARCHAR(100),
    pickup_postal_code VARCHAR(20),
    pickup_contact_name VARCHAR(100),
    pickup_contact_phone VARCHAR(20),
    pickup_date DATE,
    pickup_time_from TIME,
    pickup_time_to TIME,
    
    -- Delivery Information
    delivery_address TEXT NOT NULL,
    delivery_city VARCHAR(100),
    delivery_province VARCHAR(100),
    delivery_postal_code VARCHAR(20),
    delivery_contact_name VARCHAR(100),
    delivery_contact_phone VARCHAR(20),
    delivery_date DATE,
    delivery_time_from TIME,
    delivery_time_to TIME,
    
    -- Package Information
    package_description TEXT,
    weight_kg DECIMAL(8,2) NOT NULL,
    dimensions_length_cm INTEGER,
    dimensions_width_cm INTEGER,
    dimensions_height_cm INTEGER,
    declared_value DECIMAL(12,2),
    special_instructions TEXT,
    
    -- Pricing
    quoted_price DECIMAL(10,2),
    final_price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'VND',
    
    -- Status & Tracking
    status logistics.order_status DEFAULT 'draft',
    tracking_number VARCHAR(50) UNIQUE,
    estimated_delivery_date DATE,
    actual_pickup_date TIMESTAMP WITH TIME ZONE,
    actual_delivery_date TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_weight CHECK (weight_kg > 0),
    CONSTRAINT valid_dimensions CHECK (
        dimensions_length_cm IS NULL OR dimensions_length_cm > 0
    )
);

-- Order Status History
CREATE TABLE logistics.order_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES logistics.orders(id) ON DELETE CASCADE,
    previous_status logistics.order_status,
    new_status logistics.order_status NOT NULL,
    notes TEXT,
    location TEXT,
    updated_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Shipments (for detailed tracking)
CREATE TABLE logistics.shipments (
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

-- Tracking Events
CREATE TABLE logistics.tracking_events (
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

-- Customer Feedback
CREATE TABLE logistics.feedbacks (
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

-- ================================
-- ADMIN SCHEMA (admin)
-- ================================

-- Carrier Approval History
CREATE TABLE admin.carrier_approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    carrier_id UUID NOT NULL REFERENCES logistics.carriers(id) ON DELETE CASCADE,
    approved_by_admin_id UUID NOT NULL REFERENCES auth.users(id),
    previous_status auth.user_status,
    new_status auth.user_status NOT NULL,
    approval_notes TEXT,
    documents_verified BOOLEAN DEFAULT FALSE,
    approved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- System Configurations
CREATE TABLE admin.system_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value TEXT,
    description TEXT,
    updated_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Complaint Analysis
CREATE TABLE admin.complaints (
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

-- ================================
-- DATA WAREHOUSE SCHEMA (dw)
-- ================================

-- Dimension Tables

-- Customer Dimension
CREATE TABLE dw.dim_customer (
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

-- Carrier Dimension
CREATE TABLE dw.dim_carrier (
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

-- Region Dimension
CREATE TABLE dw.dim_region (
    region_key SERIAL PRIMARY KEY,
    region_id UUID UNIQUE NOT NULL,
    region_name VARCHAR(100),
    region_code VARCHAR(10),
    province VARCHAR(100),
    is_service_area BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Date Dimension
CREATE TABLE dw.dim_date (
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

-- Category Dimension
CREATE TABLE dw.dim_category (
    category_key SERIAL PRIMARY KEY,
    category_id UUID UNIQUE NOT NULL,
    category_name VARCHAR(100),
    category_code VARCHAR(20),
    weight_multiplier DECIMAL(5,2),
    is_active BOOLEAN
);

-- Fact Tables

-- Orders Fact
CREATE TABLE dw.fact_orders (
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

-- Costs Fact
CREATE TABLE dw.fact_costs (
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

-- Shipments Fact
CREATE TABLE dw.fact_shipments (
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

-- Feedbacks Fact
CREATE TABLE dw.fact_feedbacks (
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

-- Shared Delivery Optimization
CREATE TABLE dw.fact_shared_orders (
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

-- Carrier Performance Tracking
CREATE TABLE dw.fact_carrier_performance (
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

-- ================================
-- INDEXES FOR PERFORMANCE
-- ================================

-- Authentication Indexes
CREATE INDEX idx_users_email ON auth.users(email);
CREATE INDEX idx_users_role_status ON auth.users(role, status);
CREATE INDEX idx_refresh_tokens_user_id ON auth.refresh_tokens(user_id);
CREATE INDEX idx_user_profiles_user_id ON auth.user_profiles(user_id);

-- Logistics Indexes
CREATE INDEX idx_orders_customer_id ON logistics.orders(customer_id);
CREATE INDEX idx_orders_carrier_id ON logistics.orders(carrier_id);
CREATE INDEX idx_orders_status ON logistics.orders(status);
CREATE INDEX idx_orders_tracking_number ON logistics.orders(tracking_number);
CREATE INDEX idx_orders_created_at ON logistics.orders(created_at);
CREATE INDEX idx_carriers_user_id ON logistics.carriers(user_id);
CREATE INDEX idx_vehicles_carrier_id ON logistics.vehicles(carrier_id);
CREATE INDEX idx_shipments_order_id ON logistics.shipments(order_id);
CREATE INDEX idx_feedbacks_carrier_id ON logistics.feedbacks(carrier_id);
CREATE INDEX idx_pricing_regions ON logistics.pricing(from_region_id, to_region_id);

-- Data Warehouse Indexes
CREATE INDEX idx_fact_orders_date_keys ON dw.fact_orders(order_date_key, delivery_date_key);
CREATE INDEX idx_fact_orders_customer_carrier ON dw.fact_orders(customer_key, carrier_key);
CREATE INDEX idx_fact_costs_route ON dw.fact_costs(route_from_key, route_to_key);
CREATE INDEX idx_fact_shipments_dates ON dw.fact_shipments(pickup_date_key, delivery_date_key);
CREATE INDEX idx_fact_performance_carrier_period ON dw.fact_carrier_performance(carrier_key, period_date_key);

-- ================================
-- INITIAL DATA SETUP
-- ================================

-- Create Admin User
INSERT INTO auth.users (email, password_hash, role, status, email_verified) 
VALUES ('admin@lotradw.com', crypt('admin123', gen_salt('bf')), 'admin', 'active', true);

-- Insert Default Regions (Vietnam provinces)
INSERT INTO logistics.regions (name, code, province, is_active) VALUES
('Hà Nội', 'HN', 'Hà Nội', true),
('Hồ Chí Minh', 'HCM', 'Hồ Chí Minh', true),
('Đà Nẵng', 'DN', 'Đà Nẵng', true),
('Cần Thơ', 'CT', 'Cần Thơ', true),
('Hải Phòng', 'HP', 'Hải Phòng', true),
('Huế', 'HUE', 'Thừa Thiên Huế', true),
('Nha Trang', 'NT', 'Khánh Hòa', true),
('Vũng Tàu', 'VT', 'Bà Rịa - Vũng Tàu', true);

-- Insert Default Categories
INSERT INTO logistics.categories (name, code, description, weight_multiplier, is_active) VALUES
('Electronics', 'ELEC', 'Electronic devices and components', 1.5, true),
('Clothing', 'CLOTH', 'Clothing and textiles', 1.0, true),
('Food & Beverage', 'FOOD', 'Perishable and non-perishable food items', 1.2, true),
('Furniture', 'FURN', 'Furniture and home appliances', 2.0, true),
('Documents', 'DOC', 'Important documents and papers', 0.5, true),
('Medical', 'MED', 'Medical supplies and pharmaceuticals', 2.0, true),
('Fragile', 'FRAG', 'Fragile items requiring special handling', 3.0, true),
('Bulk Goods', 'BULK', 'Large volume goods', 0.8, true);

-- Insert System Configurations
INSERT INTO admin.system_configs (config_key, config_value, description) VALUES
('DEFAULT_CURRENCY', 'VND', 'Default currency for pricing'),
('MAX_ORDER_WEIGHT_KG', '1000', 'Maximum weight per order in kg'),
('MIN_DELIVERY_DAYS', '1', 'Minimum delivery days'),
('MAX_DELIVERY_DAYS', '30', 'Maximum delivery days'),
('FUEL_SURCHARGE_RATE', '0.05', 'Default fuel surcharge rate'),
('ETL_SCHEDULE', '0 2 * * *', 'Daily ETL run schedule (2 AM)'),
('PERFORMANCE_CALCULATION_PERIOD', '7', 'Days for performance calculation'),
('AUTO_APPROVAL_THRESHOLD', '4.5', 'Minimum rating for auto-approval');

-- Populate Date Dimension (for 5 years: 2024-2028)
INSERT INTO dw.dim_date (date_key, full_date, day_of_week, day_name, day_of_month, 
                        week_of_year, month_number, month_name, quarter, year, 
                        is_weekend, is_holiday)
SELECT 
    TO_CHAR(date_series, 'YYYYMMDD')::INTEGER as date_key,
    date_series::DATE as full_date,
    EXTRACT(DOW FROM date_series)::INTEGER as day_of_week,
    TO_CHAR(date_series, 'Day') as day_name,
    EXTRACT(DAY FROM date_series)::INTEGER as day_of_month,
    EXTRACT(WEEK FROM date_series)::INTEGER as week_of_year,
    EXTRACT(MONTH FROM date_series)::INTEGER as month_number,
    TO_CHAR(date_series, 'Month') as month_name,
    EXTRACT(QUARTER FROM date_series)::INTEGER as quarter,
    EXTRACT(YEAR FROM date_series)::INTEGER as year,
    CASE WHEN EXTRACT(DOW FROM date_series) IN (0, 6) THEN true ELSE false END as is_weekend,
    false as is_holiday
FROM generate_series('2024-01-01'::DATE, '2028-12-31'::DATE, '1 day'::INTERVAL) as date_series;

-- ================================
-- FUNCTIONS AND TRIGGERS
-- ================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON auth.users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON auth.user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carriers_updated_at BEFORE UPDATE ON logistics.carriers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON logistics.vehicles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON logistics.orders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_updated_at BEFORE UPDATE ON logistics.pricing 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number() 
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
    year_suffix TEXT;
BEGIN
    year_suffix := TO_CHAR(CURRENT_DATE, 'YY');
    
    SELECT 'LTD' || year_suffix || LPAD(
        (COALESCE(
            (SELECT MAX(CAST(SUBSTRING(order_number FROM 6) AS INTEGER)) 
            FROM logistics.orders 
            WHERE order_number LIKE 'LTD' || year_suffix || '%'
            ), 0
        ) + 1)::TEXT, 6, '0'
    ) INTO new_number;
    
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Function to generate tracking numbers
CREATE OR REPLACE FUNCTION generate_tracking_number() 
RETURNS TEXT AS $$
DECLARE
    new_tracking TEXT;
BEGIN
    SELECT 'TRK' || TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDDHH24MISS') || 
        LPAD((FLOOR(RANDOM() * 1000))::TEXT, 3, '0') INTO new_tracking;
    
    RETURN new_tracking;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate order and tracking numbers
CREATE OR REPLACE FUNCTION set_order_defaults()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL THEN
        NEW.order_number := generate_order_number();
    END IF;
    
    IF NEW.tracking_number IS NULL THEN
        NEW.tracking_number := generate_tracking_number();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_defaults_trigger 
    BEFORE INSERT ON logistics.orders 
    FOR EACH ROW EXECUTE FUNCTION set_order_defaults();

-- Function to log order status changes
CREATE OR REPLACE FUNCTION log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO logistics.order_status_history 
        (order_id, previous_status, new_status, notes, updated_by)
        VALUES (NEW.id, OLD.status, NEW.status, 'Status updated', NEW.updated_by);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_order_status_change_trigger 
    AFTER UPDATE ON logistics.orders 
    FOR EACH ROW EXECUTE FUNCTION log_order_status_change();

-- ================================
-- VIEWS FOR COMMON QUERIES
-- ================================

-- Active Orders View
CREATE VIEW logistics.v_active_orders AS
SELECT 
    o.id,
    o.order_number,
    o.tracking_number,
    cp.first_name || ' ' || cp.last_name as customer_name,
    c.company_name as carrier_name,
    o.pickup_address,
    o.delivery_address,
    o.weight_kg,
    o.final_price,
    o.status,
    o.created_at,
    o.estimated_delivery_date
FROM logistics.orders o
LEFT JOIN auth.user_profiles cp ON o.customer_id = cp.user_id
LEFT JOIN logistics.carriers c ON o.carrier_id = c.id
WHERE o.status NOT IN ('delivered', 'cancelled');

-- Carrier Performance View
CREATE VIEW logistics.v_carrier_performance AS
SELECT 
    c.id as carrier_id,
    c.company_name,
    COUNT(o.id) as total_orders,
    COUNT(CASE WHEN o.status = 'delivered' THEN 1 END) as completed_orders,
    COUNT(CASE WHEN o.actual_delivery_date <= o.estimated_delivery_date THEN 1 END) as on_time_orders,
    COALESCE(AVG(f.rating), 0) as avg_rating,
    SUM(o.final_price) as total_revenue
FROM logistics.carriers c
LEFT JOIN logistics.orders o ON c.id = o.carrier_id
LEFT JOIN logistics.feedbacks f ON o.id = f.order_id
WHERE c.approval_status = 'active'
GROUP BY c.id, c.company_name;

-- Daily KPIs View
CREATE VIEW admin.v_daily_kpis AS
SELECT 
    CURRENT_DATE as report_date,
    COUNT(*) as total_orders_today,
    COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_today,
    COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_today,
    SUM(final_price) as revenue_today,
    AVG(weight_kg) as avg_weight_kg,
    COUNT(DISTINCT carrier_id) as active_carriers_today
FROM logistics.orders 
WHERE DATE(created_at) = CURRENT_DATE;

-- ================================
-- GRANT PERMISSIONS
-- ================================

-- Create application roles
CREATE ROLE lotradw_app_user;
CREATE ROLE lotradw_readonly;

-- Grant permissions to application user
GRANT USAGE ON SCHEMA auth, logistics, admin, dw TO lotradw_app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA auth, logistics, admin TO lotradw_app_user;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA dw TO lotradw_app_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA auth, logistics, admin, dw TO lotradw_app_user;

-- Grant read-only permissions
GRANT USAGE ON SCHEMA auth, logistics, admin, dw TO lotradw_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA auth, logistics, admin, dw TO lotradw_readonly;

-- ================================
-- COMPLETION MESSAGE
-- ================================

SELECT 'LoTraDW Logistics Database Successfully Created!' as status,
       'Schemas: auth, logistics, admin, dw' as schemas_created,
       'Total Tables: ' || (
           SELECT COUNT(*) FROM information_schema.tables 
           WHERE table_schema IN ('auth', 'logistics', 'admin', 'dw')
       ) as total_tables;