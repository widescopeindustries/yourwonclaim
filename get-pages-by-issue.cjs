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

async function fetchIssueUrls(issueCode) {
    console.log(`\n--- Fetching URLs for issue: ${issueCode} ---`);

    // We try the filter syntax
    const url = new URL('https://api.seranking.com/v1/site-audit/audits/pages');
    url.searchParams.append('id', AUDIT_ID);
    url.searchParams.append('filter[0][param]', issueCode);
    url.searchParams.append('filter[0][value]', '1'); // 1 means true/exists
    url.searchParams.append('limit', '20');

    try {
        const response = await fetch(url.toString(), {
            headers: {
                'Authorization': `Token ${API_KEY}`,
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            const items = data.items || [];
            if (items.length > 0) {
                items.forEach(item => {
                    console.log(`- ${item.url}`);
                });
            } else {
                console.log('No pages found with this issue (or wrong filter syntax).');
            }
        } else {
            console.error(`Error: ${response.status}`);
        }
    } catch (e) {
        console.error(e);
    }
}

async function run() {
    await fetchIssueUrls('images4xx');
    await fetchIssueUrls('sitemap_3xx');
    await fetchIssueUrls('http4xx');
}

run();
