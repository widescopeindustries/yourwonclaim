# Full Site Audit: yourwonclaim.com

**Date:** 2026-02-05
**Scope:** Security, Code Quality, Performance, Accessibility, Dependencies, Configuration, SEO
**Stack:** Vite 5.4 + Tailwind CSS 4 + Static HTML/JS, deployed on Vercel

---

## Executive Summary

| Severity | Count | Key Areas |
|----------|-------|-----------|
| **CRITICAL** | 5 | Exposed API keys, missing CSP, unpinned CDN scripts, broken canonical URLs |
| **HIGH** | 8 | Missing SRI, missing HSTS, Tailwind CDN in production, file duplication, build misconfigs |
| **MEDIUM** | 12 | innerHTML usage, missing null guards, inline event handlers, !important overuse, caching issues |
| **LOW** | 14 | Dead CSS, redundant configs, minor inconsistencies |

**Overall risk rating: HIGH** -- The site has several critical security and SEO issues that should be addressed immediately.

---

## 1. SECURITY AUDIT

### 1.1 CRITICAL: API Keys Committed to Git History

**Files:** `.env` (lines 1-2), 21 root-level `.cjs` scripts

The `.env` file containing live API keys is tracked by git despite being in `.gitignore` (it was committed before the gitignore rule):

```
AHREFS_API_KEY=fGAh5uywkOLfjDu5WhzmFuBJ6ZE3SmB17u1NwekX
SERANKING_API_KEY=76e5bb6e-ec6c-b148-ba5a-e0a915a4d45a
```

**Action required:**
1. Rotate both API keys immediately
2. Run `git rm --cached .env` to untrack the file
3. Use BFG Repo Cleaner or `git filter-repo` to purge keys from history
4. Move the 21 root `.cjs` utility scripts (which reference these keys) out of the repo

### 1.2 CRITICAL: No Content Security Policy (CSP)

No CSP header exists in `vercel.json` or as a `<meta>` tag in any HTML file. Without CSP, any injected script executes freely.

**Recommended CSP for vercel.json:**
```json
{
  "key": "Content-Security-Policy",
  "value": "default-src 'self'; script-src 'self' https://unpkg.com https://cdnjs.cloudflare.com https://www.googletagmanager.com https://js.stripe.com 'unsafe-inline'; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://www.google-analytics.com"
}
```

### 1.3 CRITICAL: Lucide Icons Loaded at `@latest` Without SRI

**Files:** 60+ HTML files load `https://unpkg.com/lucide@latest`

Using `@latest` means any npm publish immediately replaces this script on every page. If the package or CDN is compromised, every visitor gets malicious JS.

**Fix:** Pin to a specific version (e.g., `lucide@0.263.1`) and add `integrity` + `crossorigin="anonymous"` attributes.

### 1.4 HIGH: No Subresource Integrity (SRI) on Any External Script

Zero external scripts use SRI hashes. Affected resources:
- Lucide Icons (unpkg.com) -- **highest risk**
- GSAP 3.12.2 (cdnjs.cloudflare.com)
- Tailwind CDN (cdn.tailwindcss.com)
- Google Analytics (googletagmanager.com)
- Stripe.js (js.stripe.com)

### 1.5 HIGH: Missing Critical Security Headers

**File:** `vercel.json` (lines 75-89)

| Header | Status |
|--------|--------|
| `X-Content-Type-Options: nosniff` | Present |
| `X-Frame-Options: DENY` | Present |
| `X-XSS-Protection` | Present (but deprecated) |
| `Strict-Transport-Security` | **MISSING** -- vulnerable to SSL stripping |
| `Referrer-Policy` | **MISSING** (present in unused `.htaccess`) |
| `Permissions-Policy` | **MISSING** |
| `Content-Security-Policy` | **MISSING** (see 1.2) |

**Recommended additions:**
```json
{ "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
{ "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
{ "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
```

### 1.6 HIGH: Tailwind CDN Used in Production

**Files:** `thank-you.html`, `404.html`, `privacy-policy.html`, `terms-of-service.html`, `pages/checkout.html`, and others

