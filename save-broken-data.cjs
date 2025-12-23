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
    const results = {};

    // http4xx
    const url = new URL('https://api.seranking.com/v1/site-audit/audits/pages');
    url.searchParams.append('id', AUDIT_ID);
    url.searchParams.append('filter[0][param]', 'http4xx');
    url.searchParams.append('filter[0][value]', '1');
    const response = await fetch(url.toString(), { headers: { 'Authorization': `Token ${API_KEY}` } });
    results.http4xx = (await response.json()).items || [];

    // images4xx
    const url2 = new URL('https://api.seranking.com/v1/site-audit/audits/pages');
    url2.searchParams.append('id', AUDIT_ID);
    url2.searchParams.append('filter[0][param]', 'images4xx');
    url2.searchParams.append('filter[0][value]', '1');
    const response2 = await fetch(url2.toString(), { headers: { 'Authorization': `Token ${API_KEY}` } });
    results.images4xx = (await response2.json()).items || [];

    fs.writeFileSync('broken_data.json', JSON.stringify(results, null, 2), 'utf8');
    console.log('Saved to broken_data.json');
}

listBroken();
