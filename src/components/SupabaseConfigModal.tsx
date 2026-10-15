import React, { useState } from 'react';
import { X, Database, ShieldAlert, CheckCircle2, Copy, Check, ExternalLink, RefreshCw, KeyRound, AlertTriangle } from 'lucide-react';
import { getSupabaseConfig, saveSupabaseConfig, getSupabaseClient } from '../lib/supabase';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChanged: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
  onConfigChanged,
}) => {
  const currentConfig = getSupabaseConfig();
  const [url, setUrl] = useState(currentConfig.url);
  const [anonKey, setAnonKey] = useState(currentConfig.anonKey);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    // Safeguard against service_role key
    if (anonKey.toLowerCase().includes('service_role')) {
      setTesting(false);
      setTestResult({
        success: false,
        message: 'Security Alert: You entered a service_role key! Never expose secret keys in client-side code. Use only your public "anon" key.',
      });
      return;
    }

    if (!url || !url.startsWith('https://')) {
      setTesting(false);
      setTestResult({
        success: false,
        message: 'Project URL must begin with https:// (e.g. https://your-id.supabase.co)',
      });
      return;
    }

    try {
      // Temporarily save to test
      saveSupabaseConfig(url, anonKey);
      const client = getSupabaseClient();
      if (!client) {
        throw new Error('Failed to create Supabase client.');
      }

      // Check if table exists or fetch public count
      const { error } = await client.from('early_access_signups').select('id', { count: 'exact', head: true });
      if (error && error.code !== 'PGRST116') {
        // Table might not exist yet, but connection succeeded
        if (error.message.includes('relation') || error.message.includes('does not exist')) {
          setTestResult({
            success: true,
            message: 'Supabase credentials verified! Please run the schema SQL below in your Supabase SQL Editor to create tables.',
          });
        } else {
          setTestResult({
            success: false,
            message: `Connection failed: ${error.message}`,
          });
        }
      } else {
        setTestResult({
          success: true,
          message: 'Connection successful! Supabase PostgreSQL database is connected and ready.',
        });
      }
      onConfigChanged();
    } catch (err) {
      setTestResult({
        success: false,
        message: err instanceof Error ? err.message : 'Connection test failed',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    try {
      saveSupabaseConfig(url, anonKey);
      onConfigChanged();
      onClose();
    } catch (err) {
      setTestResult({
        success: false,
        message: err instanceof Error ? err.message : 'Save failed',
      });
    }
  };

  const handleReset = () => {
    saveSupabaseConfig('', '');
    setUrl('');
    setAnonKey('');
    setTestResult({
      success: true,
      message: 'Reset to local browser sandbox mode.',
    });
    onConfigChanged();
  };

  const handleCopySqlInstructions = () => {
    const text = `-- Run this in Supabase SQL Editor
CREATE TABLE IF NOT EXISTS public.early_access_signups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.early_access_signups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert" ON public.early_access_signups FOR INSERT TO anon, authenticated WITH CHECK (true);

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
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own leads" ON public.leads FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);`;

    navigator.clipboard.writeText(text);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div
              style={{
                width: '2rem',
                height: '2rem',
                borderRadius: '8px',
                backgroundColor: '#ecfdf5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#047857',
              }}
            >
              <Database size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#0f172a' }}>
                Supabase PostgreSQL Database Configuration
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Connect your live Supabase project or toggle local sandbox mode
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Security alert box */}
          <div
            style={{
              padding: '0.875rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#fffbeb',
              border: '1px solid #fde68a',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-start',
              fontSize: '0.8125rem',
              color: '#92400e',
            }}
          >
            <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Security Rule:</strong> Only use your <strong>public anon key</strong> here. Never supply secret or <code>service_role</code> keys. Row Level Security guarantees data isolation between different users.
            </div>
          </div>

          {/* Test results banner */}
          {testResult && (
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: testResult.success ? '#ecfdf5' : '#fef2f2',
                border: `1px solid ${testResult.success ? '#a7f3d0' : '#fecaca'}`,
                color: testResult.success ? '#065f46' : '#b91c1c',
                fontSize: '0.84375rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              {testResult.success ? <CheckCircle2 size={16} /> : <ShieldAlert size={16} />}
              <span>{testResult.message}</span>
            </div>
          )}

          {/* URL Input */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">
              <span>Project URL (VITE_SUPABASE_URL)</span>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: '0.75rem', color: '#4f46e5', display: 'flex', alignItems: 'center', gap: '2px' }}
              >
                Find in Supabase Settings <ExternalLink size={12} />
              </a>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="https://xyzabcdefghijklm.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          {/* Anon Key Input */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Public Anonymous Key (VITE_SUPABASE_ANON_KEY)</label>
            <input
              type="password"
              className="form-input"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
            />
          </div>

          {/* Quick SQL Schema Snippet Box */}
          <div
            style={{
              marginTop: '0.5rem',
              backgroundColor: '#0f172a',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              color: '#e2e8f0',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Required Supabase Schema (RLS Enabled)
              </span>
              <button
                type="button"
                onClick={handleCopySqlInstructions}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.71875rem',
                  padding: '0.2rem 0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {copiedSql ? <Check size={12} color="#34d399" /> : <Copy size={12} />}
                <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL Script'}</span>
              </button>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.5 }}>
              A full, production-ready script is also provided at <code style={{ color: '#818cf8' }}>supabase-schema.sql</code> in the project root. Paste it into your Supabase SQL editor to create the leads & early-access tables.
            </div>
          </div>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <button type="button" onClick={handleReset} className="btn btn-outline btn-sm" style={{ color: '#64748b' }}>
            <RefreshCw size={14} />
            <span>Reset to Local Sandbox</span>
          </button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              disabled={testing || !url}
              onClick={handleTestConnection}
              className="btn btn-outline btn-sm"
            >
              {testing ? 'Testing...' : 'Test Connection'}
            </button>
            <button type="button" onClick={handleSave} className="btn btn-primary btn-sm">
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
