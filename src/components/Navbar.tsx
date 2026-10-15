import React, { useState } from 'react';
import { Sparkles, Menu, X, ArrowRight } from 'lucide-react';
import { UserSession } from '../types';

interface NavbarProps {
  session: UserSession | null;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onGoToApp: () => void;
  onGoToLanding: () => void;
  onOpenSupabaseConfig: () => void;
  isSupabaseActive: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  session,
  onOpenAuth,
  onGoToApp,
  onGoToLanding,
  onOpenSupabaseConfig,
  isSupabaseActive,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (anchorId: string) => {
    setMobileMenuOpen(false);
    onGoToLanding();
    setTimeout(() => {
      const el = document.getElementById(anchorId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
        transition: 'all 0.2s ease',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4.25rem' }}>
        {/* Brand Logo */}
        <div
          onClick={onGoToLanding}
          style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer', userSelect: 'none' }}
        >
          <div
            style={{
              width: '2.375rem',
              height: '2.375rem',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.35)',
            }}
          >
            <Sparkles size={20} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em' }}>
              Launch<span style={{ color: '#4f46e5' }}>Flow</span>
            </span>
            <span style={{ fontSize: '0.65rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: '-3px' }}>
              Freelance CRM
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <button
            onClick={() => handleNavClick('features')}
            style={{ background: 'none', border: 'none', fontSize: '0.9375rem', fontWeight: 500, color: '#475569', cursor: 'pointer', padding: '0.25rem' }}
            onMouseOver={(e) => (e.currentTarget.style.color = '#4f46e5')}
            onMouseOut={(e) => (e.currentTarget.style.color = '#475569')}
          >
            Features
          </button>
          <button
            onClick={() => handleNavClick('workflow')}
            style={{ background: 'none', border: 'none', fontSize: '0.9375rem', fontWeight: 500, color: '#475569', cursor: 'pointer', padding: '0.25rem' }}
            onMouseOver={(e) => (e.currentTarget.style.color = '#4f46e5')}
            onMouseOut={(e) => (e.currentTarget.style.color = '#475569')}
          >
            Workflow
          </button>
          <button
            onClick={() => handleNavClick('pricing')}
            style={{ background: 'none', border: 'none', fontSize: '0.9375rem', fontWeight: 500, color: '#475569', cursor: 'pointer', padding: '0.25rem' }}
            onMouseOver={(e) => (e.currentTarget.style.color = '#4f46e5')}
            onMouseOut={(e) => (e.currentTarget.style.color = '#475569')}
          >
            Pricing
          </button>
          <button
            onClick={() => handleNavClick('faq')}
            style={{ background: 'none', border: 'none', fontSize: '0.9375rem', fontWeight: 500, color: '#475569', cursor: 'pointer', padding: '0.25rem' }}
            onMouseOver={(e) => (e.currentTarget.style.color = '#4f46e5')}
            onMouseOut={(e) => (e.currentTarget.style.color = '#475569')}
          >
            FAQ
          </button>
        </nav>

        {/* Desktop CTA / Auth buttons */}
        <div className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          {session ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0f172a' }}>{session.fullName}</span>
                <span style={{ fontSize: '0.71875rem', color: '#64748b' }}>{session.isDemo ? 'Demo Mode' : 'Connected'}</span>
              </div>
              <button onClick={onGoToApp} className="btn btn-primary btn-sm">
                Open Dashboard <ArrowRight size={15} />
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => onOpenAuth('signin')}
                className="btn btn-ghost btn-sm"
                style={{ fontWeight: 600 }}
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="btn btn-primary btn-sm"
              >
                Get Started Free <ArrowRight size={15} />
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: '#0f172a',
            cursor: 'pointer',
            padding: '0.5rem',
          }}
          className="mobile-toggle-btn"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <button
            onClick={() => handleNavClick('features')}
            style={{ textAlign: 'left', background: 'none', border: 'none', fontSize: '1rem', fontWeight: 600, color: '#334155', padding: '0.5rem 0' }}
          >
            Features
          </button>
          <button
            onClick={() => handleNavClick('workflow')}
            style={{ textAlign: 'left', background: 'none', border: 'none', fontSize: '1rem', fontWeight: 600, color: '#334155', padding: '0.5rem 0' }}
          >
            Workflow
          </button>
          <button
            onClick={() => handleNavClick('pricing')}
            style={{ textAlign: 'left', background: 'none', border: 'none', fontSize: '1rem', fontWeight: 600, color: '#334155', padding: '0.5rem 0' }}
          >
            Pricing
          </button>
          <button
            onClick={() => handleNavClick('faq')}
            style={{ textAlign: 'left', background: 'none', border: 'none', fontSize: '1rem', fontWeight: 600, color: '#334155', padding: '0.5rem 0' }}
          >
            FAQ
          </button>
          <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '0.5rem 0' }} />

          {session ? (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onGoToApp();
              }}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              Open Dashboard <ArrowRight size={16} />
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('signin');
                }}
                className="btn btn-outline"
                style={{ width: '100%' }}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('signup');
                }}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Get Started Free <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .mobile-toggle-btn {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
};
