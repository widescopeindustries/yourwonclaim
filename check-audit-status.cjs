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

const AUDIT_ID = 700665691;

async function checkStatus() {
    console.log(`Checking status for Audit ID ${AUDIT_ID}...`);
    const url = `https://api.seranking.com/v1/site-audit/audits/status?id=${AUDIT_ID}`;

    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Token ${API_KEY}`,
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Status Info:', JSON.stringify(data, null, 2));
        } else {
            console.error(`Error: ${response.status}`);
            const text = await response.text();
            console.error('Body:', text);
        }
    } catch (e) {
        console.error(e);
    }
}

checkStatus();
