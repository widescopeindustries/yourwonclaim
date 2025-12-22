const fs = require('fs');
const path = require('path');

// Manually load .env
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split(/\r?\n/);
const line = lines.find(l => l.startsWith('AHREFS_API_KEY='));
const API_KEY = line ? line.split('=')[1].trim() : null;

async function testAhrefsV2() {
    console.log('Testing Ahrefs API V2...');

    const url = new URL('https://apiv2.ahrefs.com/');
    url.searchParams.append('from', 'stats');
    url.searchParams.append('target', 'ahrefs.com');
    url.searchParams.append('mode', 'domain');
    url.searchParams.append('token', API_KEY);
    url.searchParams.append('output', 'json');

    try {
        const response = await fetch(url.toString());
        const text = await response.text();
        console.log(`Response Status: ${response.status} ${response.statusText}`);
        console.log('Response Body:', text);

        if (response.ok) {
            console.log('Successfully connected to Ahrefs V2!');
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

testAhrefsV2();
