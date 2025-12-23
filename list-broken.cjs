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

async function listBroken() {
    const url = new URL('https://api.seranking.com/v1/site-audit/audits/pages');
    url.searchParams.append('id', AUDIT_ID);
    url.searchParams.append('filter[0][param]', 'http4xx');
    url.searchParams.append('filter[0][value]', '1');

    const response = await fetch(url.toString(), { headers: { 'Authorization': `Token ${API_KEY}` } });
    const data = await response.json();
    console.log('--- HTTP 4XX PAGES ---');
    (data.items || []).forEach(item => {
        console.log(`- ${item.url} (Status: ${item.status})`);
    });

    // Also check images4xx
    const url2 = new URL('https://api.seranking.com/v1/site-audit/audits/pages');
    url2.searchParams.append('id', AUDIT_ID);
    url2.searchParams.append('filter[0][param]', 'images4xx');
    url2.searchParams.append('filter[0][value]', '1');
    const response2 = await fetch(url2.toString(), { headers: { 'Authorization': `Token ${API_KEY}` } });
    const data2 = await response2.json();
    console.log('\n--- PAGES WITH BROKEN IMAGES ---');
    (data2.items || []).forEach(item => {
        console.log(`- ${item.url}`);
    });
}

listBroken();
