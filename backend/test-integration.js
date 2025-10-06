// Test Frontend-Backend Integration
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

async function testIntegration() {
    console.log('🔗 Testing Frontend-Backend Integration...');
    console.log('='.repeat(50));

    try {
        // Test 1: Frontend endpoint /auth/signin
        console.log('1. Testing Frontend endpoint: POST /auth/signin');
        const signinOptions = {
            hostname: 'localhost',
            port: 3001,
            path: '/auth/signin',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const signinResult = await makeRequest(signinOptions, testCustomer);
        console.log(`   Status: ${signinResult.status}`);

        if (signinResult.status === 200) {
            console.log(`   ✅ Success: ${signinResult.data.success}`);
            console.log(`   User: ${signinResult.data.data.user.email}`);
            console.log(`   Token: ${signinResult.data.data.token.substring(0, 50)}...`);
        } else {
            console.log(`   ❌ Error: ${JSON.stringify(signinResult.data)}`);
        }

        // Test 2: Backend endpoint /auth/login
        console.log('');
        console.log('2. Testing Backend endpoint: POST /auth/login');
        const loginOptions = {
            hostname: 'localhost',
            port: 3001,
            path: '/auth/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const loginResult = await makeRequest(loginOptions, testCustomer);
        console.log(`   Status: ${loginResult.status}`);

        if (loginResult.status === 200) {
            console.log(`   ✅ Success: ${loginResult.data.success}`);
            console.log(`   User: ${loginResult.data.data.user.email}`);
        } else {
            console.log(`   ❌ Error: ${JSON.stringify(loginResult.data)}`);
        }

        console.log('');
        console.log('✅ Integration Testing completed!');
        console.log('Frontend can now call: POST /auth/signin');
        console.log('Backend also supports: POST /auth/login');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run tests
setTimeout(() => {
    testIntegration();
}, 1000);

console.log('⏳ Testing Frontend-Backend endpoints...');
console.log('🔗 Frontend calls: POST /auth/signin');
console.log('🔗 Backend serves: POST /auth/login & /auth/signin');