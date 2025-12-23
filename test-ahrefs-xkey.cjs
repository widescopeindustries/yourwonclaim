const fs = require('fs');
const path = require('path');

// Manually load .env
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split(/\r?\n/);
const line = lines.find(l => l.startsWith('AHREFS_API_KEY='));
const API_KEY = line ? line.split('=')[1].trim() : null;

async function testAhrefsXKey() {
    console.log('Testing Ahrefs API with X-API-Key header...');

    const url = 'https://api.ahrefs.com/v3/site-explorer/domain-rating?target=ahrefs.com';

    try {
        const response = await fetch(url, {
            headers: {
                'X-API-Key': API_KEY,
                'Accept': 'application/json'
            }
        });

        const text = await response.text();
        console.log(`Response Status: ${response.status} ${response.statusText}`);
        console.log('Response Body:', text);
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

testAhrefsXKey();
