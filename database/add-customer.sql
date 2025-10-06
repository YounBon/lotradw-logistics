-- SQL Commands để tạo role customer trong database lotradw
-- Chạy trong pgAdmin để tạo customer test

-- ============================================
-- TẠO CUSTOMER TEST ACCOUNT
-- ============================================

-- 1. Tạo customer user
INSERT INTO auth.users (
    email, 
    password_hash, 
    role, 
    status, 
    email_verified,
    created_at,
    updated_at
) VALUES (
    'customer@test.com',
    crypt('123456', gen_salt('bf')),  -- Password: 123456
    'customer',
    'active',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- 2. Lấy ID của customer vừa tạo để tạo profile
WITH new_customer AS (
    SELECT id FROM auth.users WHERE email = 'customer@test.com'
)
INSERT INTO auth.user_profiles (
    user_id,
    first_name,
    last_name,
    phone,
    company_name,
    address,
    city,
    province,
    created_at,
    updated_at
) SELECT 
    id,
    'Minh',
    'Phuc',
    '0901234567',
    'Test Company Ltd.',
    '123 Test Street, Ward 1',
    'Ho Chi Minh City',
    'Ho Chi Minh',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM new_customer;

-- ============================================
-- KIỂM TRA CUSTOMER ĐÃ TẠO
-- ============================================

-- Kiểm tra user đã tạo
SELECT 
    u.id,
    u.email,
    u.role,
    u.status,
    u.email_verified,
    u.created_at,
    p.first_name,
    p.last_name,
    p.phone,
    p.company_name
FROM auth.users u
LEFT JOIN auth.user_profiles p ON u.id = p.user_id
WHERE u.email = 'customer@test.com';

-- ============================================
-- TEST LOGIN (Kiểm tra password)
-- ============================================

-- Kiểm tra password có đúng không
SELECT 
    id,
    email,
    role,
    CASE 
        WHEN password_hash = crypt('123456', password_hash) THEN 'Password correct'
        ELSE 'Password incorrect'
    END as password_check
FROM auth.users 
WHERE email = 'customer@test.com';

-- ============================================
-- TẠO THÊM CUSTOMERS KHÁC (OPTIONAL)
-- ============================================

-- Customer 2
INSERT INTO auth.users (email, password_hash, role, status, email_verified) 
VALUES ('customer2@test.com', crypt('123456', gen_salt('bf')), 'customer', 'active', true);

-- Customer 3  
INSERT INTO auth.users (email, password_hash, role, status, email_verified) 
VALUES ('customer3@test.com', crypt('123456', gen_salt('bf')), 'customer', 'active', true);

-- ============================================
-- HIỂN THỊ TẤT CẢ CUSTOMERS
-- ============================================

SELECT 
    'All Customers' as info,
    u.email,
    u.role,
    u.status,
    u.created_at
FROM auth.users u
WHERE u.role = 'customer'
ORDER BY u.created_at;

-- ============================================
-- LOGIN CREDENTIALS CHO FRONTEND TEST
-- ============================================

/*
THÔNG TIN ĐĂNG NHẬP:
===================
Email: customer@test.com
Password: 123456
Role: customer
Status: active

Hoặc:
Email: customer2@test.com  
Password: 123456

Email: customer3@test.com
Password: 123456
*/