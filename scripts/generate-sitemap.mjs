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

// Define static pages with their priorities
const staticPages = [
  { path: '/', priority: '1.0', changefreq: 'weekly', title: 'Homepage' },
  { path: '/articles', priority: '0.8', changefreq: 'weekly', title: 'Articles Index' },
  { path: '/calculator', priority: '0.7', changefreq: 'monthly', title: 'Calculator' },
  { path: '/contact', priority: '0.6', changefreq: 'monthly', title: 'Contact' },
  { path: '/privacy-policy', priority: '0.3', changefreq: 'yearly', title: 'Privacy Policy' },
  { path: '/terms-of-service', priority: '0.3', changefreq: 'yearly', title: 'Terms of Service' },
  { path: '/thank-you', priority: '0.4', changefreq: 'monthly', title: 'Thank You' },
];

const pagesDir = path.join(__dirname, '../pages');
const pageFiles = fs.existsSync(pagesDir)
  ? fs.readdirSync(pagesDir).filter(f => f.endsWith('.html') && f !== 'index.html')
  : [];

// Start sitemap with XML declaration
let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

`;

// Add static pages
staticPages.forEach(page => {
  sitemap += `  <!-- ${page.title} -->
  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>

`;
});

// Add pages from /pages directory
pageFiles.forEach(file => {
  const fileName = file.replace('.html', '');
  const title = fileName.charAt(0).toUpperCase() + fileName.slice(1).replace(/-/g, ' ');
  sitemap += `  <!-- ${title} -->
  <url>
    <loc>${baseUrl}/pages/${file.replace('.html', '')}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

`;
});

// Add all article pages
keywords.forEach(item => {
  sitemap += `  <!-- ${item.title} -->
  <url>
    <loc>${baseUrl}/articles/${item.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

`;
});

sitemap += `</urlset>`;

// Write sitemap to root folder (for deployment)
const rootOutputPath = path.join(__dirname, '../sitemap.xml');
fs.writeFileSync(rootOutputPath, sitemap, 'utf8');

// Also write to public folder
const publicOutputPath = path.join(__dirname, '../public/sitemap.xml');
if (!fs.existsSync(path.dirname(publicOutputPath))) {
  fs.mkdirSync(path.dirname(publicOutputPath), { recursive: true });
}
fs.writeFileSync(publicOutputPath, sitemap, 'utf8');

const totalUrls = staticPages.length + pageFiles.length + keywords.length;
console.log(`✅ Generated sitemap.xml with ${totalUrls} URLs`);
console.log(`   - ${staticPages.length} Static Pages`);
console.log(`   - ${pageFiles.length} Pages Directory Files`);
console.log(`   - ${keywords.length} Article Pages`);
