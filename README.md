# SHAHEEN — Jarvis AI System
### Phase 1: Core Dashboard

---

## Overview

Jarvis is a full-stack AI property automation dashboard built for **SHAHEEN** (swahdan3461@gmail.com).

This is **Phase 1** of the complete Jarvis system — the core foundation.

---

## What's Included in Phase 1

| Module | Description |
|---|---|
| **Dashboard** | Stats overview, lead pipeline chart, recent activity, pending approval alerts, quick actions |
| **Property Leads** | Add and manage leads from Zillow, Airbnb, and Realtor. Search, filter by platform/status, update lead status through the full pipeline |
| **Email Workflow** | Compose outreach emails with 4 pre-built templates. Link to leads, save drafts, send, track replies |
| **Approval System** | Review all pending actions (outreach, payments, video delivery). Approve or reject with notes. Full history |
| **Activity Log** | Full timeline of all system events filtered by type |
| **Settings** | Configure Jarvis name, platform toggles, notification channels, email settings, PayPal email, API keys |
| **Jarvis AI Chat** | Floating AI assistant that answers questions about your leads, emails, approvals, and system status |

---

## Getting Started

### Run in Development
```bash
npm run dev
```
Then open: **http://localhost:3000**

### Build for Production
```bash
npm run build
npm run start
```

---

## Project Structure

```
jarvis/
├── app/
│   ├── dashboard/     → Main dashboard page
│   ├── leads/         → Property lead management
│   ├── emails/        → Email workflow & outreach
│   ├── approvals/     → Approval management
│   ├── activity/      → Activity timeline
│   ├── settings/      → System settings
│   ├── layout.tsx     → Root layout (sidebar + header + chat widget)
│   └── globals.css    → Black/gold theme
├── components/
│   ├── Sidebar.tsx    → Navigation sidebar with SW logo
│   ├── Header.tsx     → Top header bar
│   └── JarvisChat.tsx → Floating AI chat widget
└── lib/
    └── store.tsx      → Global state management (leads, emails, approvals, activity)
```

---

## Phase Roadmap

| Phase | Milestone | Status |
|---|---|---|
| **Phase 1** | Core Dashboard + Leads + Email + Approvals | ✅ Complete |
| **Phase 2** | Live Scraping (Zillow/Airbnb/Realtor) + AI Phone Calls (Twilio) + SMS | ⏳ Pending |
| **Phase 3** | PayPal Payment Automation + AI Video Generation + Auto Delivery | ⏳ Pending |
| **Phase 4** | Integration Testing + Deployment + n8n Automation | ⏳ Pending |

---

## Branding
- **Client:** Shahd Wahdan
- **Jarvis Name:** SHAHEEN
- **Email:** swahdan3461@gmail.com
- **Target Market:** United States
- **Platforms:** Zillow · Airbnb · Realtor
- **Payments:** PayPal
