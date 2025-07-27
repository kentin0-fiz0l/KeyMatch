# KeyMatch Project Structure Guide

## Directory Overview

### `/docs/`
- **Business Plan** - Core strategy and financial projections
- **Technical Docs** - API integrations, automation workflows
- **Process Docs** - SOPs for daily operations
- **Meeting Notes** - Agent feedback, strategy sessions

### `/scripts/`
Automation scripts for various tasks:
- `lead-scraper.py` - Extract FSBOs from Zillow/Craigslist
- `agent-matcher.js` - Algorithm for lead-agent pairing
- `email-sender.py` - Bulk email campaigns
- `analytics-dashboard.py` - Generate performance reports

### `/landing-pages/`
Different landing page variants for A/B testing:
- `home-seller/` - "What's your home worth?"
- `fsbo/` - "Get multiple cash offers"
- `expired/` - "Your listing expired, now what?"
- `investor/` - "Find off-market deals"

### `/automation/`
Zapier/Make.com workflow exports:
- `lead-capture-flow.json` - Form → CRM → Email sequence
- `agent-notification.json` - New lead → Agent alert
- `follow-up-sequence.json` - Automated nurture campaigns
- `commission-tracking.json` - Deal closed → Invoice

### `/marketing/`

#### `/ads/`
- Facebook ad creatives and copy
- Google Ads campaigns
- Retargeting pixel code
- A/B test results

#### `/content/`
- SEO blog posts (AI-generated)
- Market reports by city
- Email newsletter content
- Social media posts

#### `/email-templates/`
- `leads/` - Buyer/seller sequences
- `agents/` - Partner recruitment
- `nurture/` - Long-term follow-up
- `transactions/` - Deal milestone emails

### `/data/`
- Lead database exports
- Agent performance metrics
- Market research data
- Conversion analytics

### `/legal/`
- Referral agreement templates
- Privacy policy
- Terms of service
- State compliance docs
- Insurance policies

### `/analytics/`
- Monthly P&L statements
- Lead source ROI reports
- Agent performance dashboards
- Conversion funnel analytics

## Best Practices

1. **Version Control**: Use Git to track all changes
2. **Naming Convention**: Use lowercase with hyphens (e.g., `lead-capture-v2.html`)
3. **Documentation**: Add README files in each major directory
4. **Backups**: Weekly backups of `/data/` and `/legal/`
5. **Security**: Never commit API keys or passwords

## Next Steps

1. Initialize Git repository: `git init`
2. Create `.env` file for environment variables
3. Set up first landing page in `/landing-pages/home-seller/`
4. Configure automation workflows
5. Start collecting leads!