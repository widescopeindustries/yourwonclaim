// YourWonClaim.com - Conversion Tracking
// Tracks Stripe clicks, purchases, and lead form submissions

(function() {
    // =====================================================
    // STRIPE CHECKOUT TRACKING
    // =====================================================
    
    function trackStripeClick(productType, price) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'stripe_checkout_click', {
                'event_category': 'conversion',
                'event_label': productType,
                'value': price,
                'currency': 'USD'
            });
        }
        
        // Also track in localStorage for post-purchase verification
        const checkoutData = {
            product: productType,
            price: price,
            timestamp: Date.now(),
            sessionId: getSessionId()
        };
        localStorage.setItem('yw_checkout_clicked', JSON.stringify(checkoutData));
    }
    
    function getSessionId() {
        let sessionId = sessionStorage.getItem('yw_session_id');
        if (!sessionId) {
            sessionId = 'sess_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('yw_session_id', sessionId);
        }
        return sessionId;
    }
    
    // Attach to all Stripe links
    function initStripeTracking() {
        // Bundle builder checkout button
        const bundleBtn = document.getElementById('bundle-checkout-btn');
        if (bundleBtn) {
            bundleBtn.addEventListener('click', function(e) {
                const href = this.href;
                if (!href || href === '#') return;
                
                let productType, price;
                if (href.includes('5kQ8wQ2ed7R7esh0m55ZC04')) {
                    productType = '2-pack-bundle';
                    price = 50;
                } else if (href.includes('28E00k4ml8Vb6ZPgl35ZC05')) {
                    productType = '3-pack-bundle';
                    price = 60;
                } else {
                    productType = '1-pack';
                    price = 29;
                }
                
                trackStripeClick(productType, price);
            });
        }
        
        // Individual product buttons
        const individualButtons = [
            { id: 'btn-buy-ptsd', product: 'ptsd-template', price: 29 },
            { id: 'btn-buy-sleep', product: 'sleep-apnea-template', price: 29 },
            { id: 'btn-buy-back', product: 'back-condition-template', price: 29 },
            { id: 'btn-buy-migraines', product: 'migraines-template', price: 29 },
            { id: 'btn-buy-tinnitus', product: 'tinnitus-template', price: 29 }
        ];
        
        individualButtons.forEach(btn => {
            const el = document.getElementById(btn.id);
            if (el) {
                el.addEventListener('click', function(e) {
                    const href = this.href;
                    if (!href || href === '#') return;
                    trackStripeClick(btn.product, btn.price);
                });
            }
        });
        
        // Final CTA button (3-pack)
        const finalCta = document.querySelector('section.py-20.lg\\:py-28 a[href*="buy.stripe.com"]');
        if (finalCta) {
            finalCta.addEventListener('click', function(e) {
                trackStripeClick('3-pack-final-cta', 60);
            });
        }
        
        // Header CTA button
        const headerCta = document.getElementById('header-cta');
        if (headerCta) {
            headerCta.addEventListener('click', function(e) {
                gtag('event', 'header_cta_click', {
                    'event_category': 'navigation',
                    'event_label': 'browse-templates'
                });
            });
        }
        
        // Hero CTA button
        const heroCta = document.getElementById('hero-cta');
        if (heroCta) {
            heroCta.addEventListener('click', function(e) {
                gtag('event', 'hero_cta_click', {
                    'event_category': 'navigation',
                    'event_label': 'browse-templates-hero'
                });
            });
        }
    }
    
    // =====================================================
    // LEAD FORM TRACKING + SUPABASE
    // =====================================================
    
    function initLeadFormTracking() {
        const leadForm = document.getElementById('lead-form');
        if (!leadForm) return;
        
        leadForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            
            if (!name || !email) {
                alert('Please fill in all fields.');
                return;
            }
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            try {
                // Track the lead submission event
                gtag('event', 'lead_form_submit', {
                    'event_category': 'conversion',
                    'event_label': 'free-roadmap',
                    'value': 0
                });
                
                // Send to Supabase if configured
                const supabaseUrl = 'https://rkqsqmmheoxafovekolj.supabase.co';
                const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrcXNxbW1oZW94YWZvdmVrb2xqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5NjQ3NzMsImV4cCI6MjA1MjU0MDc3M30.JxQX8xKzGxKzGxKzGxKzGxKzGxKzGxKzGxKzGxKzGxK';
                
                const leadData = {
                    name: name,
                    email: email,
                    source: window.location.href,
                    timestamp: new Date().toISOString()
                };
                
                // Try to save to Supabase (will fail if table doesn't exist - that's OK)
                try {
                    const response = await fetch(`${supabaseUrl}/rest/v1/leads`, {
                        method: 'POST',
                        headers: {
                            'apikey': supabaseKey,
                            'Authorization': `Bearer ${supabaseKey}`,
                            'Content-Type': 'application/json',
                            'Prefer': 'return=minimal'
                        },
                        body: JSON.stringify(leadData)
                    });
                    
                    if (response.ok) {
                        console.log('Lead saved to Supabase');
                    }
                } catch (dbError) {
                    console.log('Supabase save skipped (table may not exist):', dbError.message);
                }
                
                // Redirect to thank you page
                setTimeout(() => {
                    window.location.href = '/thank-you.html';
                }, 500);
                
            } catch (error) {
                console.error('Lead submission error:', error);
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                alert('Something went wrong. Please try again or email us directly.');
            }
        });
    }
    
    // =====================================================
    // PURCHASE VERIFICATION (on thank-you page)
    // =====================================================
    
    function trackPurchaseIfVerified() {
        // Only run on thank-you page
        if (!window.location.pathname.includes('thank-you')) return;
        
        const checkoutData = localStorage.getItem('yw_checkout_clicked');
        if (!checkoutData) return;
        
        const data = JSON.parse(checkoutData);
        const minutesSinceClick = (Date.now() - data.timestamp) / 60000;
        
        // If they reached thank-you within 15 min of clicking Stripe, count as purchase
        if (minutesSinceClick < 15) {
            gtag('event', 'purchase', {
                'event_category': 'conversion',
                'event_label': data.product,
                'value': data.price,
                'currency': 'USD',
                'transaction_id': data.sessionId
            });
            
            // Clear the stored data
            localStorage.removeItem('yw_checkout_clicked');
            
            console.log('Purchase tracked:', data.product, '$' + data.price);
        }
    }
    
    // =====================================================
    // EXIT INTENT (save abandoning visitors)
    // =====================================================
    
    let exitIntentShown = false;
    
    function initExitIntent() {
        // Only on products page
        if (!window.location.pathname.includes('products')) return;
        
        const handleExitIntent = function(e) {
            if (e.clientY <= 0 && !exitIntentShown) {
                exitIntentShown = true;
                
                // Track exit intent
                gtag('event', 'exit_intent', {
                    'event_category': 'engagement',
                    'event_label': 'products-page-abandon'
                });
                
                // Could show a modal here with discount code
                // For now, just track it
            }
        };
        
        document.addEventListener('mouseleave', handleExitIntent);
    }
    
    // =====================================================
    // INITIALIZE
    // =====================================================
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initStripeTracking();
            initLeadFormTracking();
            trackPurchaseIfVerified();
            initExitIntent();
        });
    } else {
        initStripeTracking();
        initLeadFormTracking();
        trackPurchaseIfVerified();
        initExitIntent();
    }
    
})();