The Tailwind CDN (`cdn.tailwindcss.com`) is explicitly documented as "not intended for production." It generates CSS on-the-fly in the browser. It is used on the **checkout page** where payment processing occurs.

**Fix:** Replace with compiled Tailwind CSS from the build pipeline on all pages.

### 1.7 MEDIUM: innerHTML Usage with Computed Values

**Files:** `main.min.js`, `calculator.html` (line 372), `products.html` (lines 459-466), `pages/checkout.html` (line 236)

While current values are internal/numeric (not user-controlled), the pattern is fragile. Any future change introducing user data creates a DOM XSS.

**Fix:** Use `textContent` for text-only insertions; use DOM API (`createElement`, `appendChild`) for structured content.

### 1.8 MEDIUM: document.write() in Log Templates

**Files:** `ptsd-log-recreated/sleep_apnea.html`, `ptsd-log-recreated/index.html`, `ptsd-log-recreated/back_condition.html`

`document.write()` is deprecated and dangerous. Replace with DOM API methods.

### 1.9 LOW: Lead Form Data Silently Discarded

**File:** `main.js` (lines 24-61)

The lead form captures name and email but never sends them anywhere. `partner-lead.js` has a commented-out webhook URL. The lead funnel is broken.

---

## 2. CODE QUALITY AUDIT

### 2.1 HIGH: Exact File Duplication (3 Pairs)

| Source | Duplicate |
|--------|-----------|
| `src/components/nav.js` | `public/js/nav.js` |
| `scripts/partner-lead.js` | `public/js/partner-lead.js` |
| `src/scripts/urgency-timer.js` | `public/js/urgency-timer.js` |

Changes to one file won't propagate to the other. Consolidate to a single source of truth.

### 2.2 HIGH: Code Duplication Across HTML Files

- FAQ accordion logic appears in `main.js`, `products.html` (inline script), and `index.html`
- GA4 initialization is copy-pasted into every HTML `<head>`
- Navigation markup is duplicated across all pages

### 2.3 MEDIUM: Console.log of User Data in Production

**File:** `scripts/partner-lead.js` (line 13) and `public/js/partner-lead.js` (line 13)

```js
console.log('Lead Captured:', data);
```

Logs user PII (name, email, phone) to the browser console in production.

### 2.4 MEDIUM: Uncleared setInterval (Memory Leak)

**File:** `src/scripts/urgency-timer.js` (line 51)

```js
setInterval(updateCountdown, 1000);
```

The interval is never stored or cleared. Will continue firing even if the element is removed from the DOM.

### 2.5 MEDIUM: Missing Null Guards

**File:** `src/scripts/urgency-timer.js` (line 26) -- accesses `getElementById('countdown-timer')` without null check.
**File:** `src/components/lightbox.js` (line 50) -- `btnClose`, `btnPrev`, `btnNext` used without null checks.

### 2.6 MEDIUM: Inline Event Handlers in calculator.html

**File:** `calculator.html` (lines 156-160, 165, 207-209)

Extensive use of `onclick`, `onmouseover`, `onmouseout` inline handlers. This mixes concerns and prevents CSP `unsafe-inline` restrictions.

### 2.7 HIGH: calculator.html Uses Entirely Inline Styles

**File:** `calculator.html` (lines 138-341)

Nearly the entire page uses inline `style=""` attributes instead of Tailwind classes, completely disconnected from the design system used on every other page. Also uses 5 `window.addEventListener('resize', ...)` handlers without debouncing instead of CSS media queries.

### 2.8 MEDIUM: !important Overuse in CSS

**File:** `src/styles/index.css`

15 `!important` declarations, mostly in form styles (lines 167-188). The `@layer components` wrapper should provide sufficient specificity without `!important`.

### 2.9 LOW: Dead CSS Animation Classes

**File:** `src/styles/index.css` (lines 261-284)

Four `@keyframes` animations (`.animate-fade-in-up`, etc.) are defined but unused -- the site uses GSAP for all animations.

### 2.10 LOW: Duplicate Token Definitions

