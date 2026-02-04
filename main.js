// YourWonClaim.com - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeFAQ();
    initializeLeadForm();
    initializeAnalytics();
    initializeSmoothScrolling();
});

// FAQ Accordion - works with <details> elements
function initializeFAQ() {
    document.querySelectorAll('details summary').forEach(summary => {
        summary.addEventListener('click', function() {
            const details = this.parentElement;
            // Close all other details
            document.querySelectorAll('details').forEach(d => {
                if (d !== details && d.open) d.open = false;
            });
        });
    });
}

// Lead Form Handling
function initializeLeadForm() {
    const leadForm = document.getElementById('lead-form');
    if (!leadForm) return;

    leadForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');

        if (!name || !email) {
            alert('Please fill in all fields.');
            return;
        }

        if (!isValidEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // Track lead generation
        if (typeof gtag !== 'undefined') {
            gtag('event', 'lead_generation', {
                'event_category': 'engagement',
                'event_label': 'free_checklist',
                'value': 0
            });
        }

        const submitBtn = this.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;

        setTimeout(() => {
            window.location.href = '/thank-you.html';
        }, 1000);
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Analytics and Tracking
function initializeAnalytics() {
    // Track scroll depth
    let maxScroll = 0;
    const scrollThresholds = [25, 50, 75, 90];
    let triggeredThresholds = [];

    window.addEventListener('scroll', function() {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);

        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;

            scrollThresholds.forEach(threshold => {
                if (scrollPercent >= threshold && !triggeredThresholds.includes(threshold)) {
                    triggeredThresholds.push(threshold);
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'scroll_depth', {
                            'event_category': 'engagement',
                            'event_label': `${threshold}%`,
                            'value': threshold
                        });
                    }
                }
            });
        }
    });

    // Track time on page
    const startTime = Date.now();
    window.addEventListener('beforeunload', function() {
        const timeOnPage = Math.round((Date.now() - startTime) / 1000);
        if (typeof gtag !== 'undefined') {
            gtag('event', 'time_on_page', {
                'event_category': 'engagement',
                'event_label': 'seconds',
                'value': timeOnPage
            });
        }
    });
}

// Smooth Scrolling for Anchor Links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            if (!targetId) return;
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                e.preventDefault();
                const nav = document.querySelector('nav');
                const headerHeight = nav ? nav.offsetHeight : 80;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Error Handling
window.addEventListener('error', function(e) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'javascript_error', {
            'event_category': 'error',
            'event_label': e.error?.message || 'Unknown error'
        });
    }
});
