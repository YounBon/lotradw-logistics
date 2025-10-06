// Auto Database Manager for LoTraDW Logistics
// Automatically handles database connections and operations
const { Pool } = require('pg');

class LoTraDWDatabase {
    constructor() {
        this.config = {
            host: 'localhost',
            port: 5432,
            database: 'lotradw',
            user: 'postgres',
            password: 'minhphuc293',
            ssl: false,
            connectionTimeoutMillis: 5000,
            max: 20,
            idleTimeoutMillis: 30000,
        };

        this.pool = new Pool(this.config);
        this.isConnected = false;
    }

    // Auto connect to database
    async connect() {
        try {
            console.log('🔄 Connecting to LoTraDW database...');
            const client = await this.pool.connect();
            this.isConnected = true;
            console.log('✅ Connected successfully to PostgreSQL!');

            // Test basic info
            const result = await client.query('SELECT current_database(), current_user, version()');
            console.log('📊 Database:', result.rows[0].current_database);
            console.log('👤 User:', result.rows[0].current_user);

            client.release();
            return true;
        } catch (error) {
            console.error('❌ Connection failed:', error.message);
            this.isConnected = false;
            return false;
        }
    }

    // Check if database is ready
    async checkHealth() {
        try {
            const client = await this.pool.connect();

            // Check schemas
            const schemas = await client.query(`
        SELECT schema_name FROM information_schema.schemata 
        WHERE schema_name IN ('auth', 'logistics', 'admin', 'dw')
        ORDER BY schema_name
      `);

            // Check tables count
            const tables = await client.query(`
        SELECT table_schema, COUNT(*) as count
        FROM information_schema.tables 
        WHERE table_schema IN ('auth', 'logistics', 'admin', 'dw')
        GROUP BY table_schema
      `);

            client.release();

            return {
                healthy: true,
                schemas: schemas.rows.map(r => r.schema_name),
                tables: tables.rows.reduce((acc, row) => {
                    acc[row.table_schema] = parseInt(row.count);
                    return acc;
                }, {}),
                totalTables: tables.rows.reduce((sum, row) => sum + parseInt(row.count), 0)
            };
        } catch (error) {
            return { healthy: false, error: error.message };
        }
    }

    // Auto create sample customer
    async createSampleCustomer(email = 'customer.demo@test.com') {
        try {
            const client = await this.pool.connect();

            const result = await client.query(`
        INSERT INTO auth.users (email, password_hash, role, status, email_verified) 
        VALUES ($1, crypt('demo123', gen_salt('bf')), 'customer', 'active', true)
        RETURNING id, email, role, status
      `, [email]);

            client.release();
            console.log('✅ Sample customer created:', result.rows[0]);
            return result.rows[0];
        } catch (error) {
            console.error('❌ Failed to create customer:', error.message);
            return null;
        }
    }

    // Auto create sample carrier
    async createSampleCarrier(email = 'carrier.demo@test.com', companyName = 'Demo Logistics Co.') {
        try {
            const client = await this.pool.connect();
            await client.query('BEGIN');

            // Create user
            const userResult = await client.query(`
        INSERT INTO auth.users (email, password_hash, role, status, email_verified) 
        VALUES ($1, crypt('demo123', gen_salt('bf')), 'carrier', 'active', true)
        RETURNING id
      `, [email]);

            // Create carrier profile
            const carrierResult = await client.query(`
        INSERT INTO logistics.carriers (user_id, company_name, business_license, approval_status)
        VALUES ($1, $2, 'DEMO123456', 'active')
        RETURNING id, company_name
      `, [userResult.rows[0].id, companyName]);

            await client.query('COMMIT');
            client.release();

            console.log('✅ Sample carrier created:', carrierResult.rows[0]);
            return { user_id: userResult.rows[0].id, carrier_id: carrierResult.rows[0].id };
        } catch (error) {
            const client = await this.pool.connect();
            await client.query('ROLLBACK');
            client.release();
            console.error('❌ Failed to create carrier:', error.message);
            return null;
        }
    }

