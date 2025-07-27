// Lead Form Handler
document.getElementById('lead-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        address: formData.get('address'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        source: 'home-seller-landing',
        timestamp: new Date().toISOString(),
        url: window.location.href,
        referrer: document.referrer
    };
    
    // Show loading state
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Processing...';
    submitButton.disabled = true;
    
    try {
        // Send to webhook endpoint
        const response = await fetch('/api/leads', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            // Redirect to thank you page
            window.location.href = '/thank-you?email=' + encodeURIComponent(data.email);
        } else {
            throw new Error('Submission failed');
        }
    } catch (error) {
        // Fallback: Send to Zapier webhook directly
        try {
            await fetch('https://hooks.zapier.com/hooks/catch/YOUR_ZAPIER_WEBHOOK/', {
                method: 'POST',
                body: JSON.stringify(data)
            });
            window.location.href = '/thank-you?email=' + encodeURIComponent(data.email);
        } catch (fallbackError) {
            alert('Sorry, there was an error. Please try again or call us directly.');
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }
});

// Track page engagement
let engagementTime = 0;
let isEngaged = true;

setInterval(() => {
    if (isEngaged) {
        engagementTime += 1;
        
        // Fire engagement event after 30 seconds
        if (engagementTime === 30) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'engaged_30s', {
                    'event_category': 'engagement',
                    'event_label': 'home-seller-landing'
                });
            }
        }
    }
}, 1000);

// Track if user is actively engaged
document.addEventListener('visibilitychange', () => {
    isEngaged = !document.hidden;
});

// Exit intent popup (optional)
let exitIntentShown = false;
document.addEventListener('mouseleave', (e) => {
    if (e.clientY < 10 && !exitIntentShown) {
        exitIntentShown = true;
        // Could trigger a modal or special offer here
        console.log('Exit intent detected');
    }
});

// Phone number formatting
document.querySelector('input[name="phone"]').addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 6) {
        value = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6, 10);
    } else if (value.length >= 3) {
        value = value.slice(0, 3) + '-' + value.slice(3);
    }
    e.target.value = value;
});