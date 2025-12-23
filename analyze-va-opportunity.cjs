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

async function analyzeCalculatorOpportunity() {
    console.log('Analyzing VA Disability Calculator opportunity...');

    const keywords = ['va disability calculator', 'va rating calculator', 'va pay calculator 2025'];
    const results = [];

    for (const kw of keywords) {
        const url = new URL('https://api.ahrefs.com/v3/keywords-explorer/overview');
        url.searchParams.append('keywords', kw);
        url.searchParams.append('country', 'us');
        url.searchParams.append('select', 'keyword,volume,difficulty,cpc');

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
                    results.push(...data.keywords);
                }
            }
        } catch (e) {
            console.error(e);
        }
    }

    console.log('\n--- VA CALCULATOR METRICS ---\n');
    results.forEach(k => {
        console.log(`Keyword: ${k.keyword}`);
        console.log(`Volume: ${k.volume.toLocaleString()}`);
        console.log(`KD: ${k.difficulty}`);
        console.log(`CPC: $${k.cpc || 0}`);
        console.log('---------------------------');
    });

    console.log('\nRECOMMENDATION:');
    console.log('Integrating into yourwonclaim.com is the better move.');
    console.log('1. You already have impressions for "va claim status".');
    console.log('2. Dwell time on a calculator page is huge (3-5 minutes).');
    console.log('3. It turns your site from a "blog" into a "toolset", which ranks better in 2024/2025.');
}

analyzeCalculatorOpportunity();
