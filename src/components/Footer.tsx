import { Sparkles, Shield, Database } from 'lucide-react';

interface FooterProps {
  onGoToLanding: () => void;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onOpenSupabaseConfig: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onGoToLanding, onOpenAuth, onOpenSupabaseConfig }) => {
  const scrollTo = (id: string) => {
    onGoToLanding();
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <footer
      style={{
        backgroundColor: '#070a12',
        color: '#94a3b8',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '4.5rem 0 2.5rem 0',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '3rem',
            marginBottom: '4rem',
          }}
        >
          {/* Brand Col */}
          <div style={{ maxWidth: '320px' }}>
            <div
              onClick={onGoToLanding}
              style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer', marginBottom: '1rem' }}
            >
              <div
                style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <Sparkles size={16} />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                Launch<span style={{ color: '#818cf8' }}>Flow</span>
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#64748b', marginBottom: '1.25rem' }}>
              The high-velocity lead-management platform designed for freelancers, independent consultants, and boutique agencies.
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.75rem',
                color: '#34d399',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                padding: '0.25rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
              }}
            >
              <span className="ping-dot" style={{ backgroundColor: '#10b981', width: '6px', height: '6px' }} />
              All Systems Operational • 99.9% Uptime
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#ffffff', marginBottom: '1rem' }}>
              Product
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem' }}>
              <li>
                <button onClick={() => scrollTo('features')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}>
                  Features & Capabilities
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('workflow')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}>
                  4-Stage Pipeline
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('pricing')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}>
                  Transparent Pricing
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('faq')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}>
                  Frequently Asked Questions
                </button>
              </li>
            </ul>
          </div>

          {/* Platform & Architecture */}
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#ffffff', marginBottom: '1rem' }}>
              Tech Architecture
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Database size={14} color="#818cf8" />
                <span>Supabase PostgreSQL Storage</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Shield size={14} color="#34d399" />
                <span>Row Level Security (RLS)</span>
              </li>
              <li>
                <button onClick={onOpenSupabaseConfig} style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
                  Supabase Live Connection Settings
                </button>
              </li>
              <li>
                <span>Vercel Edge Ready</span>
              </li>
            </ul>
          </div>

          {/* Upwork & Portfolio badge */}
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#ffffff', marginBottom: '1rem' }}>
              Portfolio Application
            </div>
            <p style={{ fontSize: '0.8125rem', lineHeight: 1.6, color: '#64748b', marginBottom: '1rem' }}>
              Built as a real, production-ready SaaS demonstration for Upwork and Fiverr clients. Features live Supabase PostgreSQL backend, authenticated tenant isolation, and client-side demo state.
            </p>
            <button
              onClick={() => onOpenAuth('signin')}
              className="btn btn-glass btn-sm"
              style={{ fontSize: '0.8125rem' }}
            >
              Sign In to CRM Portal
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.8125rem',
            color: '#64748b',
          }}
        >
          <div>
            © {new Date().getFullYear()} LaunchFlow SaaS. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security Statement</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
