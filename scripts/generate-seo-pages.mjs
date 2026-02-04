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
    const { focus, keyword, h1, type } = item;

    if (type === 'lead-gen') {
        return `
            <p class="mb-6">Finding a qualified <span class="font-bold text-[#F6F7FB]">${keyword}</span> is one of the most important decisions a veteran can make. When your benefits are on the line, having a local expert who understands both the law and the specific challenges faced by Texas veterans can be the difference between a denial and a 100% P&T rating.</p>

            <p class="mb-8">While many veterans successfully navigate the process using a <a href="/products.html" class="text-[#C21818] hover:underline font-bold">strategic guide</a>, some cases require the heavy lifting that only an experienced attorney can provide—especially for complex appeals or Higher-Level Reviews.</p>

            <!-- Lead Capture Form -->
            <div class="my-12 p-8 bg-primary/5 rounded-3xl border border-[#C21818]/20" id="lead-container">
                <div id="lead-success" class="hidden text-center py-8">
                    
                    <h3 class="text-2xl font-black text-[#F6F7FB] mb-2">Request Received</h3>
                    <p class="text-[#A9B3C2]">A vetted representative will reach out to you shortly to discuss your case.</p>
                </div>
                
                <form id="lead-capture-form" class="space-y-4">
                    <input type="hidden" name="keyword" value="${keyword}">
                    <h3 class="text-xl font-black text-[#F6F7FB] italic uppercase mb-4">Get a Free Case Evaluation</h3>
                    <p class="text-sm text-[#A9B3C2] mb-6">Connect with a Texas-based VA disability expert to review your claim at no cost.</p>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="name" placeholder="Full Name" required class="w-full px-4 py-3 rounded-xl border-white/10 focus:ring-primary focus:border-[#C21818]">
                        <input type="email" name="email" placeholder="Email Address" required class="w-full px-4 py-3 rounded-xl border-white/10 focus:ring-primary focus:border-[#C21818]">
                    </div>
                    <input type="tel" name="phone" placeholder="Phone Number" required class="w-full px-4 py-3 rounded-xl border-white/10 focus:ring-primary focus:border-[#C21818]">
                    <textarea name="message" placeholder="Briefly describe your situation (e.g., 'Denied for PTSD', 'Need increase')" class="w-full px-4 py-3 rounded-xl border-white/10 focus:ring-primary focus:border-[#C21818] h-32"></textarea>
                    
                    <button type="submit" class="w-full py-4 bg-[#C21818] text-white font-black rounded-xl shadow-lg shadow-[#C21818]/20 hover:bg-[#a01414] transition-all transform hover:scale-[1.02] uppercase tracking-wider">
                        Request Free Evaluation
                    </button>
                    <p class="text-[10px] text-[#A9B3C2] text-center uppercase font-bold">No obligation • 100% Confidential • Local Texas Experts</p>
                </form>
            </div>

            <h2 class="text-2xl font-black text-[#F6F7FB] mb-6 italic uppercase tracking-tight">Why Texas Veterans Choose Local Legal Help</h2>
            
            <p class="mb-6">Texas has one of the largest veteran populations in the country, and local attorneys are uniquely familiar with the regional offices in Waco and Houston. Here is what to look for when choosing a representative:</p>
            
            <ul class="space-y-4 mb-10 list-disc pl-6">
                <li><strong class="text-[#F6F7FB]">Accreditation:</strong> Ensure they are accredited by the VA to represent veterans.</li>
                <li><strong class="text-[#F6F7FB]">No Upfront Fees:</strong> Most VA attorneys work on a contingency basis (they only get paid if you win).</li>
                <li><strong class="text-[#F6F7FB]">Proven Track Record:</strong> Ask about their success rate with your specific condition.</li>
            </ul>

            <div class="p-6 bg-navy text-white rounded-2xl mb-12">
                <p class="text-sm leading-relaxed italic">
                    <span class="font-bold text-[#C21818] not-italic">ATTENTION:</span> If you prefer to handle the claim yourself but need the exact "winning" strategy I used to reach 100%, <a href="/products.html" class="underline hover:text-[#C21818]">click here to download the Evidence Templates</a>.
                </p>
            </div>

            <script src="/scripts/partner-lead.js"></script>
        `;
    }

    let content = `
        <p class="mb-6">If you're searching for "<span class="font-bold text-[#F6F7FB]">${keyword}</span>", you're likely in one of two situations: either you're actively tracking your claim and want to understand what's happening, or you're frustrated because nothing seems to be moving forward.</p>

        <p class="mb-8">I've been there. When I filed my VA claim, I refreshed that status page more times than I'd like to admit. But here's what I learned: <strong class="text-[#F6F7FB]">checking your status is important, but understanding the process and having a solid strategy is what actually gets you approved.</strong></p>

        <!-- Bookmark CTA -->
        <div class="my-12 p-8 bg-white/5 rounded-3xl border border-white/10 text-center">
            <button onclick="bookmarkPage()" class="px-8 py-3 bg-[#C21818] text-white font-bold rounded-full shadow-lg shadow-[#C21818]/20 hover:bg-[#a01414] transition-all transform hover:scale-105 mb-3">
                
                Bookmark This Guide
            </button>
            <p class="text-xs text-[#A9B3C2] font-bold uppercase tracking-widest">Save this for easy reference during your claim</p>
        </div>

        <h2 class="text-2xl font-black text-[#F6F7FB] mb-6 italic uppercase tracking-tight">How to Check Your VA Claim Status</h2>
        
        <p class="mb-6 font-medium">Follow these exact steps to check your status online right now:</p>
        
        <ol class="space-y-4 mb-10 list-decimal pl-6">
            <li><strong class="text-[#F6F7FB]">Visit VA.gov:</strong> Go to the official <a href="https://www.va.gov/claim-or-appeal-status/" target="_blank" class="text-[#C21818] hover:underline font-bold">status portal</a>.</li>
            <li><strong class="text-[#F6F7FB]">Sign in:</strong> Use Login.gov or ID.me for secure access.</li>
            <li><strong class="text-[#F6F7FB]">Select Your Claim:</strong> View the list of active and closed claims.</li>
            <li><strong class="text-[#F6F7FB]">Review the Timeline:</strong> Check which stage your claim is in and see estimated completion dates.</li>
        </ol>

        <div class="p-6 bg-primary/5 rounded-2xl border border-[#C21818]/10 mb-12">
            <p class="text-sm leading-relaxed text-[#A9B3C2] italic">
                <span class="font-bold text-[#C21818] not-italic">⚡ QUICK TIP:</span> You can also call 1-800-827-1000, but the online portal is 2x faster and shows more detail.
            </p>
        </div>

        <h2 class="text-2xl font-black text-[#F6F7FB] mb-6 italic uppercase tracking-tight">Understanding the 8 Stages</h2>
        
        <div class="grid gap-4 mb-12">
            <div class="flex items-start space-x-4 p-4 bg-white border border-gray-50 rounded-2xl">
                <span class="w-8 h-8 rounded-full bg-gray-100 text-[#A9B3C2] flex items-center justify-center font-bold text-xs flex-shrink-0">1</span>
                <div>
                   <p class="font-bold text-[#F6F7FB]">Claim Received</p>
                   <p class="text-xs text-[#A9B3C2]">The VA has your application and is performing a basic check.</p>
                </div>
            </div>
            <div class="flex items-start space-x-4 p-4 bg-white border border-gray-50 rounded-2xl">
                <span class="w-8 h-8 rounded-full bg-gray-100 text-[#A9B3C2] flex items-center justify-center font-bold text-xs flex-shrink-0">2</span>
                <div>
                   <p class="font-bold text-[#F6F7FB]">Initial Review</p>
                   <p class="text-xs text-[#A9B3C2]">A VA employee is verifying all required forms are present.</p>
                </div>
            </div>
            <div class="flex items-start space-x-4 p-4 bg-primary/10 border border-[#C21818]/20 rounded-2xl">
                <span class="w-8 h-8 rounded-full bg-[#C21818] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">3</span>
                <div>
                   <p class="font-bold text-[#F6F7FB]">Evidence Gathering</p>
                   <p class="text-xs text-[#A9B3C2] italic uppercase font-medium">Longest stage. Scheduling exams and gathering records.</p>
                </div>
            </div>
        </div>

        <div class="my-16 text-center">
            <p class="text-[#A9B3C2] font-bold uppercase tracking-widest text-xs mb-4 italic italic">The Outcome You Want:</p>
            <div class="bg-white/5 p-6 rounded-3xl border border-white/10 mb-8 inline-block max-w-full overflow-hidden">
                <img src="/images/proof/ClaimLetter-2024-3-12_pages-to-jpg-0013.jpg" alt="100% VA Award Letter" class="rounded-xl shadow-lg border border-white mx-auto grayscale hover:grayscale-0 transition-all duration-700">
                <p class="mt-6 text-xl font-black text-[#F6F7FB] italic uppercase tracking-tighter">100% P&T Approved</p>
                <p class="text-sm text-[#A9B3C2] mt-2 font-medium italic">If you aren't seeing this yet, your strategy is missing a crucial step.</p>
            </div>
        </div>

        <h2 class="text-2xl font-black text-[#F6F7FB] mb-6 italic uppercase tracking-tight">What to Do While Waiting</h2>
        
        <p class="mb-6">Don't just refresh the page. This is the time to ensure your combat-related evidence is "bulletproof". I've helped <span class="text-[#C21818] font-bold">127+ veterans</span> win their claims by focusing on 3 things:</p>
        
        <ul class="space-y-4 mb-12">
            <li class="flex items-start space-x-3">
                
                <span class="font-medium">Medical Evidence linking symptoms to service</span>
            </li>
            <li class="flex items-start space-x-3">
                
                <span class="font-medium">Strategic Nexus Letters from qualified doctors</span>
            </li>
            <li class="flex items-start space-x-3">
                
                <span class="font-medium">Accurate C&P exam preparation (Knowing the keywords)</span>
            </li>
        </ul>

        <script>
        function bookmarkPage() {
            if (window.sidebar && window.sidebar.addPanel) {
                window.sidebar.addPanel(document.title, window.location.href, '');
            } else if (window.external && ('AddFavorite' in window.external)) {
                window.external.AddFavorite(location.href, document.title);
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
