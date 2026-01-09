import { defineConfig } from 'vite'
import { copyFileSync, mkdirSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'

export default defineConfig({
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: 'index.html',
                calculator: 'calculator.html',
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

                if (existsSync(productDir)) {
                    if (!existsSync(distProductDir)) {
                        mkdirSync(distProductDir, { recursive: true })
                    }

                    const productFiles = readdirSync(productDir)
                    productFiles.forEach(file => {
                        copyFileSync(
                            join(productDir, file),
                            join(distProductDir, file)
                        )
                    })
                    console.log(`✅ Copied ${productFiles.length} product pages to dist/product/`)
                }

                // Copy SEO files (sitemap, robots.txt, etc.)
                const seoFiles = ['sitemap.xml', 'robots.txt', 'site.webmanifest', 'favicon.svg', 'calculator.html']
                seoFiles.forEach(file => {
                    if (existsSync(file)) {
                        copyFileSync(file, join('dist', file))
                        console.log(`✅ Copied ${file} to dist/`)
                    }
                })
            }
        }
    ]
})
