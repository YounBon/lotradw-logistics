// Test Script cho NestJS Customer Login API
const http = require('http');

const API_BASE = 'http://localhost:3001';

// Test data
const testCustomer = {
    email: 'customer@test.com',
    password: '123456'
};

function makeRequest(options, postData = null) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    resolve({ status: res.statusCode, data: result });
                } catch (error) {
                    resolve({ status: res.statusCode, data: data });
                }
            });
        });

        req.on('error', reject);

        if (postData) {
            req.write(JSON.stringify(postData));
        }

        req.end();
    });
}

async function testNestJSAPI() {
    console.log('🧪 Testing NestJS Customer Login API...');
    console.log('='.repeat(50));

    try {
        // Test 1: Customer Login
        console.log('1. Testing Customer Login...');
        const loginOptions = {
            hostname: 'localhost',
            port: 3001,
            path: '/api/auth/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const loginResult = await makeRequest(loginOptions, testCustomer);
        console.log(`   Status: ${loginResult.status}`);

        if (loginResult.status === 200) {
            console.log(`   Success: ${loginResult.data.success}`);
            console.log(`   User: ${loginResult.data.data.user.email}`);
            console.log(`   Role: ${loginResult.data.data.user.role}`);
            console.log(`   Token: ${loginResult.data.data.token.substring(0, 50)}...`);
        } else {
            console.log(`   Error: ${JSON.stringify(loginResult.data)}`);
        }

        // Test 2: Invalid Login
        console.log('');
        console.log('2. Testing Invalid Login...');
        const invalidLogin = {
            email: 'wrong@email.com',
            password: 'wrongpassword'
        };

        const invalidResult = await makeRequest(loginOptions, invalidLogin);
        console.log(`   Status: ${invalidResult.status}`);
        console.log(`   Response: ${JSON.stringify(invalidResult.data)}`);

        console.log('');
        console.log('✅ NestJS API Testing completed!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run tests with delay
setTimeout(() => {
    testNestJSAPI();
}, 2000);

console.log('⏳ Waiting for NestJS server to start...');
console.log('🚀 Stack: NestJS + TypeORM + PostgreSQL + JWT');
console.log('📝 Make sure server is running on http://localhost:3001');