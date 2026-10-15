import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, Lock, CheckCircle2, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  planName: string;
  price: number;
  onClose: () => void;
  onSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  planName,
  price,
  onClose,
  onSuccess,
}) => {
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [cardName, setCardName] = useState('Demo Freelance Studio');
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);

  if (!isOpen) return null;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setPaid(true);
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
      });
      setTimeout(() => {
        onSuccess();
      }, 2500);
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div
              style={{
                width: '2rem',
                height: '2rem',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
              }}
            >
              <CreditCard size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#0f172a' }}>
                Secure Subscription Checkout
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                256-Bit SSL Encrypted • Powered by Stripe Architecture
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

        {!paid ? (
          <form onSubmit={handlePay}>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Order Summary Box */}
              <div
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9375rem' }}>
                    {planName} Plan
                  </span>
                  <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.125rem' }}>
                    ${price}.00 <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>/ mo</span>
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: '#047857', fontWeight: 600 }}>
                  <span>14-Day Risk-Free Trial</span>
                  <span>$0.00 due today</span>
                </div>
              </div>

              {/* Cardholder Name */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Name on Card</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="e.g. Alex Vance"
                />
              </div>

              {/* Card Number */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">
                  <span>Card Information</span>
                  <span style={{ fontSize: '0.71875rem', color: '#10b981', fontWeight: 600 }}>Visa, Mastercard, Amex</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <CreditCard size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6366f1' }} />
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    style={{ paddingLeft: '2.25rem' }}
                  />
                </div>
              </div>

              {/* Expiry & CVC */}
              <div className="grid grid-2 gap-4">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Expires</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM/YY"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">CVC / CVV</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    placeholder="123"
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.75rem',
                  color: '#64748b',
                  padding: '0.5rem 0',
                }}
              >
                <Lock size={13} color="#10b981" />
                <span>Simulated PCI-DSS Level 1 compliant gateway. No real charge applied for demo.</span>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" onClick={onClose} className="btn btn-outline btn-sm">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn btn-primary btn-sm" style={{ minWidth: '160px' }}>
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>Authorizing...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={15} />
                    <span>Activate Subscription</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Payment Success State */
          <div className="modal-body" style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
            <div
              style={{
                width: '3.5rem',
                height: '3.5rem',
                borderRadius: '50%',
                backgroundColor: '#ecfdf5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto',
                color: '#10b981',
              }}
            >
              <CheckCircle2 size={32} />
            </div>
            <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              Subscription Confirmed! 🎉
            </h3>
            <p style={{ fontSize: '0.9375rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Receipt sent to your billing email. Your account has been upgraded to <strong>{planName}</strong> with full unlimited access.
            </p>
            <div
              style={{
                fontSize: '0.78125rem',
                color: '#475569',
                backgroundColor: '#f8fafc',
                padding: '0.5rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #e2e8f0',
                marginBottom: '1.5rem',
              }}
            >
              Invoice Reference: <strong>INV-{Date.now().toString().slice(-6)}</strong>
            </div>
            <button
              onClick={() => {
                setPaid(false);
                onSuccess();
              }}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              <span>Continue to Workspace</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
