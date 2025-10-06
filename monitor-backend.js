// Backend Health Monitor
const http = require('http');

function checkBackend() {
    const options = {
        hostname: 'localhost',
        port: 3001,
        path: '/auth/signin',
        method: 'GET',
        timeout: 3000
    };

    const req = http.request(options, (res) => {
        console.log(`✅ Backend OK - Status: ${res.statusCode} - ${new Date().toLocaleTimeString()}`);
    });

    req.on('error', (err) => {
        console.log(`❌ Backend DOWN - ${err.message} - ${new Date().toLocaleTimeString()}`);
    });

    req.on('timeout', () => {
        console.log(`⏰ Backend TIMEOUT - ${new Date().toLocaleTimeString()}`);
        req.destroy();
    });

    req.end();
}

// Check every 10 seconds
console.log('🔍 Backend Health Monitor Started...');
console.log('Monitoring: http://localhost:3001');
setInterval(checkBackend, 10000);
checkBackend(); // First check