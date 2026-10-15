import React, { useState } from 'react';
import { Check, Sparkles, ArrowRight, Shield } from 'lucide-react';

interface PricingProps {
  onSelectPlan: (plan: string) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onSelectPlan }) => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: 'Starter',
      badge: 'Free Forever',
      badgeStyle: { backgroundColor: '#f1f5f9', color: '#475569' },
      description: 'Ideal for solo freelancers getting started with organized lead tracking.',
      monthlyPrice: 0,
      annualPrice: 0,
      popular: false,
      features: [
        'Up to 50 active leads',
        '4-stage visual pipeline',
        'Basic deal value calculation',
        'Source attribution (Upwork, Fiverr, Web)',
        'Client interaction notes',
        'Standard CSV export',
      ],
      cta: 'Start Free Now',
      ctaClass: 'btn-outline',
    },
    {
      name: 'Professional',
      badge: 'Most Popular',
      badgeStyle: { backgroundColor: '#e0e7ff', color: '#4338ca' },
      description: 'Built for active freelancers, consultants, and independent practitioners.',
      monthlyPrice: 24,
      annualPrice: 19,
      popular: true,
      features: [
        'Unlimited leads & contacts',
        'Real-time cash flow & pipeline forecast',
        'Conversion analytics & win-rate metrics',
        'Direct Supabase PostgreSQL database sync',
        'Confetti conversion feedback',
        'Advanced multi-parameter search & sort',
        'Priority email & chat support',
      ],
      cta: 'Start 14-Day Free Trial',
      ctaClass: 'btn-primary',
    },
    {
      name: 'Agency Studio',
      badge: 'For Boutique Teams',
      badgeStyle: { backgroundColor: '#f5f3ff', color: '#6d28d9' },
      description: 'For growing boutique studios, design agencies, and small consulting firms.',
      monthlyPrice: 59,
      annualPrice: 47,
      popular: false,
      features: [
        'Everything in Professional',
        'Multi-seat workspace & team access',
        'Custom acquisition channels & tags',
        'Unlimited Supabase Row Level Security sync',
        'Automated webhook triggers & API access',
        'Dedicated onboarding session',
        '99.9% Uptime SLA',
      ],
      cta: 'Upgrade to Agency',
      ctaClass: 'btn-secondary',
    },
  ];

  return (
    <section id="pricing" style={{ padding: '6rem 0', backgroundColor: '#ffffff', position: 'relative' }}>
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: '720px', margin: '0 auto 3rem auto', textAlign: 'center' }}>
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
            <Sparkles size={14} /> Transparent & Flexible Plans
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
            Predictable pricing that scales with your client pipeline.
          </h2>
          <p style={{ fontSize: '1.0625rem', color: '#64748b', lineHeight: 1.6, marginBottom: '2rem' }}>
            Choose the plan that matches your freelance volume. Upgrade, downgrade, or export your data at any time.
          </p>

          {/* Billing Toggle */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              backgroundColor: '#f1f5f9',
              padding: '0.375rem',
              borderRadius: 'var(--radius-full)',
            }}
          >
            <button
              onClick={() => setIsAnnual(false)}
              style={{
                border: 'none',
                background: !isAnnual ? '#ffffff' : 'transparent',
                color: !isAnnual ? '#0f172a' : '#64748b',
                boxShadow: !isAnnual ? 'var(--shadow-xs)' : 'none',
                borderRadius: 'var(--radius-full)',
                padding: '0.5rem 1.25rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              style={{
                border: 'none',
                background: isAnnual ? '#ffffff' : 'transparent',
                color: isAnnual ? '#0f172a' : '#64748b',
                boxShadow: isAnnual ? 'var(--shadow-xs)' : 'none',
                borderRadius: 'var(--radius-full)',
                padding: '0.5rem 1.25rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span>Annual Billing</span>
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  color: '#047857',
                  backgroundColor: '#d1fae5',
                  padding: '0.15rem 0.5rem',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-3 gap-6" style={{ alignItems: 'stretch' }}>
          {plans.map((plan, idx) => {
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            return (
              <div
                key={idx}
                className="card card-hover"
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '2.25rem',
                  borderRadius: 'var(--radius-xl)',
                  backgroundColor: '#ffffff',
                  border: plan.popular ? '2px solid #4f46e5' : '1px solid #e2e8f0',
                  boxShadow: plan.popular ? '0 12px 36px -4px rgba(79, 70, 229, 0.2)' : 'var(--shadow-sm)',
                }}
              >
                {plan.popular && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-13px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: '#4f46e5',
                      color: '#ffffff',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.25rem 1rem',
                      borderRadius: 'var(--radius-full)',
                      letterSpacing: '0.02em',
                      boxShadow: '0 4px 10px rgba(79, 70, 229, 0.35)',
                    }}
                  >
                    RECOMMENDED CHOICE
                  </div>
                )}

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#0f172a' }}>{plan.name}</h3>
                    <span
                      style={{
                        fontSize: '0.71875rem',
                        fontWeight: 700,
                        padding: '0.25rem 0.65rem',
                        borderRadius: 'var(--radius-full)',
                        ...plan.badgeStyle,
                      }}
                    >
                      {plan.badge}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5, minHeight: '42px', marginBottom: '1.5rem' }}>
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.375rem', marginBottom: '1.75rem' }}>
                    <span style={{ fontSize: '2.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em' }}>
                      ${price}
                    </span>
                    <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>
                      / user / month
                    </span>
                  </div>

                  <div style={{ height: '1px', backgroundColor: '#f1f5f9', marginBottom: '1.5rem' }} />

                  {/* Features List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '2rem' }}>
                    {plan.features.map((feature, fIdx) => (
                      <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.875rem', color: '#334155' }}>
                        <div
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            backgroundColor: '#ecfdf5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Check size={12} color="#10b981" strokeWidth={3} />
                        </div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => onSelectPlan(plan.name)}
                  className={`btn ${plan.ctaClass}`}
                  style={{ width: '100%', padding: '0.8125rem' }}
                >
                  <span>{plan.cta}</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Security & Money-Back Notice */}
        <div
          style={{
            marginTop: '3.5rem',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.5rem',
            fontSize: '0.8125rem',
            color: '#64748b',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Shield size={16} color="#4f46e5" />
            <span>Illustrative plans for client and portfolio evaluation</span>
          </div>
          <span>•</span>
          <span>Full Supabase database export anytime</span>
          <span>•</span>
          <span>Cancel or change plans with 1 click</span>
        </div>
      </div>
    </section>
  );
};