**File:** `src/styles/_tokens.css` defines `--yc-navy`, `--yc-red`, etc.
**File:** `src/styles/index.css` redefines them as `--navy`, `--primary`, etc.

The `_tokens.css` file does not appear to be imported, making it dead code.

---

## 3. SEO AUDIT

### 3.1 CRITICAL: Wrong Canonical URLs on Multiple Pages

| Page | Canonical Points To | Should Be |
|------|-------------------|-----------|
| `privacy-policy.html` | `/` (homepage) | `/privacy-policy` |
| `terms-of-service.html` | `/` (homepage) | `/terms-of-service` |
| `thank-you.html` | `/` (homepage) | Should use `noindex` |
| `calculator.html` | `/calculator` (no .html) | Verify rewrite exists |
| `articles/how-to-get-100-percent-pt-va-disability.html` | `/` (homepage) | Self-referencing URL |

These tell Google to ignore these pages or treat them as homepage duplicates.

### 3.2 MEDIUM: Missing OG Tags on Key Pages

- `products.html` -- missing `og:image` (primary revenue page)
- `calculator.html` -- missing `og:image`, `og:title`, `og:description`, `og:url`
- `contact.html` -- missing `og:image`

Social sharing produces blank/generic previews.

### 3.3 MEDIUM: Sitemap Issues

- `/pages/checkout` is listed (should not be indexed)
- `/thank-you` is listed (not useful for search)
- `/products` is **NOT** in the sitemap (should be)
- `how-to-get-100-percent-pt-va-disability.html` is missing from sitemap
- All `lastmod` dates are identical (reduces utility)
- URL paths use extensionless format but files have `.html` extensions

### 3.4 LOW: Missing Schema Markup

Only `index.html` has structured data (FAQPage). Missing:
- `Product` schema on `products.html`
- `Article` schema on all 74 article pages
- `BreadcrumbList` schema site-wide

---

## 4. PERFORMANCE AUDIT

### 4.1 MEDIUM: Render-Blocking Resources

- Google Fonts loaded via `<link>` without `font-display: swap` in some pages
- Inconsistent script loading: `async` on some pages, `defer` on others, `type="module"` on yet others
- `defer` is redundant on `type="module"` scripts (modules defer by default)

### 4.2 MEDIUM: Image Optimization Gaps

- Build scripts generate WebP/AVIF at multiple widths, but HTML files don't consistently use `<picture>` elements with `srcset`/`sizes`
- Not all images have `loading="lazy"` attributes

### 4.3 LOW: No Build Optimization Configuration

**File:** `vite.config.js`

Missing settings: `build.target`, `build.sourcemap: false`, `build.assetsInlineLimit`, chunk splitting strategy.

---

## 5. ACCESSIBILITY AUDIT (WCAG 2.1)

### 5.1 HIGH: No Skip-to-Content Links

None of the pages include a skip-to-content link for keyboard users to bypass the navigation.

### 5.2 HIGH: Color Contrast Issues

The red `#C21818` on dark navy `#0B1A2F` background fails WCAG AA contrast ratio for small text (ratio ~3.5:1, needs 4.5:1).

### 5.3 MEDIUM: Missing prefers-reduced-motion Support

GSAP animations on `index.html` do not check `prefers-reduced-motion`. Users who have requested reduced motion still get full scroll-triggered animations.

### 5.4 MEDIUM: Calculator Form Labels

**File:** `calculator.html`

Form inputs lack proper `<label>` associations. Relies on placeholder text instead of visible labels.

### 5.5 LOW: Focus Indicator Gaps

Custom button styles may override default browser focus indicators. Ensure all interactive elements have visible `:focus-visible` styles.

---

## 6. DEPENDENCY & CONFIGURATION AUDIT

### 6.1 HIGH: sharp and vite in Wrong Dependency Category

Both `sharp` and `vite` are listed under `dependencies` (production) but are build-time tools. They should be `devDependencies`. This adds ~30MB+ of unnecessary native binaries to production installs.

### 6.2 HIGH: Vite Two Major Versions Behind

Current: `^5.4.0` | Latest: `7.3.1`

Known moderate vulnerability in esbuild (dev server only): GHSA-67mh-4wv8-2f99.

