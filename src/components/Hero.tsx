import React from 'react';
import { ArrowRight, Sparkles, Check, Play, Shield, Zap } from 'lucide-react';
import { InteractiveDashboardPreview } from './InteractiveDashboardPreview';

interface HeroProps {
  onStartFree: () => void;
  onExploreDemo: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartFree, onExploreDemo }) => {
  return (
    <section
      style={{
        position: 'relative',
        paddingTop: '3.5rem',
        paddingBottom: '5rem',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%)',
      }}
    >
      {/* Subtle background ambient mesh */}
      <div
        style={{
          position: 'absolute',
          top: '-120px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '900px',
          height: '450px',
          background: 'radial-gradient(ellipse, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.08) 45%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Main Hero Header */}
        <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>
          {/* Announcement pill */}
          <div style={{ display: 'inline-block', marginBottom: '1.25rem' }}>
            <div className="badge-announcement">
              <span className="ping-dot" />
              <span>LaunchFlow 2.0 • Built for High-Impact Freelancers & Studios</span>
            </div>
          </div>

          {/* Core Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.35rem, 5vw, 3.85rem)',
              lineHeight: 1.12,
              fontWeight: 800,
              letterSpacing: '-0.035em',
              color: '#0f172a',
              marginBottom: '1.25rem',
            }}
          >
            Turn Every Lead Into Your Next Opportunity.
          </h1>

          {/* Supporting Copy */}
          <p
            style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              lineHeight: 1.6,
              color: '#475569',
              maxWidth: '720px',
              margin: '0 auto 2.25rem auto',
            }}
          >
            The high-velocity lead-management platform designed for freelancers, consultants, and boutique agencies.
            Capture inquiries across Upwork, Fiverr, and your portfolio website—then guide every prospect from first contact to signed contract.
          </p>

          {/* Hero CTAs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '2.5rem',
            }}
          >
            <button onClick={onStartFree} className="btn btn-primary btn-lg">
              <span>Start Free Pipeline</span>
              <ArrowRight size={18} />
            </button>
            <button onClick={onExploreDemo} className="btn btn-outline btn-lg">
              <Play size={16} color="#4f46e5" fill="#4f46e5" />
              <span>Explore Live App Demo</span>
            </button>
          </div>

          {/* Trust signals */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.75rem',
              fontSize: '0.84375rem',
              color: '#64748b',
              flexWrap: 'wrap',
              marginBottom: '3.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Check size={16} color="#10b981" />
              <span>Free 50-lead tier forever</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Check size={16} color="#10b981" />
              <span>No credit card needed</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Check size={16} color="#10b981" />
              <span>Supabase RLS Tenant Security</span>
            </div>
          </div>
        </div>

        {/* Product Dashboard Preview */}
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <InteractiveDashboardPreview onOpenFullApp={onExploreDemo} />
        </div>
      </div>
    </section>
  );
};
