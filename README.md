# LaunchFlow — Premium SaaS Lead-Management Platform

> **Turn Every Lead Into Your Next Opportunity.**  
> Built for freelancers, independent consultants, and boutique agencies to capture inbounds, track proposal stages, and forecast revenue with complete clarity.

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20RLS-3ECF8E?logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🌟 Executive Summary

Traditional enterprise CRMs like HubSpot and Salesforce are bloated with complex enterprise workflows, multi-tiered permission structures, and slow interfaces. Meanwhile, tracking clients in spreadsheets causes missed discovery calls, untracked proposal follow-ups, and lost revenue.

**LaunchFlow** is a modern, high-velocity SaaS lead-management platform crafted specifically for service businesses:
- **Instant Inbound Capture:** Attribute leads by source (Upwork, Fiverr, Portfolio Website, Referrals, LinkedIn, Outbound).
- **4-Stage Pipeline Velocity:** Standardized workflow (`New Inbound` → `Contacted` → `Qualified` → `Converted Won`).
- **Dynamic Cash Flow Forecasting:** Pipeline metrics, active deal counts, and conversion percentages calculated in real-time from active records.
- **Enterprise-Grade Tenant Security:** Direct PostgreSQL integration via Supabase with strict **Row Level Security (RLS)** policies. Each user can strictly only read and write their own data.
- **1-Click Portfolio Demo Mode:** Evaluators and prospective clients can test the complete authenticated CRM without creating an account or supplying credentials.

---

## 🚀 Key Features

### 1. High-Converting Public Landing Page
- **Hero Showcase:** Headline *"Turn Every Lead Into Your Next Opportunity"* with an interactive live dashboard preview.
- **Interactive Mini-Dashboard:** Prospects can click status tabs and simulate winning deals directly on the marketing page.
- **Visual 4-Stage Workflow:** Explains how freelancers move from cold inbound to signed contract.
- **Illustrative Pricing:** Transparent Starter ($0), Professional ($24/mo), and Agency ($59/mo) plans with monthly/annual toggle (20% discount badge).
- **Interactive FAQ:** Addresses CRM differentiation, Supabase security, CSV exports, and data ownership.
- **VIP Early-Access Form:** Validates visitor emails and writes safely to Supabase PostgreSQL with duplicate detection.

### 2. Authenticated CRM Pipeline Application
- **Protected Workspace:** Complete registration, login, session persistence, and instant demo login.
- **Real-Time KPI Cards:**
  - *Total Pipeline Value* ($)
  - *Active Leads* Count
  - *Proposals in Flight* Count
  - *Won Conversion Rate* (%)
- **Full CRUD Management:** Add, edit, search, filter, and permanently delete client records.
- **One-Click In-Row Status Updates:** Advance stages right inside the table row.
- **Confetti Micro-Delight:** Tasteful celebration burst whenever a lead reaches the "Converted" stage.
- **Multi-Parameter Search & Sort:** Real-time search across names, companies, emails, and notes. Sort by date, value, or alphabetical order.
- **RFC-Compliant CSV Export:** Export client records for spreadsheet backup and tax accounting.

### 3. Database Architecture & Row Level Security
- **Strict Tenant Isolation:** Every lead is associated with `auth.uid() = user_id`.
- **Zero Frontend Secret Exposure:** Only public anonymous keys (`anon`) are used in client code.
- **Public Early-Access Ingestion:** Public visitors can insert an email into `early_access_signups` without having read access to other subscribers' emails.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19 (TypeScript) |
| **Bundler & Tooling** | Vite 6 |
| **Styling & UI System** | Vanilla CSS Design System with custom design tokens, dark navy surfaces, and glassmorphism |
| **Database & Auth** | Supabase (PostgreSQL with Row Level Security) |
| **Icons** | Lucide React |
| **Celebration Effects** | Canvas Confetti |
| **Deployment Target** | Vercel & GitHub |

---

## 📦 Getting Started Locally

### 1. Prerequisites
- Node.js (v18.0.0 or higher)
- npm or pnpm

### 2. Clone and Install
```bash
git clone https://github.com/your-username/launchflow.git
cd launchflow
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your Supabase project credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
*(Note: If left empty, LaunchFlow will seamlessly run in browser sandbox mode with realistic seed data!)*

### 4. Run the Dev Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🗄️ Supabase PostgreSQL Setup

To connect LaunchFlow to your real Supabase database:

1. Create a free project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** tab in the Supabase Dashboard.
3. Paste and run the contents of [`supabase-schema.sql`](./supabase-schema.sql).
4. Copy your **Project URL** and **anon public key** from *Project Settings → API*.
5. Paste them into your `.env` file or click **Database Config** inside the LaunchFlow navigation bar.

---

## 🚢 Vercel Deployment

LaunchFlow is configured for instant Vercel deployment:
1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete LaunchFlow SaaS platform"
   git remote add origin https://github.com/your-username/launchflow.git
   git push -u origin main
   ```
2. Import the repository in [vercel.com](https://vercel.com).
3. Add the environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy! The included `vercel.json` ensures client-side routing works cleanly across all paths.

---

## 💼 Upwork & Fiverr Portfolio Note
This application was architected to demonstrate full-stack SaaS mastery:
- Strict software design principles, TypeScript typings, and component encapsulation.
- Production-ready PostgreSQL schema with RLS security policies.
- Polished, responsive user experience without generic templates or bloated utility libraries.
- Zero-downtime offline demo capabilities for prospective client evaluation.