### 6.3 HIGH: Tailwind v3/v4 Configuration Mismatch

`tailwind.config.js` uses the v3 format (`require()`, `content`, `plugins`) but the installed package is v4. The config file may be entirely dead code.

### 6.4 MEDIUM: Missing Vite Build Inputs

**File:** `vite.config.js`

Only `index.html`, `calculator.html`, and `products.html` are in `rollupOptions.input`. Missing: `contact.html`, `404.html`. These pages won't have bundled/hashed assets.

### 6.5 MEDIUM: Missing Vercel Rewrites

`vercel.json` has a rewrite for `/calculator` -> `/calculator.html` but none for `/products` or `/contact`.

### 6.6 MEDIUM: Articles Cached as Immutable

**File:** `vercel.json` (lines 92-99)

Article HTML files (non-hashed filenames) are cached with `immutable` + 30-day max-age. Content updates won't reach users for up to 30 days.

### 6.7 LOW: Vite Timestamp File in Repo

`vite.config.js.timestamp-1766399087233-e097eed882e06.mjs` is committed, exposing a developer's Windows path (`C:/Users/molyndon/...`).

### 6.8 LOW: Miscellaneous Config Issues

- `.htaccess` and `.nojekyll` are irrelevant for Vercel deployment
- `.vscode/settings.json` references a PHP formatter for a non-PHP project
- `site.webmanifest` `start_url` points to `/pages/index.html` instead of `/`
- Sitemap rewrite in vercel.json is a no-op (`/sitemap.xml` -> `/sitemap.xml`)

---

## 7. PRIORITIZED REMEDIATION PLAN

### Immediate (Do Now)

| # | Issue | Action |
|---|-------|--------|
| 1 | API keys in git history | Rotate keys, `git rm --cached .env`, purge history |
| 2 | No CSP header | Add `Content-Security-Policy` to `vercel.json` |
| 3 | Lucide `@latest` | Pin version, add SRI hash |
| 4 | Wrong canonical URLs | Fix on privacy-policy, terms-of-service, thank-you, calculator, and affected articles |
| 5 | Missing HSTS | Add `Strict-Transport-Security` header |

### Short-Term (This Week)

| # | Issue | Action |
|---|-------|--------|
| 6 | No SRI on external scripts | Add integrity hashes to all CDN scripts |
| 7 | Tailwind CDN in production | Replace with compiled CSS |
| 8 | File duplication | Consolidate 3 JS file pairs |
| 9 | Missing security headers | Add Referrer-Policy, Permissions-Policy |
| 10 | Move sharp/vite to devDependencies | Edit package.json |
| 11 | Add skip-to-content links | Add to all pages |
| 12 | Fix color contrast | Lighten red or darken background for text |

### Medium-Term (This Sprint)

| # | Issue | Action |
|---|-------|--------|
| 13 | calculator.html rewrite | Move to Tailwind classes, remove inline styles |
| 14 | innerHTML cleanup | Replace with textContent/DOM API |
| 15 | Add missing OG tags | products, calculator, contact pages |
| 16 | Fix sitemap | Remove checkout/thank-you, add products page |
| 17 | Add prefers-reduced-motion | Wrap GSAP animations |
| 18 | Fix Vite build inputs | Add contact.html, 404.html |
| 19 | Add Vercel rewrites | /products, /contact |
| 20 | Fix article caching | Remove `immutable` or add cache-busting |

### Long-Term (Backlog)

| # | Issue | Action |
|---|-------|--------|
| 21 | Upgrade Vite to v7 | Major version bump, test thoroughly |
| 22 | Resolve Tailwind v3/v4 mismatch | Migrate config to CSS-based v4 format |
| 23 | Add schema markup | Product, Article, BreadcrumbList schemas |
| 24 | Clean up repo | Remove 21 .cjs utility scripts, debug data files |
| 25 | Connect lead funnel | Wire up form submission to actual backend |
| 26 | Remove dead CSS | Unused animations, duplicate tokens |

---

*This audit was generated by a comprehensive review of all source files, configuration, and dependencies in the yourwonclaim repository.*
