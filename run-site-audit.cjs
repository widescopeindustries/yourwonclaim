const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
let API_KEY = null;
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split(/\r?\n/);
    const line = lines.find(l => l.startsWith('SERANKING_API_KEY='));
    API_KEY = line ? line.split('=')[1].trim() : null;
}

async function runAudit() {
    console.log('Triggering Standard Site Audit for yourwonclaim.com...');
    const url = 'https://api.seranking.com/v1/site-audit/audits/standard';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${API_KEY}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                domain: 'yourwonclaim.com',
                title: 'Audit yourwonclaim.com'
            })
        });

        const text = await response.text();
        console.log(`Status: ${response.status} ${response.statusText}`);
        if (response.ok) {
            const data = JSON.parse(text);
            console.log('Audit Started Successfully!');
            console.log('Audit Data:', JSON.stringify(data, null, 2));
        } else {
            console.error('Failed to start audit.');
            console.error('Body:', text);
        }
    } catch (e) {
        console.error('Fetch error:', e);
    }
}

runAudit();
