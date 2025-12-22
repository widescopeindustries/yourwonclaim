const fs = require('fs');
const path = require('path');

// Manually load .env
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split(/\r?\n/);
const line = lines.find(l => l.startsWith('AHREFS_API_KEY='));
const API_KEY = line ? line.split('=')[1].trim() : null;

if (!API_KEY) {
    console.error('API_KEY not found in .env');
    process.exit(1);
}

async function testAhrefs() {
    console.log('Testing Ahrefs API (Organic Keywords with date)...');

    const today = new Date().toISOString().split('T')[0];
    const url = new URL('https://api.ahrefs.com/v3/site-explorer/organic-keywords');
    url.searchParams.append('target', 'ahrefs.com');
    url.searchParams.append('limit', '5');
    url.searchParams.append('date', today);
    // Changing position to ranking_position or just removing select to see defaults
    url.searchParams.append('select', 'keyword,volume');

    try {
        const response = await fetch(url.toString(), {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Accept': 'application/json'
            }
        });

        const text = await response.text();
        console.log(`Response Status: ${response.status} ${response.statusText}`);

        try {
            const data = JSON.parse(text);
            console.log('Data:', JSON.stringify(data, null, 2));
        } catch (e) {
            console.log('Raw Response Body:', text);
        }

        if (response.ok) {
            console.log('Successfully connected to Ahrefs!');
        } else {
            console.error('Failed to connect.');
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

testAhrefs();
