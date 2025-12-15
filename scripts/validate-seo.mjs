import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const errors = [];
const warnings = [];
let totalPages = 0;

console.log('🔍 Starting SEO Validation...\n');

// Check sitemap exists
const sitemapPath = path.join(__dirname, '../sitemap.xml');
if (!fs.existsSync(sitemapPath)) {
    errors.push('❌ sitemap.xml not found in root directory');
} else {
    console.log('✅ sitemap.xml exists');
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
    const urlCount = (sitemapContent.match(/<loc>/g) || []).length;
    console.log(`   Found ${urlCount} URLs in sitemap`);
}

// Check robots.txt exists
const robotsPath = path.join(__dirname, '../robots.txt');
if (!fs.existsSync(robotsPath)) {
    errors.push('❌ robots.txt not found');
} else {
    console.log('✅ robots.txt exists');
    const robotsContent = fs.readFileSync(robotsPath, 'utf8');
    if (!robotsContent.includes('Sitemap:')) {
        warnings.push('⚠️  robots.txt missing Sitemap directive');
    }
}

// Check all HTML files for SEO issues
const checkHtmlFile = (filePath, relativePath) => {
    totalPages++;
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);

    // Check for canonical tag
    if (!content.includes('rel="canonical"')) {
        warnings.push(`⚠️  ${relativePath}: Missing canonical tag`);
    }

    // Check for meta description
    if (!content.includes('name="description"')) {
        warnings.push(`⚠️  ${relativePath}: Missing meta description`);
    }

    // Check for title tag
    if (!content.includes('<title>')) {
        errors.push(`❌ ${relativePath}: Missing title tag`);
    }

    // Check for broken image links (common patterns)
    const imgMatches = content.match(/src="([^"]+)"/g) || [];
    imgMatches.forEach(match => {
        const src = match.match(/src="([^"]+)"/)[1];
        if (src.startsWith('/images/')) {
            const imgPath = path.join(__dirname, '..', src);
            if (!fs.existsSync(imgPath)) {
                errors.push(`❌ ${relativePath}: Broken image link: ${src}`);
            }
        }
    });

    // Check for Open Graph tags
    if (!content.includes('property="og:')) {
        warnings.push(`⚠️  ${relativePath}: Missing Open Graph tags`);
    }
};

// Check articles
console.log('\n📄 Checking Articles...');
const articlesDir = path.join(__dirname, '../articles');
if (fs.existsSync(articlesDir)) {
    const articleFiles = fs.readdirSync(articlesDir).filter(f => f.endsWith('.html'));
    articleFiles.forEach(file => {
        checkHtmlFile(path.join(articlesDir, file), `articles/${file}`);
    });
    console.log(`   Checked ${articleFiles.length} article files`);
}

// Check pages directory
console.log('\n📄 Checking Pages...');
const pagesDir = path.join(__dirname, '../pages');
if (fs.existsSync(pagesDir)) {
    const pageFiles = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));
    pageFiles.forEach(file => {
        checkHtmlFile(path.join(pagesDir, file), `pages/${file}`);
    });
    console.log(`   Checked ${pageFiles.length} page files`);
}

// Check root HTML files
console.log('\n📄 Checking Root Files...');
const rootFiles = ['index.html', 'contact.html', 'privacy-policy.html', 'terms-of-service.html', 'thank-you.html'];
rootFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
        checkHtmlFile(filePath, file);
    } else {
        warnings.push(`⚠️  ${file} not found in root`);
    }
});

// Print summary
console.log('\n' + '='.repeat(60));
console.log('📊 SEO VALIDATION SUMMARY');
console.log('='.repeat(60));
console.log(`Total pages checked: ${totalPages}`);
console.log(`Errors: ${errors.length}`);
console.log(`Warnings: ${warnings.length}`);

if (errors.length > 0) {
    console.log('\n❌ ERRORS:');
    errors.forEach(err => console.log(err));
}

if (warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:');
    warnings.slice(0, 10).forEach(warn => console.log(warn));
    if (warnings.length > 10) {
        console.log(`   ... and ${warnings.length - 10} more warnings`);
    }
}

if (errors.length === 0 && warnings.length === 0) {
    console.log('\n✅ All SEO checks passed!');
}

console.log('\n' + '='.repeat(60));
