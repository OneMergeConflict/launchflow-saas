import React, { useState } from 'react';
import { Mail, PhoneCall, CheckCircle, Award, ArrowRight, Sparkles } from 'lucide-react';

export const Workflow: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: '01',
      title: 'Capture & Ingest',
      statusName: 'New',
      badgeClass: 'badge-new',
      icon: <Mail size={22} color="#1d4ed8" />,
      headline: 'Instantly record inquiries with source tracking',
      description:
        'When a prospect reaches out on Upwork, sends a message on Fiverr, or fills out your website form, add them to LaunchFlow in under 15 seconds. Tag the acquisition source to understand your best customer acquisition channel.',
      proTip: 'Freelancers using source tagging close 38% more deals by doubling down on their top platform.',
    },
    {
      number: '02',
      title: 'Engage & Discovery',
      statusName: 'Contacted',
      badgeClass: 'badge-contacted',
      icon: <PhoneCall size={22} color="#b45309" />,
      headline: 'Log discovery calls and follow-ups without clutter',
      description:
        'Transition the lead to "Contacted" as soon as you have sent a response or scheduled a discovery call. Record initial scope nuances, deadline expectations, and budget ranges directly in the client notes field.',
      proTip: 'Responding within 2 hours boosts response rates on freelance marketplaces by over 2.5x.',
    },
    {
      number: '03',
      title: 'Qualify & Proposal',
      statusName: 'Qualified',
      badgeClass: 'badge-qualified',
      icon: <CheckCircle size={22} color="#6d28d9" />,
      headline: 'Quantify deal budget and proposal status',
      description:
        'Once scope is aligned and the official proposal or Upwork contract offer is submitted, elevate the status to "Qualified". Your active pipeline value updates in real time to reflect the pending revenue.',
      proTip: 'Keeping track of pending proposal values prevents dry periods between client projects.',
    },
    {
      number: '04',
      title: 'Convert & Celebrate',
      statusName: 'Converted',
      badgeClass: 'badge-converted',
      icon: <Award size={22} color="#047857" />,
      headline: 'Seal the contract and calculate your win rate',
      description:
        'When the contract is signed or deposit is escrowed, mark the lead as "Converted". LaunchFlow automatically recalculates your conversion analytics and archives the customer history for recurring business.',
      proTip: 'Celebrate wins with built-in confetti and export your completed client records for tax and accounting.',
    },
  ];

  return (
    <section id="workflow" style={{ padding: '6rem 0', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: '720px', margin: '0 auto 3.5rem auto', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#7c3aed',
              backgroundColor: '#f5f3ff',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              marginBottom: '1rem',
            }}
          >
            <Sparkles size={14} /> The 4-Stage Freelancer Workflow
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
            From cold inbound to paid contract in four simple steps.
          </h2>
          <p style={{ fontSize: '1.0625rem', color: '#64748b', lineHeight: 1.6 }}>
            Never drop a prospective client again. Follow a proven, disciplined pipeline designed specifically to protect your time and maximize revenue.
          </p>
        </div>

        {/* Workflow Steps Selector */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem',
            marginBottom: '2.5rem',
          }}
          className="workflow-grid"
        >
          {steps.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <div
                key={idx}
                onClick={() => setActiveStep(idx)}
                style={{
                  cursor: 'pointer',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid',
                  borderColor: isActive ? '#4f46e5' : '#e2e8f0',
                  backgroundColor: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
                  boxShadow: isActive ? 'var(--shadow-md)' : 'none',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: isActive ? '#4f46e5' : '#94a3b8' }}>
                    STEP {step.number}
                  </span>
                  <span className={`badge ${step.badgeClass}`}>{step.statusName}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: isActive ? '#0f172a' : '#475569' }}>
                  {step.title}
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Step Deep Dive Card */}
        <div
          className="card"
          style={{
            maxWidth: '960px',
            margin: '0 auto',
            padding: '2.5rem',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div
              style={{
                width: '4.5rem',
                height: '4.5rem',
                borderRadius: '16px',
                backgroundColor: '#eef2ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {steps[activeStep].icon}
            </div>

            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className={`badge ${steps[activeStep].badgeClass}`}>Stage: {steps[activeStep].statusName}</span>
                <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>Step {steps[activeStep].number} of 04</span>
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
                {steps[activeStep].headline}
              </h3>
              <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {steps[activeStep].description}
              </p>
              <div
                style={{
                  padding: '0.875rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#f8fafc',
                  borderLeft: '4px solid #4f46e5',
                  fontSize: '0.875rem',
                  color: '#334155',
                }}
              >
                <strong>Freelancer Pro-Tip:</strong> {steps[activeStep].proTip}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .workflow-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .workflow-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
