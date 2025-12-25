const fs = require('fs');

const data = JSON.parse(fs.readFileSync('broken_data.json', 'utf8'));

console.log('--- BROKEN PAGES (HTTP 4XX) ---');
data.http4xx.forEach(item => {
    console.log(`Missing: ${item.url}`);
    // If SE Ranking provides 'inlinks' or referring pages, we'd list them here, 
    // but the current JSON dump seems to list the broken pages themselves.
    // We can infer the issue from the URL structure.
});

console.log('\n--- BROKEN IMAGES (IMAGES 4XX) ---');
data.images4xx.forEach(item => {
    console.log(`Broken Image: ${item.url}`);
});
