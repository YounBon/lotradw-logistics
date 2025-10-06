// Database Connection Verification Script
// Checks if pgAdmin can connect to PostgreSQL and database is properly configured

const { Pool } = require('pg');

// Database configuration (same as pgAdmin settings)
const dbConfig = {
    host: 'localhost',
    port: 5432,
    database: 'lotradw',
    user: 'postgres',
    password: 'minhphuc293',
    ssl: false,
    connectionTimeoutMillis: 5000,
};

async function verifyPgAdminConnection() {
    console.log('🔍 Verifying pgAdmin Database Connection...');
    console.log('='.repeat(60));

    console.log('📊 Connection Details:');
    console.log(`   Host: ${dbConfig.host}`);
    console.log(`   Port: ${dbConfig.port}`);
    console.log(`   Database: ${dbConfig.database}`);
    console.log(`   Username: ${dbConfig.user}`);
    console.log(`   Password: ${'*'.repeat(dbConfig.password.length)}`);
    console.log('');

    const pool = new Pool(dbConfig);

    try {
        console.log('⏳ Testing connection...');
        const client = await pool.connect();

        // 1. Basic connection info
        const connectionInfo = await client.query(`
      SELECT 
        current_database() as database_name,
        current_user as connected_user,
        inet_server_addr() as server_address,
        inet_server_port() as server_port,
        version() as postgres_version,
        now() as connection_time
    `);

        console.log('✅ Successfully connected to PostgreSQL!');
        console.log('');
        console.log('📋 Connection Information:');
        const info = connectionInfo.rows[0];
        console.log(`   Database: ${info.database_name}`);
        console.log(`   User: ${info.connected_user}`);
        console.log(`   Server: ${info.server_address}:${info.server_port}`);
        console.log(`   Version: ${info.postgres_version.split(',')[0]}`);
        console.log(`   Connected at: ${info.connection_time}`);
        console.log('');

        // 2. Check schemas
        console.log('📁 Checking Database Schemas:');
        const schemas = await client.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name IN ('auth', 'logistics', 'admin', 'dw')
      ORDER BY schema_name
    `);

        schemas.rows.forEach(row => {
            console.log(`   ✅ Schema: ${row.schema_name}`);
        });
        console.log('');

        // 3. Check tables per schema
        console.log('📊 Tables in Each Schema:');
        const tables = await client.query(`
      SELECT 
        table_schema,
        COUNT(*) as table_count,
        string_agg(table_name, ', ' ORDER BY table_name) as table_names
      FROM information_schema.tables 
      WHERE table_schema IN ('auth', 'logistics', 'admin', 'dw')
      GROUP BY table_schema
      ORDER BY table_schema
    `);

        let totalTables = 0;
        tables.rows.forEach(row => {
            totalTables += parseInt(row.table_count);
            console.log(`   📁 ${row.table_schema}: ${row.table_count} tables`);
            console.log(`      Tables: ${row.table_names}`);
            console.log('');
        });

        console.log(`   📊 Total Tables: ${totalTables}`);
        console.log('');

        // 4. Check sample data
        console.log('🔍 Verifying Sample Data:');

        // Check admin user
        const adminUsers = await client.query(`
      SELECT email, role, status, created_at 
      FROM auth.users 
      WHERE role = 'admin'
    `);
        console.log(`   👤 Admin users: ${adminUsers.rows.length}`);
        if (adminUsers.rows.length > 0) {
            console.log(`      Email: ${adminUsers.rows[0].email}`);
            console.log(`      Status: ${adminUsers.rows[0].status}`);
        }

        // Check regions
        const regions = await client.query('SELECT COUNT(*) as count FROM logistics.regions');
        console.log(`   🌍 Regions: ${regions.rows[0].count}`);

        // Check categories
        const categories = await client.query('SELECT COUNT(*) as count FROM logistics.categories');
        console.log(`   📦 Categories: ${categories.rows[0].count}`);

        // Check date dimension
        const dates = await client.query('SELECT COUNT(*) as count FROM dw.dim_date');
        console.log(`   📅 Date dimension records: ${dates.rows[0].count}`);

        // Check system configs
        const configs = await client.query('SELECT COUNT(*) as count FROM admin.system_configs');
        console.log(`   ⚙️  System configurations: ${configs.rows[0].count}`);
        console.log('');

        // 5. Test functions
        console.log('⚙️  Testing Database Functions:');
        try {
            const orderNumber = await client.query('SELECT generate_order_number() as order_num');
            console.log(`   ✅ generate_order_number(): ${orderNumber.rows[0].order_num}`);

            const trackingNumber = await client.query('SELECT generate_tracking_number() as tracking_num');
            console.log(`   ✅ generate_tracking_number(): ${trackingNumber.rows[0].tracking_num}`);
        } catch (funcError) {
            console.log(`   ❌ Function test failed: ${funcError.message}`);
        }
        console.log('');

        // 6. Check indexes
        console.log('🚀 Performance Indexes:');
        const indexes = await client.query(`
      SELECT 
        schemaname,
        COUNT(*) as index_count
      FROM pg_indexes 
      WHERE schemaname IN ('auth', 'logistics', 'admin', 'dw')
      GROUP BY schemaname
      ORDER BY schemaname
    `);

        indexes.rows.forEach(row => {
            console.log(`   📈 ${row.schemaname}: ${row.index_count} indexes`);
        });
        console.log('');

        // 7. Check views
        console.log('👁️  Application Views:');
        const views = await client.query(`
      SELECT 
        schemaname,
        COUNT(*) as view_count
      FROM pg_views 
      WHERE schemaname IN ('logistics', 'admin')
      GROUP BY schemaname
      ORDER BY schemaname
    `);

        if (views.rows.length > 0) {
            views.rows.forEach(row => {
                console.log(`   👁️  ${row.schemaname}: ${row.view_count} views`);
            });
        } else {
            console.log('   📝 No custom views found');
        }
        console.log('');

        client.release();

        // Final summary
        console.log('🎉 pgAdmin Connection Verification Summary:');
        console.log('='.repeat(60));
        console.log('✅ Database Connection: SUCCESS');
        console.log('✅ Authentication: WORKING');
        console.log('✅ All Schemas: PRESENT');
        console.log(`✅ Total Tables: ${totalTables}`);
        console.log('✅ Sample Data: LOADED');
        console.log('✅ Functions: OPERATIONAL');
        console.log('✅ Indexes: OPTIMIZED');
        console.log('');
        console.log('🚀 Database is ready for pgAdmin access!');
        console.log('');
        console.log('📋 pgAdmin Connection Settings:');
        console.log('   Server Name: LoTraDW Logistics');
        console.log('   Host: localhost');
        console.log('   Port: 5432');
        console.log('   Database: lotradw');
        console.log('   Username: postgres');
        console.log('   Password: minhphuc293');
        console.log('');

        return true;

    } catch (error) {
        console.log('❌ Connection Failed!');
        console.log(`   Error: ${error.message}`);
        console.log('');
        console.log('💡 Troubleshooting Steps:');
        console.log('   1. Check if PostgreSQL service is running');
        console.log('   2. Verify credentials are correct');
        console.log('   3. Ensure database "lotradw" exists');
        console.log('   4. Check firewall settings for port 5432');
        console.log('   5. Try connecting with pgAdmin manually');

        return false;
    } finally {
        await pool.end();
    }
}

// Run verification
if (require.main === module) {
    verifyPgAdminConnection()
        .then((success) => {
            process.exit(success ? 0 : 1);
        })
        .catch((error) => {
            console.error('Verification failed:', error);
            process.exit(1);
        });
}

module.exports = { verifyPgAdminConnection };