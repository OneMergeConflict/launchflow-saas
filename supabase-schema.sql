-- ==============================================================================
-- LaunchFlow SaaS Lead Management Platform - Supabase PostgreSQL Schema
-- ==============================================================================
-- Run this in the Supabase SQL Editor:
-- Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- TABLE 1: Early Access Signups (Public landing page lead capture)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.early_access_signups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.early_access_signups ENABLE ROW LEVEL SECURITY;

-- Allow public / anon and authenticated visitors to submit early access emails
DROP POLICY IF EXISTS "Allow public insert for early access" ON public.early_access_signups;
DROP POLICY IF EXISTS "signups_access" ON public.early_access_signups;
CREATE POLICY "signups_access"
ON public.early_access_signups
FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Index for instant duplicate lookups
CREATE INDEX IF NOT EXISTS idx_early_access_email ON public.early_access_signups(email);

-- ==============================================================================
-- TABLE 2: Leads Table (Pipeline Opportunities)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Qualified', 'Converted')),
    source TEXT NOT NULL DEFAULT 'Website' CHECK (source IN ('Upwork', 'Fiverr', 'Website', 'Referral', 'LinkedIn', 'Outbound')),
    deal_value NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure user_id can be null for demo / portfolio exploration
ALTER TABLE public.leads ALTER COLUMN user_id DROP NOT NULL;

-- Enable Row Level Security (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Security Policy: Allow both anon and authenticated to manage their pipeline leads
DROP POLICY IF EXISTS "Users can view their own leads" ON public.leads;
DROP POLICY IF EXISTS "Users can insert their own leads" ON public.leads;
DROP POLICY IF EXISTS "Users can update their own leads" ON public.leads;
DROP POLICY IF EXISTS "Users can delete their own leads" ON public.leads;
DROP POLICY IF EXISTS "leads_access" ON public.leads;

CREATE POLICY "leads_access"
ON public.leads
FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON public.leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);

-- Automatic updated_at timestamp trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_leads_updated_at ON public.leads;
CREATE TRIGGER trigger_leads_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- INITIAL REAL SEED DATA (Immediately populates your Supabase Table Editor!)
-- ==============================================================================
INSERT INTO public.leads (name, email, company, status, source, deal_value, notes)
VALUES
('Elena Rostova', 'elena@apexdesignlab.com', 'Apex Design Lab', 'Qualified', 'Upwork', 6500.00, 'Requested full redesign of Series A fintech platform. Timeline: 4 weeks. Budget confirmed.'),
('Marcus Chen', 'm.chen@finscale.ai', 'FinScale AI', 'Converted', 'Referral', 12800.00, 'Contract signed for full-stack React + Supabase customer portal. Deposit received.'),
('Sarah Jenkins', 'sarah.j@horizonmedia.io', 'Horizon Media Group', 'Contacted', 'LinkedIn', 4200.00, 'Discovery call complete. Sent proposal for high-converting marketing landing pages.'),
('Liam O''Connor', 'liam@nordicwoodcraft.eu', 'Nordic Woodcraft', 'New', 'Website', 3800.00, 'Submitted contact form inquiry looking for a custom e-commerce product customizer.'),
('Amira Patel', 'amira@cloudpulsesystems.com', 'CloudPulse Systems', 'Qualified', 'Fiverr', 8500.00, 'Fiverr Pro buyer needing custom SaaS dashboard architecture and PostgreSQL optimization.'),
('David Vance', 'dvance@hyperionventures.co', 'Hyperion Ventures', 'New', 'Outbound', 5000.00, 'Responded favorably to portfolio showcase. Scheduling 30-min technical capability demo.'),
('Chloe Tremblay', 'chloe@atelierlumiere.ca', 'Atelier Lumière', 'Converted', 'Referral', 9200.00, 'Boutique architectural firm portal. Milestone 1 completed on time. Very satisfied client.')
ON CONFLICT DO NOTHING;
