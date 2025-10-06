// API Test Script for LoTraDW Backend
const http = require('http');

const testEndpoints = [
    { path: '/api/v1/auth/health', method: 'GET', description: 'Health Check' },
];

function testAPI(host = 'localhost', port = 3001) {
    console.log(`🧪 Testing LoTraDW Backend API on ${host}:${port}`);
    console.log('='.repeat(50));

    testEndpoints.forEach((endpoint, index) => {
        setTimeout(() => {
            const options = {
                hostname: host,
                port: port,
                path: endpoint.path,
                method: endpoint.method,
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const req = http.request(options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    console.log(`✅ ${endpoint.description}`);
                    console.log(`   ${endpoint.method} ${endpoint.path}`);
                    console.log(`   Status: ${res.statusCode}`);
                    console.log(`   Response: ${data}`);
                    console.log('');
                });
            });

            req.on('error', (error) => {
                console.log(`❌ ${endpoint.description}`);
                console.log(`   ${endpoint.method} ${endpoint.path}`);
                console.log(`   Error: ${error.message}`);
                console.log('');
            });

            req.end();
        }, index * 1000);
    });

    // Test database connection after API tests
    setTimeout(() => {
        console.log('🔍 Testing Database Connection...');
        testDatabaseConnection();
    }, testEndpoints.length * 1000 + 1000);
}

function testDatabaseConnection() {
    const testRegister = {
        email: 'api.test@example.com',
        password: 'test123456',
        role: 'customer',
        firstName: 'API',
        lastName: 'Test'
    };

    const postData = JSON.stringify(testRegister);

    const options = {
        hostname: 'localhost',
        port: 3001,
        path: '/api/v1/auth/register',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
        },
    };

    const req = http.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            console.log(`📊 Registration Test`);
            console.log(`   Status: ${res.statusCode}`);
            if (res.statusCode === 201 || res.statusCode === 409) {
                console.log(`   ✅ Database connection working!`);
            } else {
                console.log(`   ⚠️  Response: ${data}`);
            }
            console.log('');
        });
    });

    req.on('error', (error) => {
        console.log(`❌ Database Test Failed: ${error.message}`);
    });

    req.write(postData);
    req.end();
}

// Run tests
if (require.main === module) {
    console.log('🚀 Starting API Tests...');
    setTimeout(() => {
        testAPI();
    }, 2000); // Wait 2 seconds for server to be ready
}

module.exports = { testAPI };