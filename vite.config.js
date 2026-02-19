import { defineConfig } from 'vite'
import { copyFileSync, mkdirSync, readdirSync, existsSync, readFileSync, writeFileSync, statSync } from 'fs'
import { join } from 'path'

export default defineConfig({
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: 'index.html',
                calculator: 'calculator.html',
                products: 'products.html',
            }
        }
    },
    server: {
        port: 5173
    },
    plugins: [
        {
            name: 'copy-seo-files',
            closeBundle() {
                // Copy articles folder to dist after build
                const articlesDir = 'articles'
                const distArticlesDir = 'dist/articles'

                if (existsSync(articlesDir)) {
                    if (!existsSync(distArticlesDir)) {
                        mkdirSync(distArticlesDir, { recursive: true })
                    }

                    const files = readdirSync(articlesDir)
                    files.forEach(file => {
                        copyFileSync(
                            join(articlesDir, file),
                            join(distArticlesDir, file)
                        )
                    })
                    console.log(`✅ Copied ${files.length} SEO articles to dist/articles/`)
                }

                // Copy pages folder to dist
                const pagesDir = 'pages'
                const distPagesDir = 'dist/pages'

                if (existsSync(pagesDir)) {
                    if (!existsSync(distPagesDir)) {
                        mkdirSync(distPagesDir, { recursive: true })
                    }

                    const pageFiles = readdirSync(pagesDir)
                    pageFiles.forEach(file => {
                        copyFileSync(
                            join(pagesDir, file),
                            join(distPagesDir, file)
                        )
                    })
                    console.log(`✅ Copied ${pageFiles.length} pages to dist/pages/`)
                }

                // Copy product folder to dist
                const productDir = 'product'
                const distProductDir = 'dist/product'

                const copyRecursiveSync = function(src, dest) {
                    const exists = existsSync(src);
                    const stats = exists && statSync(src);
                    const isDirectory = exists && stats.isDirectory();
                    if (isDirectory) {
                        if (!existsSync(dest)) {
                            mkdirSync(dest, { recursive: true });
                        }
                        readdirSync(src).forEach(function(childItemName) {
                            copyRecursiveSync(join(src, childItemName), join(dest, childItemName));
                        });
                    } else {
                        copyFileSync(src, dest);
                    }
                };

                if (existsSync(productDir)) {
                    copyRecursiveSync(productDir, distProductDir);
                    console.log(`✅ Copied product directory to dist/product/`)
                }

                // Copy images folder to dist (photos, proof screenshots, etc.)
                const imagesDir = 'images'
                const distImagesDir = 'dist/images'
                if (existsSync(imagesDir)) {
                    copyRecursiveSync(imagesDir, distImagesDir);
                    console.log(`✅ Copied images directory to dist/images/`)
                }

                // Copy og folder to dist (Open Graph images)
                const ogDir = 'og'
                const distOgDir = 'dist/og'
                if (existsSync(ogDir)) {
                    copyRecursiveSync(ogDir, distOgDir);
                    console.log(`✅ Copied og directory to dist/og/`)
                }

                // Copy generated PDFs to dist
                const pdfsDir = 'product/pdfs'
                const distPdfsDir = 'dist/product/pdfs'

                if (existsSync(pdfsDir)) {
                    if (!existsSync(distPdfsDir)) {
                        mkdirSync(distPdfsDir, { recursive: true })
                    }
                    const pdfFiles = readdirSync(pdfsDir)
                    pdfFiles.forEach(file => {
                        copyFileSync(join(pdfsDir, file), join(distPdfsDir, file))
                    })
                    console.log(`✅ Copied ${pdfFiles.length} PDFs to dist/product/pdfs/`)
                }

                // Copy SEO files and standalone pages
                const seoFiles = [
                    'sitemap.xml',
                    'robots.txt',
                    'site.webmanifest',
                    'favicon.svg',
                    'calculator.html',
                    'products.html',
                    'privacy-policy.html',
                    'terms-of-service.html',
                    'contact.html',
                    'thank-you.html',
                    '404.html'
                ]
                seoFiles.forEach(file => {
                    if (existsSync(file)) {
                        copyFileSync(file, join('dist', file))
                        console.log(`✅ Copied ${file} to dist/`)
                    }
                })

                // Fix CSS links in all HTML files to match compiled CSS
                const cssMatch = readdirSync(join('dist', 'assets'))
                    .find(f => f.startsWith('index-') && f.endsWith('.css'))

                if (cssMatch) {
                    const fixCssLinks = (filePath) => {
                        if (existsSync(filePath)) {
                            let content = readFileSync(filePath, 'utf8')
                            // Handle both standard link tags and our optimized preload tags
                            const cssRegex = /<link rel="(?:stylesheet|preload)" href="\/src\/styles\/index\.css"[^>]*>/g
                            if (cssRegex.test(content)) {
                                content = content.replace(
                                    cssRegex,
                                    `<link rel="preload" href="/assets/${cssMatch}" as="style" onload="this.onload=null;this.rel='stylesheet'"><noscript><link rel="stylesheet" href="/assets/${cssMatch}"></noscript>`
                                )
                                writeFileSync(filePath, content)
                                return true
                            }
                        }
                        return false
                    }

                    // Fix standalone HTML pages
                    const standalonePagesToFix = [
                        'products.html',
                        'privacy-policy.html',
                        'terms-of-service.html',
                        'contact.html',
                        'thank-you.html',
                        '404.html'
                    ]
                    standalonePagesToFix.forEach(file => {
                        if (fixCssLinks(join('dist', file))) {
                            console.log(`✅ Fixed CSS link in ${file}`)
                        }
                    })

                    // Fix all articles
                    if (existsSync(distArticlesDir)) {
                        const articleFiles = readdirSync(distArticlesDir).filter(f => f.endsWith('.html'))
                        let fixedCount = 0
                        articleFiles.forEach(file => {
                            if (fixCssLinks(join(distArticlesDir, file))) {
                                fixedCount++
                            }
                        })
                        if (fixedCount > 0) {
                            console.log(`✅ Fixed CSS links in ${fixedCount} article files`)
                        }
                    }

                    // Fix all pages
                    if (existsSync(distPagesDir)) {
                        const pageFiles = readdirSync(distPagesDir).filter(f => f.endsWith('.html'))
                        let fixedCount = 0
                        pageFiles.forEach(file => {
                            if (fixCssLinks(join(distPagesDir, file))) {
                                fixedCount++
                            }
                        })
                        if (fixedCount > 0) {
                            console.log(`✅ Fixed CSS links in ${fixedCount} page files`)
                        }
                    }
                }
            }
        }
    ]
})
