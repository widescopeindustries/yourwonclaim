const fs = require('fs');
const path = require('path');

// Manually load .env
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split(/\r?\n/);
    const line = lines.find(l => l.startsWith('SERANKING_API_KEY='));
    var API_KEY = line ? line.split('=')[1].trim() : null;
}

if (!API_KEY || API_KEY === 'YOUR_SE_RANKING_API_KEY_HERE') {
    console.error('SERANKING_API_KEY not found or not set in .env');
    process.exit(1);
}

async function testSERanking() {
    console.log('Testing SE Ranking API (Subscription details)...');

    const url = 'https://api.seranking.com/v1/account/subscription';

    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Token ${API_KEY}`,
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
            console.log('Successfully connected to SE Ranking!');
        } else {
            console.error('Failed to connect.');
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

testSERanking();
