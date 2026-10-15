import React, { useState } from 'react';
import { X, Lock, Mail, User, ArrowRight, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { apiSignIn, apiSignUp } from '../lib/supabase';
import { UserSession } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'signin' | 'signup';
  onClose: () => void;
  onSuccess: (session: UserSession) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signup') {
        const res = await apiSignUp(email, password, fullName || email.split('@')[0]);
        if (res.error) {
          setErrorMessage(res.error);
        } else if (res.session) {
          onSuccess(res.session);
          onClose();
        }
      } else {
        const res = await apiSignIn(email, password);
        if (res.error) {
          setErrorMessage(res.error);
        } else if (res.session) {
          onSuccess(res.session);
          onClose();
        }
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    const demoSession: UserSession = {
      id: 'demo-freelancer-session',
      email: 'alex@launchflow-demo.io',
      fullName: 'Alex Vance (Freelance Designer)',
      isDemo: true,
    };
    onSuccess(demoSession);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: '1.75rem',
                height: '1.75rem',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
              }}
            >
              <Sparkles size={14} />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a' }}>
              {mode === 'signin' ? 'Sign in to LaunchFlow' : 'Create your free account'}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab switch */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMessage('');
            }}
            style={{
              flex: 1,
              padding: '0.75rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: mode === 'signin' ? '#4f46e5' : '#64748b',
              borderBottom: mode === 'signin' ? '2px solid #4f46e5' : '2px solid transparent',
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage('');
            }}
            style={{
              flex: 1,
              padding: '0.75rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: mode === 'signup' ? '#4f46e5' : '#64748b',
              borderBottom: mode === 'signup' ? '2px solid #4f46e5' : '2px solid transparent',
            }}
          >
            Create Account
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Quick Demo Login Option for evaluators */}
          <div
            style={{
              backgroundColor: '#eef2ff',
              border: '1px solid #c7d2fe',
              borderRadius: 'var(--radius-md)',
              padding: '0.875rem 1rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
            }}
          >
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#3730a3' }}>
                Upwork / Portfolio Reviewer?
              </div>
              <div style={{ fontSize: '0.75rem', color: '#4338ca' }}>
                Instant access with preloaded realistic pipeline data.
              </div>
            </div>
            <button
              onClick={handleDemoLogin}
              className="btn btn-primary btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', flexShrink: 0 }}
            >
              1-Click Demo
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              margin: '0.75rem 0 1.25rem 0',
              color: '#94a3b8',
              fontSize: '0.75rem',
            }}
          >
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
            <span>OR CONTINUE WITH EMAIL</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
          </div>

          {errorMessage && (
            <div
              style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#b91c1c',
                padding: '0.625rem 0.875rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8125rem',
                marginBottom: '1rem',
              }}
            >
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div className="form-group">
                <label className="form-label">Full Name or Agency Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Alex Vance"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{ paddingLeft: '2.25rem' }}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="email"
                  className="form-input"
                  placeholder="alex@studio.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '2.25rem' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Password</span>
                {mode === 'signin' && (
                  <span style={{ fontSize: '0.75rem', color: '#4f46e5', cursor: 'pointer' }}>
                    Forgot?
                  </span>
                )}
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '2.25rem' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Sign In to Dashboard' : 'Create Free Account'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.8125rem', color: '#64748b' }}>
            {mode === 'signin' ? (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  style={{ background: 'none', border: 'none', color: '#4f46e5', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                >
                  Sign up free
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  style={{ background: 'none', border: 'none', color: '#4f46e5', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                >
                  Sign in
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
