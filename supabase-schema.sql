-- ==============================================================================
-- LaunchFlow SaaS Lead Management Platform - Supabase PostgreSQL Schema
-- ==============================================================================
-- Designed with Row Level Security (RLS) least-privilege principles.
-- Run this in the Supabase SQL Editor: Dashboard -> SQL Editor -> New Query.
-- ==============================================================================

-- 1. Enable pgcrypto for UUID generation if not already active
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

-- Security Policy: Allow public / anonymous visitors to submit an email
DROP POLICY IF EXISTS "Allow public insert for early access" ON public.early_access_signups;
CREATE POLICY "Allow public insert for early access"
ON public.early_access_signups
FOR INSERT
TO anon, authenticated
WITH CHECK (
    email IS NOT NULL AND 
    length(email) > 5 AND 
    position('@' in email) > 1
);

-- Security Policy: Deny public reading of early access emails (Service role only)
DROP POLICY IF EXISTS "Disallow public select for early access" ON public.early_access_signups;
-- (By default in Supabase RLS, without a SELECT policy, non-service-role queries cannot view rows)

-- Create index on email for quick duplicate lookups
CREATE INDEX IF NOT EXISTS idx_early_access_email ON public.early_access_signups(email);

-- ==============================================================================
-- TABLE 2: Leads Table (Authenticated Freelancers / Agency Owners)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Enable Row Level Security (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- RLS POLICIES FOR LEADS (Strict Tenant Isolation)
-- Each authenticated user can ONLY access and modify their own leads.
-- ------------------------------------------------------------------------------

-- SELECT: Users can only see their own leads
DROP POLICY IF EXISTS "Users can view their own leads" ON public.leads;
CREATE POLICY "Users can view their own leads"
ON public.leads
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- INSERT: Users can only insert leads with their own user_id
DROP POLICY IF EXISTS "Users can insert their own leads" ON public.leads;
CREATE POLICY "Users can insert their own leads"
ON public.leads
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can only update their own leads
DROP POLICY IF EXISTS "Users can update their own leads" ON public.leads;
CREATE POLICY "Users can update their own leads"
ON public.leads
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can only delete their own leads
DROP POLICY IF EXISTS "Users can delete their own leads" ON public.leads;
CREATE POLICY "Users can delete their own leads"
ON public.leads
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- Performance Indexes & Triggers
-- ------------------------------------------------------------------------------
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

-- Comment for documentation
COMMENT ON TABLE public.leads IS 'LaunchFlow pipeline leads scoped to authenticated user_id';
COMMENT ON TABLE public.early_access_signups IS 'Public early access VIP waitlist signups';
