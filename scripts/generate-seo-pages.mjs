import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the keyword data
const keywordsPath = path.join(__dirname, '../data/seo-keywords.json');
const keywords = JSON.parse(fs.readFileSync(keywordsPath, 'utf8'));

// Read the template
const templatePath = path.join(__dirname, '../src/templates/article.html');
const template = fs.readFileSync(templatePath, 'utf8');

// Output directory
const outputDir = path.join(__dirname, '../articles');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Content generation function based on focus
function generateContent(item) {
    const { focus, keyword, h1 } = item;

    let content = `
        <p>If you're searching for "${keyword}", you're likely in one of two situations: either you're actively tracking your claim and want to understand what's happening, or you're frustrated because nothing seems to be moving forward.</p>

        <p>I've been there. When I filed my VA claim, I refreshed that status page more times than I'd like to admit. But here's what I learned: <strong>checking your status is important, but understanding the process and having a solid strategy is what actually gets you approved.</strong></p>

        <!-- Bookmark Button -->
        <div style="text-align: center; margin: 2rem 0;">
            <button onclick="bookmarkPage()" style="background: #4CAF50; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                🔖 Bookmark This Page
            </button>
            <p style="font-size: 0.85rem; color: #666; margin-top: 0.5rem;">Save this guide for easy reference</p>
        </div>

        <h2>How to Check Your VA Claim Status (Step-by-Step)</h2>
        
        <p>Here's exactly how to check your VA claim status online:</p>
        
        <ol style="line-height: 2;">
            <li><strong>Go to VA.gov:</strong> Visit <a href="https://www.va.gov/claim-or-appeal-status/" target="_blank" rel="noopener">www.va.gov/claim-or-appeal-status</a></li>
            <li><strong>Sign in:</strong> Use your Login.gov, ID.me, DS Logon, or My HealtheVet account</li>
            <li><strong>View your claims:</strong> You'll see a list of all your active and closed claims</li>
            <li><strong>Click on a claim:</strong> Select the claim you want to check for detailed status information</li>
            <li><strong>Review the timeline:</strong> See which stage your claim is in and what's happening next</li>
        </ol>

        <div class="key-takeaway">
            <strong>⚡ Quick Tip:</strong> You can also check your status by calling 1-800-827-1000 (Monday-Friday, 8am-9pm ET), but the online portal updates faster and provides more detail.
        </div>

        <h2>If This ISN'T What You See...</h2>
        
        <p>Most veterans check their claim status hoping to see something like this:</p>

        <div style="text-align: center; margin: 2.5rem 0; padding: 2rem; background: #f8f9fa; border-radius: 12px;">
            <img src="/images/proof/ClaimLetter-2024-3-12_pages-to-jpg-0013.jpg" 
                 alt="100% VA Disability Award Letter" 
                 style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
            <p style="margin-top: 1.5rem; font-size: 1.2rem; font-weight: 600; color: #0B1F38;">100% P&T VA Disability Rating Approved</p>
            <p style="color: #666; margin-top: 0.5rem;">If your claim status doesn't show this yet, you need a better strategy.</p>
        </div>

        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; border-radius: 12px; margin: 2rem 0; text-align: center;">
            <h3 style="color: white; margin: 0 0 1rem;">Here's How to Get That Approval Letter</h3>
            <p style="margin: 0 0 1.5rem; font-size: 1.1rem;">I went from checking my status every day to receiving my 100% P&T approval in 13 months. The difference? A proven strategy.</p>
            <a href="/#purchase" class="cta-btn">Learn the Exact Strategy I Used — $197</a>
            <p style="font-size: 0.9rem; margin-top: 1rem; opacity: 0.95;">✅ 30-Day Money-Back Guarantee</p>
        </div>

        <h2>Understanding Your VA Claim Status</h2>
        
        <p>The VA claim process typically moves through these stages:</p>
        
        <ul>
            <li><strong>Claim Received:</strong> The VA has your application and is reviewing it for completeness</li>
            <li><strong>Initial Review:</strong> A VA employee is checking that you submitted all required forms</li>
            <li><strong>Evidence Gathering:</strong> The VA is collecting your medical records and scheduling exams</li>
            <li><strong>Review of Evidence:</strong> A rater is examining all the evidence in your file</li>
            <li><strong>Preparation for Decision:</strong> Your rating is being calculated and your decision letter is being prepared</li>
            <li><strong>Pending Decision Approval:</strong> A senior rater is reviewing the decision</li>
            <li><strong>Preparation for Notification:</strong> Your decision letter is being finalized</li>
            <li><strong>Complete:</strong> Decision made and letter sent</li>
        </ul>

        <div class="key-takeaway">
            <strong>⚡ Key Takeaway:</strong> The average VA claim takes 130-150 days to process, but claims with complete evidence and proper documentation often move faster. The key is submitting a strong claim from the start.
        </div>

        <h2>What You Should Do Right Now</h2>
        
        <p>Instead of just waiting and checking your status every day, here's what actually moves your claim forward:</p>
        
        <ol>
            <li><strong>Ensure you have strong medical evidence</strong> linking your condition to military service</li>
            <li><strong>Submit a nexus letter</strong> from a qualified medical professional if needed</li>
            <li><strong>Gather buddy statements</strong> that corroborate your claim</li>
            <li><strong>Respond quickly</strong> to any VA requests for additional information</li>
            <li><strong>Know your rights</strong> and what evidence the VA actually needs</li>
        </ol>

        <h2>Common Mistakes That Delay Your Claim</h2>
        
        <p>After helping 127+ veterans, I've seen the same mistakes over and over:</p>
        
        <ul>
            <li><strong>Incomplete initial application:</strong> Missing forms or evidence means delays</li>
            <li><strong>Poor C&P exam performance:</strong> Not knowing what to say (or not say) during your exam</li>
            <li><strong>Weak service connection:</strong> Failing to clearly link your condition to military service</li>
            <li><strong>Missing the combat-related angle:</strong> For PTSD claims, this can be the difference between approval and denial</li>
        </ul>

        <h2>The Bottom Line</h2>
        
        <p>Checking your VA claim status is important for staying informed, but it won't speed up your claim. What will speed it up is submitting a complete, well-documented claim with strong evidence from the start.</p>

        <p>I went from 0% to 100% P&T in 13 months by focusing on the strategy, not the status page. The system I used is the same one I teach in my complete guide—and it's helped over 127 veterans win their claims.</p>

        <script>
        function bookmarkPage() {
            if (window.sidebar && window.sidebar.addPanel) {
                window.sidebar.addPanel(document.title, window.location.href, '');
            } else if (window.external && ('AddFavorite' in window.external)) {
                window.external.AddFavorite(location.href, document.title);
            } else if (window.opera && window.print) {
                var elem = document.createElement('a');
                elem.setAttribute('href', location.href);
                elem.setAttribute('title', document.title);
                elem.setAttribute('rel', 'sidebar');
                elem.click();
            } else {
                alert('Press ' + (navigator.userAgent.toLowerCase().indexOf('mac') != -1 ? 'Cmd' : 'Ctrl') + '+D to bookmark this page.');
            }
        }
        </script>
    `;

    return content;
}

// Generate each page
let generatedCount = 0;

keywords.forEach(item => {
    const content = generateContent(item);

    let page = template
        .replace(/{{TITLE}}/g, item.title)
        .replace(/{{DESCRIPTION}}/g, item.description)
        .replace(/{{KEYWORD}}/g, item.keyword)
        .replace(/{{SLUG}}/g, item.slug)
        .replace(/{{H1}}/g, item.h1)
        .replace(/{{CONTENT}}/g, content);

    const outputPath = path.join(outputDir, `${item.slug}.html`);
    fs.writeFileSync(outputPath, page, 'utf8');
    generatedCount++;

    console.log(`✅ Generated: ${item.slug}.html`);
});

console.log(`\n🎉 Successfully generated ${generatedCount} SEO pages in /articles/`);
console.log(`\n📝 Next steps:`);
console.log(`   1. Test a page: http://localhost:5173/articles/${keywords[0].slug}.html`);
console.log(`   2. Update sitemap.xml to include these new pages`);
console.log(`   3. Deploy to production\n`);
