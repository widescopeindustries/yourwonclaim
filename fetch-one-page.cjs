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

async function fetchPageDetails() {
    const url = new URL('https://api.seranking.com/v1/site-audit/audits/pages');
    url.searchParams.append('id', AUDIT_ID);
    url.searchParams.append('limit', '1');

    try {
        const response = await fetch(url.toString(), {
            headers: {
                'Authorization': `Token ${API_KEY}`,
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            const page = data.items[0];
            console.log(`URL: ${page.url}`);
            console.log('Issues:', JSON.stringify(page, null, 2));
        }
    } catch (e) {
        console.error(e);
    }
}

fetchPageDetails();
