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

const CATEGORIES = [
    'calculator',
    'generator',
    'converter',
    'checker',
    'compressor',
    'timer',
    'tool'
];

async function findOpportunities() {
    console.log('Searching for high-volume utility keywords (filtering manually)...');

    const results = [];

    for (const category of CATEGORIES) {
        console.log(`Processing category: ${category}...`);

        // Fetch top 200 by volume to have a good pool
        const url = new URL('https://api.ahrefs.com/v3/keywords-explorer/matching-terms');
        url.searchParams.append('keyword', category);
        url.searchParams.append('country', 'us');
        url.searchParams.append('limit', '200');
        url.searchParams.append('select', 'keyword,volume,difficulty,cpc');
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
                    // Manual filter: KD < 40 and contains the category word (to avoid noise)
                    const filtered = data.keywords.filter(k => k.difficulty < 40);
                    results.push(...filtered.map(k => ({ ...k, category })));
                }
            } else {
                const error = await response.text();
                console.error(`Error in ${category}: ${response.status}`, error);
            }
        } catch (error) {
            console.error(`Fetch error in ${category}:`, error);
        }
    }

    // Deduplicate results based on keyword
    const uniqueResultsMap = new Map();
    results.forEach(item => {
        if (!uniqueResultsMap.has(item.keyword)) {
            uniqueResultsMap.set(item.keyword, item);
        }
    });
    const uniqueResults = Array.from(uniqueResultsMap.values());

    // Sort by volume
    uniqueResults.sort((a, b) => b.volume - a.volume);

    console.log('\n--- TOP RANKABLE UTILITY OPPORTUNITIES (KD < 40) ---\n');
    uniqueResults.slice(0, 50).forEach((k, i) => {
        console.log(`${i + 1}. [${k.category.toUpperCase()}] ${k.keyword.padEnd(30)} | Vol: ${k.volume.toLocaleString().padStart(10)} | KD: ${k.difficulty.toString().padStart(2)} | CPC: $${(k.cpc || 0).toString().padStart(4)}`);
    });
}

findOpportunities();
