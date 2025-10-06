# 🔗 Hướng dẫn kết nối Database LoTraDW

## Database Information
- **Database Name:** `lotradw`
- **Schemas:** `auth`, `logistics`, `admin`, `dw`
- **PostgreSQL Version:** 15+
- **Default Port:** 5432

## 1. Kết nối qua Command Line (psql)

### Kết nối cơ bản
```bash
# Kết nối với database lotradw
psql -h localhost -U postgres -d lotradw

# Với password prompt
psql -h localhost -U postgres -d lotradw -W

# Với port tùy chỉnh
psql -h localhost -U postgres -d lotradw -p 5432
```

### Kết nối với các tham số chi tiết
```bash
# Kết nối đầy đủ
psql "host=localhost port=5432 dbname=lotradw user=postgres password=your_password"

# Hoặc dùng URI
psql "postgresql://postgres:your_password@localhost:5432/lotradw"
```

## 2. Connection String cho Application

### Environment Variables (.env)
```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=lotradw
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_SSL=false

# Connection String
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/lotradw

# Application Roles
DB_APP_USER=lotradw_app_user
DB_READONLY_USER=lotradw_readonly
```

### Node.js với pg library
```javascript
const { Pool } = require('pg');

// Sử dụng connection object
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'lotradw',
  user: 'postgres',
  password: 'your_password',
  ssl: false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Hoặc sử dụng connection string
const pool2 = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT current_database(), current_user, now()');
    console.log('✅ Connected to database:', result.rows[0]);
    client.release();
  } catch (err) {
    console.error('❌ Connection error:', err);
  }
};

testConnection();
```

### Node.js với Prisma ORM
```javascript
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Sử dụng
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:your_password@localhost:5432/lotradw"
    }
  }
});
```

## 3. Kết nối qua GUI Tools

### pgAdmin 4
1. **Mở pgAdmin**
2. **Right-click "Servers" → "Create" → "Server..."**
3. **General Tab:**
   - Name: `LoTraDW Logistics`
   - Server group: `Servers`
4. **Connection Tab:**
   - Host name/address: `localhost`
   - Port: `5432`
   - Maintenance database: `postgres`
   - Username: `postgres`
   - Password: `[your_postgres_password]`
5. **Advanced Tab:**
   - DB restriction: `lotradw` (optional)

### DBeaver
1. **New Database Connection**
2. **Select PostgreSQL**
3. **Connection Settings:**
   - Server Host: `localhost`
   - Port: `5432`
   - Database: `lotradw`
   - Username: `postgres`
   - Password: `[your_password]`
4. **Test Connection**

### VS Code Extensions

#### PostgreSQL Extension
```json
// settings.json
{
  "postgresql.connections": [
    {
      "label": "LoTraDW Logistics",
      "host": "localhost",
      "port": 5432,
      "user": "postgres",
      "password": "your_password",
      "database": "lotradw"
    }
  ]
}
```

#### Database Client Extension
- Host: `localhost`
- Port: `5432`
- Username: `postgres`
- Password: `your_password`
- Database: `lotradw`

## 4. Application-specific Connections

### NestJS with TypeORM
```typescript
// app.module.ts
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'your_password',
      database: 'lotradw',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, // Set to false for production
      ssl: false,
      schema: 'public', // Default schema
    }),
  ],
})
export class AppModule {}
```

### Express.js với Sequelize
```javascript
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('lotradw', 'postgres', 'your_password', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Test connection
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected successfully');
  })
  .catch(err => {
    console.error('❌ Unable to connect:', err);
  });
```

## 5. Verification Queries

### Kiểm tra kết nối và schemas
```sql
-- Kiểm tra database hiện tại
SELECT current_database() as database_name,
       current_user as connected_user,
       inet_server_addr() as server_ip,
       inet_server_port() as server_port,
       version() as postgres_version;

-- Kiểm tra schemas đã tạo
SELECT schema_name 
FROM information_schema.schemata 
WHERE schema_name IN ('auth', 'logistics', 'admin', 'dw')
ORDER BY schema_name;

-- Kiểm tra tables trong từng schema
SELECT 
    table_schema,
    COUNT(*) as table_count,
    string_agg(table_name, ', ' ORDER BY table_name) as tables
FROM information_schema.tables 
WHERE table_schema IN ('auth', 'logistics', 'admin', 'dw')
GROUP BY table_schema
ORDER BY table_schema;
```

