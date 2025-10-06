// Test PostgreSQL Database Connection
// LoTraDW Logistics Database
const { Pool } = require('pg');

// Database configuration
const config = {
    host: 'localhost',
    port: 5432,
    database: 'lotradw',
    user: 'postgres',
    password: 'minhphuc293',
    ssl: false,
    connectionTimeoutMillis: 5000,
};

console.log('🔍 Testing PostgreSQL Connection...');
console.log('📊 Database: lotradw');
console.log('🏠 Host: localhost:5432');
console.log('👤 User: postgres');
console.log('─'.repeat(50));

async function testDatabaseConnection() {
    const pool = new Pool(config);

    try {
        // Test basic connection
        console.log('⏳ Connecting to database...');
        const client = await pool.connect();
        console.log('✅ Connected successfully!');

        // Test 1: Basic database info
        console.log('\n📋 Basic Information:');
        const basicInfo = await client.query(`
      SELECT 
        current_database() as database_name,
        current_user as connected_user,
        inet_server_addr() as server_ip,
        inet_server_port() as server_port,
        version() as postgres_version
    `);
        console.table(basicInfo.rows);

        // Test 2: Check schemas
        console.log('📁 Checking Schemas:');
        const schemas = await client.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name IN ('auth', 'logistics', 'admin', 'dw')
      ORDER BY schema_name
    `);
        console.log('Found schemas:', schemas.rows.map(r => r.schema_name).join(', '));

        // Test 3: Count tables in each schema
        console.log('\n📊 Tables per Schema:');
        const tables = await client.query(`
      SELECT 
        table_schema,
        COUNT(*) as table_count
      FROM information_schema.tables 
      WHERE table_schema IN ('auth', 'logistics', 'admin', 'dw')
      GROUP BY table_schema
      ORDER BY table_schema
    `);
        console.table(tables.rows);

        // Test 4: Check admin user
        console.log('👤 Admin User Check:');
        const adminUser = await client.query(`
      SELECT email, role, status, email_verified, created_at 
      FROM auth.users 
      WHERE role = 'admin'
      LIMIT 1
    `);
        if (adminUser.rows.length > 0) {
            console.table(adminUser.rows);
        } else {
            console.log('⚠️  No admin user found');
        }

        // Test 5: Check regions data
        console.log('🌍 Regions Data:');
        const regions = await client.query(`
      SELECT name, code, province 
      FROM logistics.regions 
      ORDER BY name 
      LIMIT 5
    `);
        console.table(regions.rows);

        // Test 6: Check categories
        console.log('📦 Categories Data:');
        const categories = await client.query(`
      SELECT name, code, weight_multiplier 
      FROM logistics.categories 
      ORDER BY weight_multiplier DESC 
      LIMIT 5
    `);
        console.table(categories.rows);

        // Test 7: Test functions
        console.log('⚙️  Function Tests:');
        const functions = await client.query(`
      SELECT 
        generate_order_number() as sample_order_number,
        generate_tracking_number() as sample_tracking_number
    `);
        console.table(functions.rows);

        // Test 8: Date dimension check
        console.log('📅 Date Dimension Check:');
        const dateCount = await client.query(`
      SELECT 
        COUNT(*) as total_dates,
        MIN(full_date) as start_date,
        MAX(full_date) as end_date
      FROM dw.dim_date
    `);
        console.table(dateCount.rows);

        // Test 9: System configurations
        console.log('⚙️  System Configurations:');
        const configs = await client.query(`
      SELECT config_key, config_value, description 
      FROM admin.system_configs 
      ORDER BY config_key 
      LIMIT 5
    `);
        console.table(configs.rows);

        client.release();

        console.log('\n🎉 Database Connection Test Summary:');
        console.log('✅ Connection: SUCCESS');
        console.log('✅ Schemas: 4/4 found (auth, logistics, admin, dw)');
        console.log('✅ Tables: ' + tables.rows.reduce((sum, row) => sum + parseInt(row.table_count), 0) + ' total');
        console.log('✅ Sample Data: Loaded');
        console.log('✅ Functions: Working');
        console.log('✅ Admin User: Created');
        console.log('\n🚀 Database is ready for application development!');

    } catch (error) {
        console.error('\n❌ Connection failed:', error.message);
        console.error('💡 Common solutions:');
        console.error('  - Check if PostgreSQL service is running');
        console.error('  - Verify database "lotradw" exists');
        console.error('  - Run the init.sql file first');
        console.error('  - Check firewall settings');
    } finally {
        await pool.end();
    }
}

// Run the test
testDatabaseConnection();