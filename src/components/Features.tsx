import React from 'react';
import { 
  Inbox, 
  GitBranch, 
  TrendingUp, 
  BarChart3, 
  FileText, 
  ShieldCheck, 
  Zap, 
  ArrowRight 
} from 'lucide-react';

export const Features: React.FC = () => {
  const featureList = [
    {
      icon: <Inbox size={24} color="#4f46e5" />,
      tag: 'Capture',
      title: 'Unified Multi-Channel Ingestion',
      description:
        'Aggregate client inquiries seamlessly across Upwork, Fiverr, personal portfolio forms, LinkedIn inbounds, and direct referrals in one single, organized cockpit.',
      benefit: 'Never lose a high-budget client in email threads.',
    },
    {
      icon: <GitBranch size={24} color="#7c3aed" />,
      tag: 'Pipeline',
      title: 'Four-Stage Velocity Tracking',
      description:
        'Categorize every conversation into crystal-clear operational states: New Inbound, Contacted (Discovery), Qualified (Proposal Sent), and Converted (Won).',
      benefit: 'Immediate clarity on where every prospect stands.',
    },
    {
      icon: <TrendingUp size={24} color="#0ea5e9" />,
      tag: 'Revenue',
      title: 'Real-Time Deal Value Forecasting',
      description:
        'Attach estimated project budgets to every lead. LaunchFlow dynamically tallies your total active pipeline value and weighted expected revenue.',
      benefit: 'Predict monthly freelancer cash flow accurately.',
    },
    {
      icon: <BarChart3 size={24} color="#10b981" />,
      tag: 'Analytics',
      title: 'Conversion Rate & Win Intelligence',
      description:
        'Know your true close rates. LaunchFlow calculates win percentages, average deal size, and source performance directly from your real stored database records.',
      benefit: 'Focus your time on your highest-converting channels.',
    },
    {
      icon: <FileText size={24} color="#f59e0b" />,
      tag: 'Context',
      title: 'Client Interaction Notes & Scoping',
      description:
        'Keep project scopes, deadline constraints, and key client preferences right alongside their contact info. No separate notebook or disorganized Notion docs needed.',
      benefit: 'Deliver confident, tailored discovery calls.',
    },
    {
      icon: <ShieldCheck size={24} color="#6366f1" />,
      tag: 'Security',
      title: 'Supabase PostgreSQL & Row Level Security',
      description:
        'Enterprise-grade database isolation powered by Supabase. Strict RLS policies guarantee only you can ever query, edit, or view your client data.',
      benefit: 'Your client relationships remain 100% private.',
    },
  ];

  return (
    <section id="features" style={{ padding: '6rem 0', backgroundColor: '#ffffff', position: 'relative' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ maxWidth: '720px', margin: '0 auto 4rem auto', textAlign: 'center' }}>
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
            <Zap size={14} /> Purpose-Built for Freelancers
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
            Everything you need to turn inquiries into signed contracts.
          </h2>
          <p style={{ fontSize: '1.0625rem', color: '#64748b', lineHeight: 1.6 }}>
            Traditional enterprise CRMs are bloated with enterprise junk. Spreadsheets are fragile and manual.
            LaunchFlow is the sleek, high-speed sweet spot built specifically for modern service professionals.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-3 gap-6">
          {featureList.map((feature, idx) => (
            <div
              key={idx}
              className="card card-hover"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '2rem',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.25rem',
                  }}
                >
                  <div
                    style={{
                      width: '3rem',
                      height: '3rem',
                      borderRadius: '12px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {feature.icon}
                  </div>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: '#64748b',
                      backgroundColor: '#f1f5f9',
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-full)',
                    }}
                  >
                    {feature.tag}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: '1.1875rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    marginBottom: '0.625rem',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {feature.title}
                </h3>
                <p style={{ fontSize: '0.9375rem', color: '#64748b', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  {feature.description}
                </p>
              </div>

              <div
                style={{
                  paddingTop: '1rem',
                  borderTop: '1px solid #f1f5f9',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#4f46e5',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                }}
              >
                <span>{feature.benefit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
