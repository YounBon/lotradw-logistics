// Simple Express Backend for Customer Login
// LoTraDW Logistics - Customer Authentication

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3001;

// Database configuration
const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'lotradw',
    user: 'postgres',
    password: 'minhphuc293',
    ssl: false,
});

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Frontend URL
    credentials: true
}));
app.use(express.json());

// JWT Secret
const JWT_SECRET = 'lotradw-secret-key-2025';

// ============================================
// CUSTOMER LOGIN ENDPOINT
// ============================================

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('🔐 Login attempt:', email);

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Get customer from database
        const userQuery = `
      SELECT 
        u.id,
        u.email,
        u.password_hash,
        u.role,
        u.status,
        u.email_verified,
        p.first_name,
        p.last_name,
        p.phone,
        p.company_name
      FROM auth.users u
      LEFT JOIN auth.user_profiles p ON u.id = p.user_id
      WHERE u.email = $1 AND u.role = 'customer'
    `;

        const userResult = await pool.query(userQuery, [email]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const user = userResult.rows[0];

        // Check if user is active
        if (user.status !== 'active') {
            return res.status(401).json({
                success: false,
                message: 'Account is not active'
            });
        }

        // Verify password using PostgreSQL crypt function
        const passwordQuery = `
      SELECT password_hash = crypt($1, password_hash) as password_match
      FROM auth.users 
      WHERE id = $2
    `;

        const passwordResult = await pool.query(passwordQuery, [password, user.id]);
        const passwordMatch = passwordResult.rows[0].password_match;

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Update last login time
        await pool.query(
            'UPDATE auth.users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1',
            [user.id]
        );

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('✅ Login successful:', email);

        // Return success response
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    status: user.status,
                    profile: {
                        firstName: user.first_name,
                        lastName: user.last_name,
                        phone: user.phone,
                        companyName: user.company_name
                    }
                },
                token: token
            }
        });

    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// ============================================
// GET CUSTOMER PROFILE (Protected Route)
// ============================================

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access token required'
        });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }
        req.user = user;
        next();
    });
};

app.get('/api/customer/profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        const profileQuery = `
      SELECT 
        u.id,
        u.email,
        u.role,
        u.status,
        u.created_at,
        u.last_login_at,
        p.first_name,
        p.last_name,
        p.phone,
        p.company_name,
        p.address,
        p.city,
        p.province
      FROM auth.users u
      LEFT JOIN auth.user_profiles p ON u.id = p.user_id
      WHERE u.id = $1 AND u.role = 'customer'
    `;

        const result = await pool.query(profileQuery, [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }

        const customer = result.rows[0];

        res.json({
            success: true,
            data: {
                id: customer.id,
                email: customer.email,
                role: customer.role,
                status: customer.status,
                profile: {
                    firstName: customer.first_name,
                    lastName: customer.last_name,
                    phone: customer.phone,
                    companyName: customer.company_name,
                    address: customer.address,
                    city: customer.city,
                    province: customer.province
                },
                accountInfo: {
                    createdAt: customer.created_at,
                    lastLoginAt: customer.last_login_at
                }
            }
        });

    } catch (error) {
        console.error('❌ Profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// ============================================
// HEALTH CHECK ENDPOINT
// ============================================

app.get('/api/health', async (req, res) => {
    try {
        // Test database connection
        const result = await pool.query('SELECT current_database(), current_user, now()');

        res.json({
            success: true,
            message: 'API is working',
            database: {
                connected: true,
                database: result.rows[0].current_database,
                user: result.rows[0].current_user,
                time: result.rows[0].now
            },
            server: {
                port: PORT,
                environment: 'development'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Database connection failed',
            error: error.message
        });
    }
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
    console.log('🚀 LoTraDW Customer Login API started!');
    console.log(`📡 Server running on: http://localhost:${PORT}`);
    console.log(`📊 Database: lotradw`);
    console.log(`🔐 Endpoints:`);
    console.log(`   POST /api/auth/login - Customer login`);
    console.log(`   GET  /api/customer/profile - Get customer profile`);
    console.log(`   GET  /api/health - Health check`);
    console.log('');
    console.log('📋 Test Login Credentials:');
    console.log('   Email: customer@test.com');
    console.log('   Password: 123456');
    console.log('');
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down server...');
    await pool.end();
    process.exit(0);
});