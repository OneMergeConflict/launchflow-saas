import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2, Sparkles, Lock } from 'lucide-react';
import { apiSubmitEarlyAccess } from '../lib/supabase';

interface EarlyAccessProps {
  onSuccessToast?: (msg: string) => void;
}

export const EarlyAccessForm: React.FC<EarlyAccessProps> = ({ onSuccessToast }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'duplicate' | 'error'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();

    if (!cleanEmail || !cleanEmail.includes('@') || cleanEmail.length < 5) {
      setStatus('error');
      setFeedbackMessage('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setStatus('idle');
    setFeedbackMessage('');

    try {
      const result = await apiSubmitEarlyAccess(cleanEmail);
      if (result.isDuplicate) {
        setStatus('duplicate');
        setFeedbackMessage(result.message);
      } else {
        setStatus('success');
        setFeedbackMessage(result.message);
        setEmail('');
        if (onSuccessToast) onSuccessToast(result.message);
      }
    } catch {
      setStatus('error');
      setFeedbackMessage('Unable to complete request right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      style={{
        padding: '5.5rem 0',
        backgroundColor: '#0b0f19',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative gradient glow background */}
      <div
        style={{
          position: 'absolute',
          top: '-100px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(124, 58, 237, 0.15) 45%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            maxWidth: '680px',
            margin: '0 auto',
            textAlign: 'center',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 'var(--radius-xl)',
            padding: '3rem 2rem',
            boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(99, 102, 241, 0.2)',
              border: '1px solid rgba(99, 102, 241, 0.35)',
              color: '#a5b4fc',
              fontSize: '0.78125rem',
              fontWeight: 700,
              padding: '0.3rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              marginBottom: '1.25rem',
            }}
          >
            <Sparkles size={14} /> VIP Priority Access
          </div>

          <h2
            style={{
              fontSize: 'clamp(1.85rem, 3.2vw, 2.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              marginBottom: '1rem',
              lineHeight: 1.2,
            }}
          >
            Get early access to LaunchFlow 2.0
          </h2>
          <p
            style={{
              fontSize: '1rem',
              color: '#94a3b8',
              lineHeight: 1.6,
              marginBottom: '2rem',
              maxWidth: '520px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Join 1,400+ freelancers securing early access to AI-assisted pipeline intelligence and direct Upwork & Fiverr lead sync.
          </p>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              gap: '0.625rem',
              maxWidth: '480px',
              margin: '0 auto',
              flexWrap: 'wrap',
            }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your work email address..."
              required
              style={{
                flex: 1,
                minWidth: '240px',
                padding: '0.8125rem 1.125rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                fontSize: '0.9375rem',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ padding: '0.8125rem 1.5rem', whiteSpace: 'nowrap', flexShrink: 0 }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Joining...</span>
                </>
              ) : (
                <>
                  <span>Claim Early Access</span>
                  <Send size={15} />
                </>
              )}
            </button>
          </form>

          {/* Feedback messages */}
          {status === 'success' && (
            <div
              style={{
                marginTop: '1.25rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#34d399',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              <CheckCircle2 size={16} />
              <span>{feedbackMessage}</span>
            </div>
          )}

          {status === 'duplicate' && (
            <div
              style={{
                marginTop: '1.25rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#fbbf24',
                backgroundColor: 'rgba(245, 158, 11, 0.12)',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              <CheckCircle2 size={16} />
              <span>{feedbackMessage}</span>
            </div>
          )}

          {status === 'error' && (
            <div
              style={{
                marginTop: '1.25rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#f87171',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              <AlertCircle size={16} />
              <span>{feedbackMessage}</span>
            </div>
          )}

          {/* Privacy footnote */}
          <div
            style={{
              marginTop: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.375rem',
              fontSize: '0.78125rem',
              color: '#64748b',
            }}
          >
            <Lock size={13} />
            <span>Zero spam. Direct PostgreSQL RLS isolation. Unsubscribe at any time.</span>
          </div>
        </div>
      </div>
    </section>
  );
};
