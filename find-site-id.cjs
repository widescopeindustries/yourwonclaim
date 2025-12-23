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

async function findSite() {
    // The search result said GET https://api4.seranking.com/sites
    // But the prompt says https://api.seranking.com is the base.
    // Let's try both.
    const urls = [
        'https://api.seranking.com/v1/projects',
        'https://api.seranking.com/v1/sites'
    ];

    for (const url of urls) {
        console.log(`Checking ${url}...`);
        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Token ${API_KEY}`,
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log(`Success for ${url}`);
                const sites = data.items || data;
                if (Array.isArray(sites)) {
                    sites.forEach(s => {
                        console.log(`Site: ${s.name || s.url || s.title} | ID: ${s.id}`);
                    });
                } else {
                    console.log('Data:', JSON.stringify(data, null, 2));
                }
            } else {
                console.log(`Failed: ${response.status}`);
            }
        } catch (e) {
            console.error(e);
        }
    }
}

findSite();