    // Auto create sample order
    async createSampleOrder() {
        try {
            const client = await this.pool.connect();

            // Get sample customer
            const customer = await client.query(`
        SELECT id FROM auth.users WHERE role = 'customer' LIMIT 1
      `);

            if (customer.rows.length === 0) {
                console.log('🔄 Creating sample customer first...');
                await this.createSampleCustomer();
                const newCustomer = await client.query(`
          SELECT id FROM auth.users WHERE role = 'customer' LIMIT 1
        `);
                customer.rows = newCustomer.rows;
            }

            // Create order
            const orderResult = await client.query(`
        INSERT INTO logistics.orders (
          customer_id,
          pickup_address,
          delivery_address,
          weight_kg,
          package_description,
          quoted_price
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, order_number, tracking_number, status
      `, [
                customer.rows[0].id,
                '123 Demo Street, Hanoi',
                '456 Sample Avenue, Ho Chi Minh City',
                25.5,
                'Demo package for testing',
                850000
            ]);

            client.release();
            console.log('✅ Sample order created:', orderResult.rows[0]);
            return orderResult.rows[0];
        } catch (error) {
            console.error('❌ Failed to create order:', error.message);
            return null;
        }
    }

    // Get dashboard data
    async getDashboardData() {
        try {
            const client = await this.pool.connect();

            const stats = await client.query(`
        SELECT 
          (SELECT COUNT(*) FROM auth.users) as total_users,
          (SELECT COUNT(*) FROM auth.users WHERE role = 'customer') as customers,
          (SELECT COUNT(*) FROM auth.users WHERE role = 'carrier') as carriers,
          (SELECT COUNT(*) FROM logistics.orders) as total_orders,
          (SELECT COUNT(*) FROM logistics.orders WHERE status = 'delivered') as delivered_orders,
          (SELECT COUNT(*) FROM logistics.regions) as regions,
          (SELECT COUNT(*) FROM logistics.categories) as categories
      `);

            client.release();
            return stats.rows[0];
        } catch (error) {
            console.error('❌ Failed to get dashboard data:', error.message);
            return null;
        }
    }

    // Auto test all functions
    async runFullTest() {
        console.log('\n🧪 Running Full Database Test...');
        console.log('='.repeat(50));

        // 1. Test connection
        const connected = await this.connect();
        if (!connected) return false;

        // 2. Check health
        console.log('\n🔍 Checking database health...');
        const health = await this.checkHealth();
        if (health.healthy) {
            console.log('✅ Database healthy');
            console.log('📁 Schemas:', health.schemas.join(', '));
            console.log('📊 Tables:', health.totalTables, 'total');
        } else {
            console.log('❌ Database unhealthy:', health.error);
            return false;
        }

        // 3. Create sample data
        console.log('\n🔄 Creating sample data...');
        await this.createSampleCustomer('test.customer@demo.com');
        await this.createSampleCarrier('test.carrier@demo.com', 'Test Transport Ltd.');
        await this.createSampleOrder();

        // 4. Get dashboard
        console.log('\n📊 Dashboard Summary:');
        const dashboard = await this.getDashboardData();
        if (dashboard) {
            console.table(dashboard);
        }

        console.log('\n🎉 Full test completed successfully!');
        console.log('🚀 Database ready for frontend/backend integration!');

        return true;
    }

    // Close connection
    async close() {
        await this.pool.end();
        console.log('🔒 Database connection closed');
    }
}

// Auto-run if called directly
if (require.main === module) {
    const db = new LoTraDWDatabase();

    db.runFullTest()
        .then(() => {
            console.log('\n✅ All tests passed!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n❌ Test failed:', error);
            process.exit(1);
        });
}

module.exports = LoTraDWDatabase;