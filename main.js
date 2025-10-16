// YourWonClaim.com - Conversion Optimization JavaScript

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCountdown();
    initializeTestimonials();
    initializeFAQ();
    initializeLeadForm();
    initializeAnalytics();
    initializeSmoothScrolling();
});

// Countdown Timer for Urgency
function initializeCountdown() {
    const countdownElement = document.getElementById('countdown-timer');
    const countdownDateElement = document.getElementById('countdown-date');
    const currentPriceElement = document.getElementById('current-price');
    const headerCtaElement = document.getElementById('header-cta');
    const heroCtaElement = document.getElementById('hero-cta');
    const purchaseCtaElement = document.getElementById('purchase-cta');
    
    if (!countdownElement || !countdownDateElement) return;
    
    // Calculate next Sunday at 11:59 PM
    function getNextSunday() {
        const now = new Date();
        const daysUntilSunday = (7 - now.getDay()) % 7;
        const nextSunday = new Date(now);
        nextSunday.setDate(now.getDate() + (daysUntilSunday === 0 ? 7 : daysUntilSunday));
        nextSunday.setHours(23, 59, 59, 999);
        return nextSunday;
    }
    
    const targetDate = getNextSunday();
    
    // Format date for display
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    countdownDateElement.textContent = targetDate.toLocaleDateString('en-US', options);
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate.getTime() - now;
        
        if (distance < 0) {
            // Countdown expired - update price and CTAs
            countdownElement.innerHTML = '<span style="color: #dc3545;">EXPIRED - Price increased to $297</span>';
            currentPriceElement.textContent = '$297';
            currentPriceElement.style.color = '#dc3545';
            
            // Update CTA links
            if (headerCtaElement) {
                headerCtaElement.href = '/pages/checkout.html?price=297';
                headerCtaElement.textContent = 'Get the Guide—$297';
                headerCtaElement.setAttribute('aria-label', 'Get the Guide for $297');
            }
            if (heroCtaElement) {
                heroCtaElement.href = '/pages/checkout.html?price=297';
                heroCtaElement.textContent = 'Get the Complete Guide—$297';
                heroCtaElement.setAttribute('aria-label', 'Get the Complete Guide for $297');
            }
            if (purchaseCtaElement) {
                purchaseCtaElement.href = '/pages/checkout.html?price=297';
                purchaseCtaElement.textContent = 'Get The Guide—$297';
                purchaseCtaElement.setAttribute('aria-label', 'Purchase Guide for $297');
            }
            
            return;
        }
        
        // Calculate time components
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Display countdown
        countdownElement.innerHTML = `
            <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
                <div style="text-align: center;">
                    <div style="font-size: 1.5rem; font-weight: bold;">${days}</div>
                    <div style="font-size: 0.8rem;">Days</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 1.5rem; font-weight: bold;">${hours}</div>
                    <div style="font-size: 0.8rem;">Hours</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 1.5rem; font-weight: bold;">${minutes}</div>
                    <div style="font-size: 0.8rem;">Minutes</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 1.5rem; font-weight: bold;">${seconds}</div>
                    <div style="font-size: 0.8rem;">Seconds</div>
                </div>
            </div>
        `;
    }
    
    // Update countdown immediately and then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Testimonials Carousel
function initializeTestimonials() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    if (!slides.length) return;
    
    let currentSlide = 0;
    
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Show current slide
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentSlide = index;
    }
    
    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }
    
    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
    }
    
    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });
    
    // Auto-advance every 7 seconds
    setInterval(nextSlide, 7000);
}

// FAQ Accordion
function initializeFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Close all other FAQ items
            faqQuestions.forEach(q => {
                if (q !== this) {
                    q.setAttribute('aria-expanded', 'false');
                    q.nextElementSibling.classList.remove('active');
                }
            });
            
            // Toggle current FAQ item
            if (isExpanded) {
                this.setAttribute('aria-expanded', 'false');
                answer.classList.remove('active');
            } else {
                this.setAttribute('aria-expanded', 'true');
                answer.classList.add('active');
            }
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
        
        // Basic validation
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
        
        // Simulate form submission (replace with actual endpoint)
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Redirect to thank you page
            window.location.href = '/thank-you.html';
        }, 1000);
    });
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Analytics and Tracking
function initializeAnalytics() {
    // Track CTA clicks
    const ctaButtons = document.querySelectorAll('.cta-btn');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            const buttonLocation = this.closest('section')?.id || 'unknown';
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'purchase_intent', {
                    'event_category': 'engagement',
                    'event_label': buttonText,
                    'custom_parameter_1': buttonLocation
                });
            }
        });
    });
    
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
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Mobile Menu Toggle (if needed)
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            this.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('active');
        });
    }
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Performance Optimization
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        // Initialize non-critical features
        initializeMobileMenu();
    });
} else {
    setTimeout(() => {
        initializeMobileMenu();
    }, 100);
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    
    // Track errors in analytics if needed
    if (typeof gtag !== 'undefined') {
        gtag('event', 'javascript_error', {
            'event_category': 'error',
            'event_label': e.error?.message || 'Unknown error'
        });
    }
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeCountdown,
        initializeTestimonials,
        initializeFAQ,
        initializeLeadForm,
        initializeAnalytics,
        isValidEmail
    };
}
