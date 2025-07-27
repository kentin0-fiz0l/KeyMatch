const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from landing pages
app.use(express.static(path.join(__dirname, 'landing-pages/home-seller')));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Lead capture endpoint
app.post('/api/leads', async (req, res) => {
    try {
        const lead = {
            ...req.body,
            ip: req.ip,
            userAgent: req.get('user-agent'),
            timestamp: new Date().toISOString()
        };

        console.log('New lead received:', lead);

        // Send to Zapier webhook
        if (process.env.ZAPIER_WEBHOOK_URL) {
            const zapierResponse = await fetch(process.env.ZAPIER_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(lead)
            });

            if (!zapierResponse.ok) {
                throw new Error('Zapier webhook failed');
            }
        }

        // Send to Airtable (if configured)
        if (process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID) {
            const airtableResponse = await fetch(
                `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Leads`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        fields: {
                            'Address': lead.address,
                            'Email': lead.email,
                            'Phone': lead.phone,
                            'Source': lead.source,
                            'Timestamp': lead.timestamp,
                            'Status': 'New'
                        }
                    })
                }
            );

            if (!airtableResponse.ok) {
                console.error('Airtable error:', await airtableResponse.text());
            }
        }

        // Send welcome email via SendGrid (if configured)
        if (process.env.SENDGRID_API_KEY) {
            const sgMail = require('@sendgrid/mail');
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);

            const msg = {
                to: lead.email,
                from: process.env.FROM_EMAIL || 'hello@keymatch.com',
                subject: 'Your Home Value Report is Being Prepared 🏠',
                text: `Hi! Thanks for requesting your home value report. We're analyzing your property and will send your personalized report within 15 minutes.`,
                html: `<p>Hi!</p><p>Thanks for requesting your home value report for ${lead.address}.</p><p>We're analyzing your property and will send your personalized report within 15 minutes.</p><p>Best,<br>The KeyMatch Team</p>`
            };

            try {
                await sgMail.send(msg);
            } catch (error) {
                console.error('SendGrid error:', error);
            }
        }

        res.json({ 
            success: true, 
            message: 'Lead captured successfully',
            leadId: Date.now().toString()
        });

    } catch (error) {
        console.error('Lead capture error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error processing lead' 
        });
    }
});

// Webhook endpoint for Zapier/integrations
app.post('/webhooks/:source', (req, res) => {
    console.log(`Webhook received from ${req.params.source}:`, req.body);
    res.json({ received: true });
});

// Catch-all route for single page app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'landing-pages/home-seller/index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`KeyMatch server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});