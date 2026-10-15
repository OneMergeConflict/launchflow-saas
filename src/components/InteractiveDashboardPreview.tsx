import React, { useState } from 'react';
import { 
  DollarSign, 
  Users, 
  CheckCircle2, 
  TrendingUp, 
  Search, 
  Plus, 
  ArrowUpRight, 
  Sparkles,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SEED_LEADS } from '../data/seedLeads';
import { LeadStatus } from '../types';

interface PreviewProps {
  onOpenFullApp: () => void;
}

export const InteractiveDashboardPreview: React.FC<PreviewProps> = ({ onOpenFullApp }) => {
  const [activeTab, setActiveTab] = useState<'All' | LeadStatus>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [leadsList, setLeadsList] = useState(SEED_LEADS);

  const filteredLeads = leadsList.filter((lead) => {
    const matchesTab = activeTab === 'All' || lead.status === activeTab;
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.source.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalValue = leadsList.reduce((acc, curr) => acc + curr.deal_value, 0);
  const convertedCount = leadsList.filter((l) => l.status === 'Converted').length;
  const conversionRate = Math.round((convertedCount / leadsList.length) * 100);

  const handleSimulateConvert = (leadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });

    setLeadsList((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: 'Converted' } : l))
    );
  };

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'New':
        return <span className="badge badge-new">New Inbound</span>;
      case 'Contacted':
        return <span className="badge badge-contacted">Discovery Done</span>;
      case 'Qualified':
        return <span className="badge badge-qualified">Proposal Sent</span>;
      case 'Converted':
        return <span className="badge badge-converted">Won & Paid ✓</span>;
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 'var(--radius-xl)',
        background: '#ffffff',
        border: '1px solid rgba(226, 232, 240, 0.9)',
        boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.16), 0 0 0 1px rgba(79, 70, 229, 0.08)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
      }}
    >
      {/* SaaS App Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.875rem 1.5rem',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <span style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
            <span style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
            <span style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#10b981' }} />
          </div>
          <div style={{ height: '16px', width: '1px', backgroundColor: 'rgba(255, 255, 255, 0.15)', margin: '0 4px' }} />
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#e2e8f0', letterSpacing: '-0.01em' }}>
            LaunchFlow Studio • Live Sandbox Preview
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <span
            style={{
              fontSize: '0.75rem',
              color: '#34d399',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-full)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 600,
            }}
          >
            <span className="ping-dot" style={{ backgroundColor: '#10b981' }} />
            PostgreSQL Active
          </span>
          <button
            onClick={onOpenFullApp}
            className="btn btn-glass btn-sm"
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
          >
            Launch Full App <ExternalLink size={13} />
          </button>
        </div>
      </div>

      {/* Mini App Content Area */}
      <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc' }}>
        {/* KPI Strip */}
        <div className="grid grid-4 gap-4" style={{ marginBottom: '1.25rem' }}>
          <div className="card" style={{ padding: '1rem', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.78125rem', fontWeight: 600 }}>
              <span>Total Pipeline</span>
              <DollarSign size={16} color="#4f46e5" />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
              ${totalValue.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.71875rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
              <TrendingUp size={12} /> +24% vs last month
            </div>
          </div>

          <div className="card" style={{ padding: '1rem', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.78125rem', fontWeight: 600 }}>
              <span>Active Prospects</span>
              <Users size={16} color="#0ea5e9" />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
              {leadsList.length} Leads
            </div>
            <div style={{ fontSize: '0.71875rem', color: '#64748b', marginTop: '2px' }}>
              5 high priority
            </div>
          </div>

          <div className="card" style={{ padding: '1rem', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.78125rem', fontWeight: 600 }}>
              <span>Conversion Rate</span>
              <CheckCircle2 size={16} color="#10b981" />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
              {conversionRate}%
            </div>
            <div style={{ fontSize: '0.71875rem', color: '#10b981', fontWeight: 600, marginTop: '2px' }}>
              Industry top decile
            </div>
          </div>

          <div className="card" style={{ padding: '1rem', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.78125rem', fontWeight: 600 }}>
              <span>Avg Deal Size</span>
              <Sparkles size={16} color="#8b5cf6" />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
              ${Math.round(totalValue / leadsList.length).toLocaleString()}
            </div>
            <div style={{ fontSize: '0.71875rem', color: '#64748b', marginTop: '2px' }}>
              Based on active pipeline
            </div>
          </div>
        </div>

        {/* Interactive Controls Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '1rem',
            flexWrap: 'wrap',
          }}
        >
          {/* Status Tab Filter Pills */}
          <div style={{ display: 'flex', gap: '0.375rem', overflowX: 'auto', paddingBottom: '2px' }}>
            {(['All', 'New', 'Contacted', 'Qualified', 'Converted'] as const).map((tab) => {
              const count = tab === 'All' ? leadsList.length : leadsList.filter((l) => l.status === tab).length;
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    border: '1px solid',
                    borderColor: isActive ? '#4f46e5' : '#e2e8f0',
                    backgroundColor: isActive ? '#4f46e5' : '#ffffff',
                    color: isActive ? '#ffffff' : '#475569',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>{tab}</span>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      padding: '0.1rem 0.4rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : '#f1f5f9',
                      color: isActive ? '#ffffff' : '#64748b',
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Search */}
          <div style={{ position: 'relative', minWidth: '220px' }}>
            <Search
              size={15}
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
            />
            <input
              type="text"
              placeholder="Search prospects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 0.75rem 0.45rem 2rem',
                fontSize: '0.8125rem',
                border: '1px solid #cbd5e1',
                borderRadius: 'var(--radius-md)',
                outline: 'none',
                backgroundColor: '#ffffff',
              }}
            />
          </div>
        </div>

        {/* Lead Table Rows */}
        <div className="table-container">
          <table className="leads-table">
            <thead>
              <tr>
                <th>Lead & Company</th>
                <th>Source</th>
                <th>Est. Value</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Quick Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.slice(0, 4).map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div className="avatar">
                        {lead.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{lead.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{lead.company}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-source">{lead.source}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>
                      ${lead.deal_value.toLocaleString()}
                    </span>
                  </td>
                  <td>{getStatusBadge(lead.status)}</td>
                  <td style={{ textAlign: 'right' }}>
                    {lead.status !== 'Converted' ? (
                      <button
                        onClick={(e) => handleSimulateConvert(lead.id, e)}
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
                        title="Simulate winning this deal"
                      >
                        <Sparkles size={12} color="#7c3aed" /> Close Won
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
                        Deal Closed 🎉
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom preview callout */}
        <div
          style={{
            marginTop: '1rem',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: '#ffffff',
            border: '1px dashed #cbd5e1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#475569' }}>
            <Sparkles size={16} color="#4f46e5" />
            <span>
              <strong>Try clicking the status filters</strong> or the <strong>Close Won</strong> button to see real-time recalculations.
            </span>
          </div>
          <button
            onClick={onOpenFullApp}
            className="btn btn-primary btn-sm"
            style={{ fontSize: '0.8125rem' }}
          >
            Open Complete CRM Workspace <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
