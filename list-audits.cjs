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

async function listAllAudits() {
    const url = 'https://api.seranking.com/v1/site-audit/audits';
    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Token ${API_KEY}`,
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            const items = data.items || data;
            console.log('\n--- ALL AUDITS ---');
            items.forEach(item => {
                console.log(`Run ID: ${item.id} | Site ID: ${item.site_id} | URL: ${item.url} | Status: ${item.status}`);
            });
        }
    } catch (e) {
        console.error(e);
    }
}

listAllAudits();