### Kiểm tra dữ liệu mẫu
```sql
-- Kiểm tra admin user
SELECT email, role, status, created_at 
FROM auth.users 
WHERE role = 'admin';

-- Kiểm tra regions
SELECT name, code, province 
FROM logistics.regions 
ORDER BY name;

-- Kiểm tra categories
SELECT name, code, weight_multiplier 
FROM logistics.categories 
ORDER BY weight_multiplier DESC;

-- Test functions
SELECT 
    generate_order_number() as sample_order_number,
    generate_tracking_number() as sample_tracking_number;
```

## 6. Troubleshooting

### Lỗi thường gặp và cách khắc phục

#### 1. "database does not exist"
```sql
-- Kết nối postgres database trước
psql -U postgres

-- Tạo database
CREATE DATABASE lotradw;

-- Hoặc chạy file init.sql
\i /path/to/init.sql
```

#### 2. "authentication failed"
- Kiểm tra username/password
- Kiểm tra file `pg_hba.conf`
- Restart PostgreSQL service

#### 3. "could not connect to server"
- Kiểm tra PostgreSQL service đang chạy
- Kiểm tra port 5432 available
- Kiểm tra firewall settings

#### 4. "permission denied"
```sql
-- Grant permissions cho user
GRANT CONNECT ON DATABASE lotradw TO your_user;
GRANT USAGE ON SCHEMA auth, logistics, admin, dw TO your_user;
```

## 7. Security Recommendations

### 1. Tạo application-specific users
```sql
-- Tạo user cho application
CREATE USER lotradw_app WITH PASSWORD 'secure_password';

-- Grant permissions
GRANT lotradw_app_user TO lotradw_app;

-- Kết nối với user này thay vì postgres
```

### 2. Connection pooling
```javascript
// Sử dụng connection pooling
const pool = new Pool({
  // ... connection config
  max: 20,                // Maximum number of clients
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return error after 2 seconds if connection could not be established
});
```

### 3. SSL Configuration (Production)
```javascript
const pool = new Pool({
  // ... other config
  ssl: {
    rejectUnauthorized: false, // For self-signed certificates
    ca: fs.readFileSync('/path/to/ca-certificate.crt').toString(),
    key: fs.readFileSync('/path/to/client-key.key').toString(),
    cert: fs.readFileSync('/path/to/client-certificate.crt').toString(),
  }
});
```

## 8. Sample Connection Test Scripts

### Node.js Test Script
```javascript
// test-connection.js
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'lotradw',
  user: 'postgres',
  password: 'your_password'
});

async function testDatabase() {
  try {
    // Test basic connection
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL');
    
    // Test database and schemas
    const result = await client.query(`
      SELECT 
        current_database() as db,
        COUNT(*) as table_count
      FROM information_schema.tables 
      WHERE table_schema IN ('auth', 'logistics', 'admin', 'dw')
    `);
    
    console.log('📊 Database Info:', result.rows[0]);
    
    // Test sample data
    const regions = await client.query('SELECT COUNT(*) as count FROM logistics.regions');
    console.log('🌍 Regions loaded:', regions.rows[0].count);
    
    client.release();
    console.log('✅ Database connection test completed successfully!');
    
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
  } finally {
    await pool.end();
  }
}

testDatabase();
```

### PowerShell Test Script
```powershell
# test-connection.ps1
$env:PGPASSWORD = "your_password"

Write-Host "Testing PostgreSQL connection..." -ForegroundColor Yellow

# Test connection
$result = psql -h localhost -U postgres -d lotradw -c "SELECT current_database(), current_user;"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Connection successful!" -ForegroundColor Green
    
    # Test schemas
    psql -h localhost -U postgres -d lotradw -c "SELECT schema_name FROM information_schema.schemata WHERE schema_name IN ('auth', 'logistics', 'admin', 'dw');"
    
    # Test sample data
    psql -h localhost -U postgres -d lotradw -c "SELECT 'Regions: ' || COUNT(*) FROM logistics.regions;"
    
} else {
    Write-Host "❌ Connection failed!" -ForegroundColor Red
}
```

---

## 📌 Quick Reference

| Tool | Connection Command |
|------|-------------------|
| **psql** | `psql -h localhost -U postgres -d lotradw` |
| **Node.js** | `postgresql://postgres:password@localhost:5432/lotradw` |
| **pgAdmin** | Host: localhost, Port: 5432, DB: lotradw |
| **VS Code** | Install PostgreSQL extension, add connection |

### Default Credentials
- **Database:** `lotradw`
- **Default User:** `postgres`
- **Schemas:** `auth`, `logistics`, `admin`, `dw`
- **Admin Login:** `admin@lotradw.com` / `admin123`

**Database is ready for application development!** 🚀