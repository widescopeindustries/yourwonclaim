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

async function fetchKeys() {
    const url = `https://api.seranking.com/v1/site-audit/audits/pages?id=${AUDIT_ID}&limit=1`;
    const response = await fetch(url, { headers: { 'Authorization': `Token ${API_KEY}` } });
    const data = await response.json();
    const page = data.items[0];
    console.log('Keys in page object:', Object.keys(page).join(', '));

    // Look for anything containing 'issue' or 'results'
    for (const key in page) {
        if (page[key] === "1" || page[key] === 1) {
            console.log(`Issue detected: ${key}`);
        }
    }
}

fetchKeys();
