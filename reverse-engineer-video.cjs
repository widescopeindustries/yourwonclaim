const fs = require('fs');
const path = require('path');

// Manually load .env
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split(/\r?\n/);
const line = lines.find(l => l.startsWith('AHREFS_API_KEY='));
const API_KEY = line ? line.split('=')[1].trim() : null;

if (!API_KEY) {
    console.error('API_KEY not found in .env');
    process.exit(1);
}

const DOMAINS = [
    'vclock.com',
    'sleepcalculator.com',
    'compressjpeg.com',
    'privnote.com',
    'randomwordgenerator.com',
    'wheelofnames.com'
];

async function reverseEngineer() {
    console.log('Reverse-engineering top-performing one-page sites...');

    const today = new Date().toISOString().split('T')[0];
    const allKeywords = [];

    for (const domain of DOMAINS) {
        console.log(`Analyzing ${domain}...`);

        const url = new URL('https://api.ahrefs.com/v3/site-explorer/organic-keywords');
        url.searchParams.append('target', domain);
        url.searchParams.append('limit', '10');
        url.searchParams.append('date', today);
        url.searchParams.append('select', 'keyword,volume,difficulty,ranking_position');
        url.searchParams.append('order_by', 'volume:desc');

        try {
            const response = await fetch(url.toString(), {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.keywords) {
                    allKeywords.push(...data.keywords.map(k => ({ ...k, domain })));
                }
            } else {
                const error = await response.text();
                console.error(`Error in ${domain}: ${response.status}`, error);
            }
        } catch (error) {
            console.error(`Fetch error in ${domain}:`, error);
        }
    }

    console.log('\n--- TARGET KEYWORDS OF TOP ONE-PAGE TOOLS ---\n');
    allKeywords.sort((a, b) => b.volume - a.volume);

    allKeywords.forEach((k, i) => {
        console.log(`${i + 1}. [${k.domain}] ${k.keyword.padEnd(25)} | Vol: ${k.volume.toLocaleString().padStart(10)} | KD: ${k.difficulty.toString().padStart(2)} | Pos: ${k.ranking_position}`);
    });
}

reverseEngineer();
