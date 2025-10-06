// Test Script cho Customer Login API
// Chạy script này để test các endpoints

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

async function testAPI() {
    console.log('🧪 Testing Customer Login API...');
    console.log('='.repeat(50));

    try {
        // Test 1: Health Check
        console.log('1. Testing Health Check...');
        const healthOptions = {
            hostname: 'localhost',
            port: 3001,
            path: '/api/health',
            method: 'GET',
        };

        const healthResult = await makeRequest(healthOptions);
        console.log(`   Status: ${healthResult.status}`);
        console.log(`   Response:`, healthResult.data);
        console.log('');

        // Test 2: Customer Login
        console.log('2. Testing Customer Login...');
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
        console.log(`   Success: ${loginResult.data.success}`);

        if (loginResult.data.success) {
            console.log(`   User: ${loginResult.data.data.user.email}`);
            console.log(`   Role: ${loginResult.data.data.user.role}`);
            console.log(`   Token: ${loginResult.data.data.token.substring(0, 50)}...`);

            // Test 3: Get Profile with Token
            console.log('');
            console.log('3. Testing Get Profile (Protected Route)...');
            const profileOptions = {
                hostname: 'localhost',
                port: 3001,
                path: '/api/customer/profile',
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${loginResult.data.data.token}`,
                },
            };

            const profileResult = await makeRequest(profileOptions);
            console.log(`   Status: ${profileResult.status}`);
            console.log(`   Profile:`, profileResult.data.data);
        } else {
            console.log(`   Error: ${loginResult.data.message}`);
        }

        // Test 4: Invalid Login
        console.log('');
        console.log('4. Testing Invalid Login...');
        const invalidLogin = {
            email: 'wrong@email.com',
            password: 'wrongpassword'
        };

        const invalidResult = await makeRequest(loginOptions, invalidLogin);
        console.log(`   Status: ${invalidResult.status}`);
        console.log(`   Message: ${invalidResult.data.message}`);

        console.log('');
        console.log('✅ API Testing completed!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run tests with delay
setTimeout(() => {
    testAPI();
}, 2000);

console.log('⏳ Waiting for server to start...');
console.log('📝 Make sure to run: node customer-login-api.js first');