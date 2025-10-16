-- TestDB.sql - simplified checks (SELECT-only) to avoid transaction aborts in pgAdmin
-- Run this in pgAdmin as a single script. It intentionally avoids PL/pgSQL blocks and
-- any statements that would error if an object is missing.

SET client_min_messages = NOTICE;

-- 1) Extensions
SELECT 'EXT_pgcrypto' AS check_name, (SELECT EXISTS(SELECT 1 FROM pg_extension WHERE extname='pgcrypto')) AS present;
SELECT 'EXT_uuid-ossp' AS check_name, (SELECT EXISTS(SELECT 1 FROM pg_extension WHERE extname='uuid-ossp')) AS present;

-- 2) Schemas
SELECT s AS schema_name, EXISTS(SELECT 1 FROM information_schema.schemata WHERE schema_name = s) AS present
FROM (VALUES ('auth'),('logistics'),('admin'),('dw'),('system')) AS v(s);

-- 3) Key tables: existence + safe conditional counts using to_regclass
SELECT 'auth.users' AS table_name, to_regclass('auth.users') IS NOT NULL AS exists,
       CASE WHEN to_regclass('auth.users') IS NOT NULL THEN (SELECT count(*) FROM auth.users) ELSE NULL END AS row_count;

SELECT 'auth.user_profiles' AS table_name, to_regclass('auth.user_profiles') IS NOT NULL AS exists,
       CASE WHEN to_regclass('auth.user_profiles') IS NOT NULL THEN (SELECT count(*) FROM auth.user_profiles) ELSE NULL END AS row_count;

SELECT 'logistics.orders' AS table_name, to_regclass('logistics.orders') IS NOT NULL AS exists,
       CASE WHEN to_regclass('logistics.orders') IS NOT NULL THEN (SELECT count(*) FROM logistics.orders) ELSE NULL END AS row_count;

SELECT 'logistics.shipments' AS table_name, to_regclass('logistics.shipments') IS NOT NULL AS exists,
       CASE WHEN to_regclass('logistics.shipments') IS NOT NULL THEN (SELECT count(*) FROM logistics.shipments) ELSE NULL END AS row_count;

SELECT 'logistics.drivers' AS table_name, to_regclass('logistics.drivers') IS NOT NULL AS exists,
       CASE WHEN to_regclass('logistics.drivers') IS NOT NULL THEN (SELECT count(*) FROM logistics.drivers) ELSE NULL END AS row_count;

SELECT 'admin.carrier_approvals' AS table_name, to_regclass('admin.carrier_approvals') IS NOT NULL AS exists,
       CASE WHEN to_regclass('admin.carrier_approvals') IS NOT NULL THEN (SELECT count(*) FROM admin.carrier_approvals) ELSE NULL END AS row_count;

-- 4) Key view
SELECT 'auth.v_users_with_profile' AS view_name, to_regclass('auth.v_users_with_profile') IS NOT NULL AS present;

-- 5) Key sequence
SELECT 'logistics.order_number_seq' AS sequence_name, to_regclass('logistics.order_number_seq') IS NOT NULL AS present;

-- 6) DW dim_date (if present) - safe count
SELECT 'dw.dim_date' AS table_name, to_regclass('dw.dim_date') IS NOT NULL AS present,
       CASE WHEN to_regclass('dw.dim_date') IS NOT NULL THEN (SELECT count(*) FROM dw.dim_date) ELSE NULL END AS row_count;

-- 7) Quick sanity: count users by role if table exists (safe)
SELECT 'auth.users_by_role' AS check_name,
       CASE WHEN to_regclass('auth.users') IS NOT NULL THEN (SELECT json_agg(t) FROM (SELECT role, count(*) AS cnt FROM auth.users GROUP BY role) t) ELSE NULL END AS result;

-- Finished
-- If any SELECT above failed with an error, copy the pgAdmin error output and paste here so it can be fixed.
