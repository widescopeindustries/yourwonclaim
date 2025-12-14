import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the keyword data
const keywordsPath = path.join(__dirname, '../data/seo-keywords.json');
const keywords = JSON.parse(fs.readFileSync(keywordsPath, 'utf8'));

const baseUrl = 'https://yourwonclaim.com';
const today = new Date().toISOString().split('T')[0];

// Start sitemap
let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Articles Index -->
  <url>
    <loc>${baseUrl}/articles/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
`;

// Add all article pages
keywords.forEach(item => {
    sitemap += `  <!-- ${item.title} -->
  <url>
    <loc>${baseUrl}/articles/${item.slug}.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
`;
});

sitemap += `</urlset>`;

// Write sitemap to public folder
const outputPath = path.join(__dirname, '../public/sitemap.xml');
fs.writeFileSync(outputPath, sitemap, 'utf8');

console.log(`✅ Generated sitemap.xml with ${keywords.length + 2} URLs`);
console.log(`   - Homepage`);
console.log(`   - Articles Index`);
console.log(`   - ${keywords.length} Article Pages`);
