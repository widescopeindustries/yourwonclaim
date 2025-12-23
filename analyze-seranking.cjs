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

if (!API_KEY || API_KEY === 'YOUR_SE_RANKING_API_KEY_HERE') {
    console.error('SERANKING_API_KEY not found or not set in .env');
    process.exit(1);
}

async function analyzeKeyword(keyword) {
    console.log(`\nAnalyzing keyword: ${keyword}...`);

    // We'll try the 'related' endpoint first
    const url = new URL('https://api.seranking.com/v1/keywords/related');
    url.searchParams.append('keyword', keyword);
    url.searchParams.append('region', 'us');

    try {
        const response = await fetch(url.toString(), {
            headers: {
                'Authorization': `Token ${API_KEY}`,
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();

            // SE Ranking response can be an array or an object with keywords property
            const items = data.keywords || (Array.isArray(data) ? data : []);

            if (items.length > 0) {
                console.log(`--- Metrics for "${keyword}" ---`);
                items.slice(0, 5).forEach(k => {
                    console.log(`Keyword: ${k.keyword}`);
                    console.log(`Volume: ${k.volume}`);
                    console.log(`Difficulty: ${k.difficulty !== undefined ? k.difficulty : 'N/A'}`);
                    console.log('---------------------------');
                });
            } else {
                console.log(`No related keywords found for "${keyword}".`);
                if (Object.keys(data).length > 0) {
                    console.log('Full Response:', JSON.stringify(data, null, 2));
                }
            }
        } else {
            console.error(`Error: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.error('Body:', text);
        }
    } catch (e) {
        console.error('Fetch error:', e);
    }
}

// Default keywords
const keywords = ['va disability calculator', 'va rating calculator', 'va pay calculator 2026'];

async function runAnalysis() {
    for (const kw of keywords) {
        await analyzeKeyword(kw);
    }
}

runAnalysis();
