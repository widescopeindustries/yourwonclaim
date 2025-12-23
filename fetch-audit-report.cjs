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

const AUDIT_ID = 700665691; // yourwonclaim.com audit

async function fetchReport() {
    console.log(`Fetching audit report for Run ID ${AUDIT_ID}...`);

    const urls = [
        `https://api.seranking.com/v1/site-audit/audits/${AUDIT_ID}/report`,
        `https://api.seranking.com/v1/site-audit/audits/report?id=${AUDIT_ID}`,
        `https://api.seranking.com/v1/site-audit/audits/report?audit_id=${AUDIT_ID}`
    ];

    for (const url of urls) {
        console.log(`Trying ${url}...`);
        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Token ${API_KEY}`,
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('--- SUCCESS! ---');
                console.log(JSON.stringify(data, null, 2).substring(0, 3000));
                return;
            } else {
                console.log(`Status: ${response.status} ${response.statusText}`);
                const text = await response.text();
                console.log('Body:', text.substring(0, 500));
            }
        } catch (e) {
            console.error('Fetch error:', e);
        }
    }
}

fetchReport();
