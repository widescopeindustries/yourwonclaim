/**
 * Simple Lead Capture Handler
 * This script will handle the submission of lead forms for attorney partners.
 * In a real-world scenario, this would send data to a CRM, email service, or webhook.
 */

function handleLeadSubmission(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    console.log('Lead Captured:', data);

    // Show success state
    const form = event.target;
    const successMsg = document.getElementById('lead-success');

    form.classList.add('hidden');
    successMsg.classList.remove('hidden');

    // Track conversion in GA4 if available
    if (typeof gtag === 'function') {
        gtag('event', 'generate_lead', {
            'event_category': 'Partner',
            'event_label': data.keyword || 'VA Attorney Lead'
        });
    }

    // Optional: Send to a real endpoint
    /*
    fetch('https://your-webhook-endpoint.com/leads', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    });
    */
}

document.addEventListener('DOMContentLoaded', () => {
    const leadForm = document.getElementById('lead-capture-form');
    if (leadForm) {
        leadForm.addEventListener('submit', handleLeadSubmission);
    }
});
