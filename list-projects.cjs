const fs = require('fs');
const path = require('path');

// Manually load .env
const envPath = path.join(__dirname, '.env');
let API_KEY = null;
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split(/\r?\n/);
    const line = lines.find(l => l.startsWith('SERANKING_API_KEY='));
    API_KEY = line ? line.split('=')[1].trim() : null;
}

if (!API_KEY) {
    console.error('SERANKING_API_KEY not found in .env');
    process.exit(1);
}

async function tryEndpoint(url) {
    console.log(`Trying ${url}...`);
    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Token ${API_KEY}`,
                'Accept': 'application/json'
            }
        });

        const text = await response.text();
        console.log(`Status: ${response.status} ${response.statusText}`);
        if (response.ok) {
            try {
                const data = JSON.parse(text);
                console.log('Data:', JSON.stringify(data, null, 2).substring(0, 1000));
                return true;
            } catch (e) {
                console.log('Raw:', text.substring(0, 500));
            }
        } else {
            console.log('Error Body:', text.substring(0, 500));
        }
    } catch (e) {
        console.error('Fetch error:', e);
    }
    return false;
}

async function run() {
    const endpoints = [
        'https://api.seranking.com/v1/projects',
        'https://api.seranking.com/v1/sites',
        'https://api.seranking.com/v1/site-audit/audits'
    ];

    for (const url of endpoints) {
        if (await tryEndpoint(url)) break;
    }
}

run();
