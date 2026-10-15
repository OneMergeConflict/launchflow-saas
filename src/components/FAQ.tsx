import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How is LaunchFlow different from enterprise CRMs like HubSpot or Salesforce?',
      a: 'Enterprise CRMs are built for hundreds of corporate sales reps with bloated custom objects, complex lead scoring algorithms, and slow page loads. LaunchFlow was designed specifically for freelancers, consultants, and boutique studios who need a lightning-fast, four-stage pipeline without spending hours configuring software.',
    },
    {
      q: 'How does Supabase Row Level Security (RLS) protect my client information?',
      a: 'Supabase enforces database-level tenant isolation through PostgreSQL Row Level Security. Every single query is cryptographically verified against the authenticated user\'s token (auth.uid() = user_id). Even if another user makes an API request, Postgres physically refuses to return records that do not belong to them.',
    },
    {
      q: 'Can I connect my own Supabase project database?',
      a: 'Yes! LaunchFlow includes a built-in Supabase Configuration modal where you can supply your own VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, or run our automated PostgreSQL migration script (supabase-schema.sql). The app will instantly switch from sandbox mode to your live Postgres database.',
    },
    {
      q: 'Can I export my leads and customer records at any time?',
      a: 'Absolutely. You maintain complete ownership of your data. The dashboard features a one-click "Export CSV" button that generates a standard, RFC-compliant CSV containing all lead names, emails, companies, statuses, acquisition channels, deal values, and notes.',
    },
    {
      q: 'What lead sources are supported out of the box?',
      a: 'LaunchFlow includes dedicated tracking for Upwork, Fiverr, Website contact forms, Direct Referrals, LinkedIn inbounds, and Outbound prospecting. You can filter and analyze conversion rates across each channel to see where your most lucrative contracts originate.',
    },
    {
      q: 'Can I test and explore the full authenticated application immediately?',
      a: 'Yes! We have implemented a 1-Click Instant Demo mode. In the sign-in modal, click "Try Instant Demo Mode" to immediately launch into a fully pre-populated freelance pipeline with live metrics, search, filtering, and lead manipulation without needing to create an account or verify email.',
    },
  ];

  return (
    <section id="faq" style={{ padding: '6rem 0', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
      <div className="container-narrow">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#4f46e5',
              backgroundColor: '#eef2ff',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              marginBottom: '1rem',
            }}
          >
            <HelpCircle size={14} /> Clear Answers
          </div>
          <h2
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#0f172a',
              lineHeight: 1.2,
              marginBottom: '1rem',
            }}
          >
            Frequently Asked Questions
          </h2>
          <p style={{ fontSize: '1.0625rem', color: '#64748b' }}>
            Everything you need to know about LaunchFlow, our data security model, and how to get started.
          </p>
        </div>

        {/* Accordion List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid',
                  borderColor: isOpen ? '#cbd5e1' : '#e2e8f0',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: isOpen ? 'var(--shadow-sm)' : 'none',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                  aria-expanded={isOpen}
                >
                  <span style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#0f172a' }}>
                    {faq.q}
                  </span>
                  <div
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      color: isOpen ? '#4f46e5' : '#94a3b8',
                      flexShrink: 0,
                    }}
                  >
                    <ChevronDown size={20} />
                  </div>
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: '0 1.5rem 1.35rem 1.5rem',
                      fontSize: '0.9375rem',
                      lineHeight: 1.65,
                      color: '#475569',
                      borderTop: '1px solid #f1f5f9',
                      paddingTop: '1rem',
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
