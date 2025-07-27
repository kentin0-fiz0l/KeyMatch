# KeyMatch Zapier Automation Setup

## Core Automation Workflow

### 1. Lead Capture → CRM → Email Sequence

**Trigger:** Webhooks by Zapier - Catch Hook
- This receives leads from your landing page

**Action 1:** Airtable - Create Record
- Base: KeyMatch Leads
- Table: Leads
- Fields to map:
  - Address
  - Email
  - Phone
  - Source
  - Timestamp
  - Status: "New"

**Action 2:** SendGrid - Send Email (or Gmail)
- To: Lead email
- Template: Welcome email
- Subject: "Your Home Value Report is Being Prepared 🏠"

**Action 3:** Delay by Zapier
- Delay: 15 minutes

**Action 4:** SendGrid - Send Email
- To: Lead email
- Template: Home value report
- Include personalized data

**Action 5:** Slack - Send Channel Message (optional)
- Message: "🎯 New lead: [Name] at [Address]"

---

### 2. Lead Scoring & Agent Matching

**Trigger:** Airtable - New Record in View
- View: "Qualified Leads" (Status = Qualified)

**Action 1:** Code by Zapier - Run JavaScript
```javascript
// Lead scoring algorithm
const timeline = inputData.timeline;
const propertyValue = inputData.propertyValue;
const motivation = inputData.motivation;

let score = 0;

// Timeline scoring
if (timeline === "ASAP") score += 40;
else if (timeline === "1-3 months") score += 30;
else if (timeline === "3-6 months") score += 20;
else score += 10;

// Property value scoring
if (propertyValue > 500000) score += 30;
else if (propertyValue > 300000) score += 20;
else score += 10;

// Motivation scoring
if (motivation.includes("job relocation")) score += 20;
if (motivation.includes("divorce")) score += 20;
if (motivation.includes("downsizing")) score += 15;

return { leadScore: score };
```

**Action 2:** Airtable - Find Records
- Search agents by:
  - Location match
  - Specialty match
  - Availability = true

**Action 3:** Airtable - Update Record
- Update lead with:
  - Assigned Agent
  - Lead Score
  - Status: "Assigned"

**Action 4:** Gmail - Send Email to Agent
- Subject: "New Lead: [Address] - Score: [Score]/100"
- Include lead details

---

### 3. Follow-Up Automation

**Trigger:** Schedule by Zapier
- Every day at 9 AM

**Action 1:** Airtable - Find Records
- Filter: Last Contact > 3 days ago
- Status: Not "Closed"

**Action 2:** Looping by Zapier
- For each lead found

**Action 3:** SendGrid - Send Email
- Dynamic template based on:
  - Days since signup
  - Lead status
  - Previous interactions

---

### 4. Commission Tracking

**Trigger:** Airtable - Record Updated
- When Status changes to "Closed Won"

**Action 1:** Calculator by Zapier
- Calculate commission: Sale Price × 2.5% × 0.30

**Action 2:** QuickBooks - Create Invoice
- Bill to: Agent
- Amount: Referral fee
- Due date: +30 days

**Action 3:** Airtable - Create Commission Record
- Log all details for tracking

---

## Initial Zapier Setup Steps

1. **Create Zapier Account**
   - Sign up at zapier.com
   - Start with free plan (100 tasks/month)

2. **Create First Zap**
   - Name: "KeyMatch Lead Capture"
   - Copy webhook URL for your landing page

3. **Connect Apps**
   - Airtable (create free account)
   - Email service (SendGrid/Gmail)
   - Slack (optional)

4. **Set Up Airtable Base**
   - Create "KeyMatch" base
   - Tables needed:
     - Leads
     - Agents
     - Commissions
     - Email Log

5. **Test Your Workflow**
   - Submit test lead on landing page
   - Verify data flows through each step
   - Check email delivery

---

## Airtable Schema

### Leads Table
- Address (Text)
- Email (Email)
- Phone (Phone)
- Source (Single Select)
- Timeline (Single Select)
- Status (Single Select): New, Qualified, Assigned, Closed Won, Closed Lost
- Lead Score (Number)
- Assigned Agent (Link to Agents)
- Notes (Long Text)
- Created (Date)
- Last Contact (Date)

### Agents Table
- Name (Text)
- Email (Email)
- Phone (Phone)
- Specialties (Multiple Select)
- Service Areas (Multiple Select)
- Commission Rate (Percent)
- Active (Checkbox)
- Rating (Rating)
- Deals Closed (Count)

### Commissions Table
- Lead (Link to Leads)
- Agent (Link to Agents)
- Sale Price (Currency)
- Commission Due (Currency)
- Status (Single Select): Pending, Invoiced, Paid
- Closed Date (Date)
- Paid Date (Date)

---

## Pro Tips

1. **Use Paths in Zapier** for different lead types
2. **Set up error handling** with email alerts
3. **Use Zapier's built-in Lead Score** app
4. **Create separate Zaps** for different landing pages
5. **Monitor task usage** to avoid overages

---

## Estimated Zapier Costs

- **Starter Plan**: $19.99/month (750 tasks)
- **Professional**: $49/month (2,000 tasks)

At ~20 leads/week with full automation:
- ~400 tasks/month
- Starter plan is sufficient initially