import React, { useState, useMemo } from 'react';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  Search, 
  Plus, 
  Download, 
  Edit2, 
  Trash2, 
  Sparkles, 
  ArrowLeft, 
  LogOut, 
  Database, 
  AlertCircle, 
  Mail, 
  Menu,
  X,
  LayoutList,
  Kanban,
  Eye,
  ArrowRight,
  Calendar,
  Building,
  Tag,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Lead, LeadStatus, LeadSource, UserSession } from '../types';

interface DashboardProps {
  session: UserSession;
  leads: Lead[];
  onAddLead: () => void;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (id: string) => void;
  onStatusChange: (id: string, newStatus: LeadStatus) => void;
  onSignOut: () => void;
  onGoToLanding: () => void;
  onOpenSupabaseConfig: () => void;
  isSupabaseActive: boolean;
}

export const DashboardView: React.FC<DashboardProps> = ({
  session,
  leads,
  onAddLead,
  onEditLead,
  onDeleteLead,
  onStatusChange,
  onSignOut,
  onGoToLanding,
  onOpenSupabaseConfig,
  isSupabaseActive,
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | LeadStatus>('All');
  const [sourceFilter, setSourceFilter] = useState<'All' | LeadSource>('All');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'value-desc' | 'value-asc' | 'name-asc'>('date-desc');
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [selectedLeadForDetail, setSelectedLeadForDetail] = useState<Lead | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Dynamic Metrics calculated from actual stored records
  const stats = useMemo(() => {
    const total = leads.length;
    const newCount = leads.filter((l) => l.status === 'New').length;
    const contactedCount = leads.filter((l) => l.status === 'Contacted').length;
    const qualifiedCount = leads.filter((l) => l.status === 'Qualified').length;
    const convertedCount = leads.filter((l) => l.status === 'Converted').length;
    const totalPipelineValue = leads.reduce((acc, curr) => acc + (curr.deal_value || 0), 0);
    const wonValue = leads
      .filter((l) => l.status === 'Converted')
      .reduce((acc, curr) => acc + (curr.deal_value || 0), 0);
    const conversionRate = total > 0 ? Math.round((convertedCount / total) * 100) : 0;

    return {
      total,
      newCount,
      contactedCount,
      qualifiedCount,
      convertedCount,
      totalPipelineValue,
      wonValue,
      conversionRate,
    };
  }, [leads]);

  // Filtered & Sorted Leads
  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => {
        const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
        const matchesSource = sourceFilter === 'All' || lead.source === sourceFilter;
        const query = searchTerm.toLowerCase();
        const matchesSearch =
          !query ||
          lead.name.toLowerCase().includes(query) ||
          lead.company.toLowerCase().includes(query) ||
          lead.email.toLowerCase().includes(query) ||
          (lead.notes && lead.notes.toLowerCase().includes(query));
        return matchesStatus && matchesSource && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        if (sortBy === 'date-asc') {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        }
        if (sortBy === 'value-desc') {
          return b.deal_value - a.deal_value;
        }
        if (sortBy === 'value-asc') {
          return a.deal_value - b.deal_value;
        }
        if (sortBy === 'name-asc') {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [leads, statusFilter, sourceFilter, searchTerm, sortBy]);

  // Status Change with Confetti Celebration
  const handleStatusSelect = (id: string, newStatus: LeadStatus) => {
    if (newStatus === 'Converted') {
      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
    onStatusChange(id, newStatus);
    if (selectedLeadForDetail && selectedLeadForDetail.id === id) {
      setSelectedLeadForDetail({ ...selectedLeadForDetail, status: newStatus });
    }
  };

  const getNextStage = (current: LeadStatus): LeadStatus | null => {
    switch (current) {
      case 'New': return 'Contacted';
      case 'Contacted': return 'Qualified';
      case 'Qualified': return 'Converted';
      case 'Converted': return null;
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (leads.length === 0) return;
    const headers = ['ID', 'Name', 'Email', 'Company', 'Status', 'Source', 'Deal Value ($)', 'Notes', 'Created At'];
    const rows = leads.map((l) => [
      l.id,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.email.replace(/"/g, '""')}"`,
      `"${l.company.replace(/"/g, '""')}"`,
      l.status,
      l.source,
      l.deal_value,
      `"${(l.notes || '').replace(/"/g, '""')}"`,
      new Date(l.created_at).toISOString(),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `launchflow-leads-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getSourceBadgeClass = (src: LeadSource) => {
    switch (src) {
      case 'Upwork': return 'badge-upwork';
      case 'Fiverr': return 'badge-fiverr';
      case 'LinkedIn': return 'badge-linkedin';
      case 'Website': return 'badge-website';
      case 'Referral': return 'badge-referral';
      case 'Outbound': return 'badge-outbound';
      default: return 'badge-source';
    }
  };

  const kanbanColumns: { status: LeadStatus; label: string; bg: string; dotColor: string }[] = [
    { status: 'New', label: 'New Inbounds', bg: '#eff6ff', dotColor: '#3b82f6' },
    { status: 'Contacted', label: 'Discovery / Contacted', bg: '#fffbeb', dotColor: '#f59e0b' },
    { status: 'Qualified', label: 'Proposals in Flight', bg: '#f5f3ff', dotColor: '#8b5cf6' },
    { status: 'Converted', label: 'Won & Closed Contracts', bg: '#ecfdf5', dotColor: '#10b981' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Sidebar - Desktop */}
      <aside
        style={{
          width: '260px',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 40,
        }}
        className="hide-on-mobile"
      >
        {/* Brand */}
        <div
          onClick={onGoToLanding}
          style={{
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: '2.1rem',
              height: '2.1rem',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.35)',
            }}
          >
            <Sparkles size={16} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1875rem', fontWeight: 800, color: '#ffffff' }}>
              Launch<span style={{ color: '#818cf8' }}>Flow</span>
            </div>
            <div style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Freelance Studio CRM
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', padding: '0.5rem 0.75rem', letterSpacing: '0.06em' }}>
            Workspaces
          </div>

          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              width: '100%',
              padding: '0.6875rem 0.875rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: 'rgba(79, 70, 229, 0.18)',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <Users size={17} color="#818cf8" />
            <span>Client Pipeline</span>
            <span
              style={{
                marginLeft: 'auto',
                fontSize: '0.6875rem',
                backgroundColor: '#4f46e5',
                color: '#ffffff',
                padding: '0.1rem 0.45rem',
                borderRadius: 'var(--radius-full)',
              }}
            >
              {leads.length}
            </span>
          </button>

          <button
            onClick={onOpenSupabaseConfig}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              width: '100%',
              padding: '0.6875rem 0.875rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: 'transparent',
              color: '#94a3b8',
              fontWeight: 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background 0.15s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <Database size={17} color={isSupabaseActive ? '#34d399' : '#94a3b8'} />
            <span>Database Config</span>
            <span
              style={{
                marginLeft: 'auto',
                fontSize: '0.6875rem',
                color: isSupabaseActive ? '#34d399' : '#94a3b8',
                backgroundColor: isSupabaseActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                padding: '0.1rem 0.45rem',
                borderRadius: 'var(--radius-full)',
              }}
            >
              {isSupabaseActive ? 'Live' : 'Sandbox'}
            </span>
          </button>

          <button
            onClick={onGoToLanding}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              width: '100%',
              padding: '0.6875rem 0.875rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: 'transparent',
              color: '#94a3b8',
              fontWeight: 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background 0.15s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <ArrowLeft size={17} />
            <span>Public Landing Page</span>
          </button>
        </div>

        {/* User Card at Bottom of Sidebar */}
        <div
          style={{
            padding: '1.25rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem' }}>
            <div className="avatar" style={{ width: '2.1rem', height: '2.1rem', fontSize: '0.78125rem' }}>
              {session.fullName.substring(0, 2).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {session.fullName}
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {session.email}
              </div>
            </div>
          </div>
          <button
            onClick={onSignOut}
            className="btn btn-glass btn-sm"
            style={{ width: '100%', fontSize: '0.75rem', justifyContent: 'center' }}
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Top Navbar */}
        <header
          style={{
            height: '4.25rem',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            padding: '0 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 30,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mobile-toggle-btn"
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#0f172a',
                padding: '0.25rem',
              }}
            >
              <Menu size={22} />
            </button>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                Opportunity Pipeline
              </h1>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                {session.isDemo ? 'Running in Offline Sandbox Mode' : 'Connected to Supabase PostgreSQL'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* View Mode Toggle */}
            <div className="view-mode-toggle hide-on-mobile">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`view-mode-btn ${viewMode === 'table' ? 'active' : ''}`}
                title="Switch to Table View"
              >
                <LayoutList size={14} />
                <span>Table</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('kanban')}
                className={`view-mode-btn ${viewMode === 'kanban' ? 'active' : ''}`}
                title="Switch to Kanban Pipeline View"
              >
                <Kanban size={14} />
                <span>Kanban</span>
              </button>
            </div>

            <button
              onClick={handleExportCSV}
              className="btn btn-outline btn-sm hide-on-mobile"
              title="Download RFC-compliant CSV"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
            <button onClick={onAddLead} className="btn btn-primary btn-sm">
              <Plus size={15} />
              <span>Add Lead</span>
            </button>
          </div>
        </header>

        {/* Dashboard Body */}
        <div style={{ padding: '2rem', flex: 1 }}>
          {/* KPI Stat Cards */}
          <div className="grid grid-4 gap-4" style={{ marginBottom: '2rem' }}>
            {/* Total Pipeline Value */}
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.8125rem', fontWeight: 600 }}>
                <span>Total Pipeline Value</span>
                <div style={{ width: '2.1rem', height: '2.1rem', borderRadius: '8px', backgroundColor: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DollarSign size={17} color="#4f46e5" />
                </div>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: '0.375rem' }}>
                ${stats.totalPipelineValue.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px', marginTop: '4px' }}>
                <TrendingUp size={13} /> ${stats.wonValue.toLocaleString()} won revenue
              </div>
            </div>

            {/* Total Leads */}
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.8125rem', fontWeight: 600 }}>
                <span>Active Leads</span>
                <div style={{ width: '2.1rem', height: '2.1rem', borderRadius: '8px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={17} color="#2563eb" />
                </div>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: '0.375rem' }}>
                {stats.total}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                {stats.newCount} new inbounds waiting
              </div>
            </div>

            {/* Qualified Opportunities */}
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.8125rem', fontWeight: 600 }}>
                <span>Proposals in Flight</span>
                <div style={{ width: '2.1rem', height: '2.1rem', borderRadius: '8px', backgroundColor: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={17} color="#7c3aed" />
                </div>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: '0.375rem' }}>
                {stats.qualifiedCount}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                {stats.contactedCount} in discovery call stage
              </div>
            </div>

            {/* Conversion Rate */}
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.8125rem', fontWeight: 600 }}>
                <span>Won Conversion Rate</span>
                <div style={{ width: '2.1rem', height: '2.1rem', borderRadius: '8px', backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={17} color="#10b981" />
                </div>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: '0.375rem' }}>
                {stats.conversionRate}%
              </div>
              <div style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 600, marginTop: '4px' }}>
                {stats.convertedCount} closed contracts
              </div>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            {/* Top row: Search and dropdown filters */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              {/* Search */}
              <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                <Search
                  size={16}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
                />
                <input
                  type="text"
                  placeholder="Search by prospect name, company, email, or scope notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.75rem 0.625rem 2.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.875rem',
                    outline: 'none',
                    backgroundColor: '#ffffff',
                  }}
                />
              </div>

              {/* Source filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>Source:</span>
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value as 'All' | LeadSource)}
                  style={{
                    padding: '0.5625rem 0.875rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.8125rem',
                    color: '#0f172a',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  <option value="All">All Channels</option>
                  <option value="Upwork">Upwork</option>
                  <option value="Fiverr">Fiverr</option>
                  <option value="Website">Portfolio Website</option>
                  <option value="Referral">Client Referral</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Outbound">Outbound</option>
                </select>
              </div>

              {/* Sort by */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  style={{
                    padding: '0.5625rem 0.875rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.8125rem',
                    color: '#0f172a',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  <option value="date-desc">Newest Added First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="value-desc">Highest Deal Value</option>
                  <option value="value-asc">Lowest Deal Value</option>
                  <option value="name-asc">Lead Name (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Bottom row: Status Filter Tabs */}
            <div
              style={{
                display: 'flex',
                gap: '0.375rem',
                borderTop: '1px solid #f1f5f9',
                paddingTop: '0.875rem',
                overflowX: 'auto',
              }}
            >
              {(['All', 'New', 'Contacted', 'Qualified', 'Converted'] as const).map((tab) => {
                const count = tab === 'All' ? leads.length : leads.filter((l) => l.status === tab).length;
                const isActive = statusFilter === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setStatusFilter(tab)}
                    style={{
                      padding: '0.4375rem 0.9375rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      border: '1px solid',
                      borderColor: isActive ? '#4f46e5' : '#e2e8f0',
                      backgroundColor: isActive ? '#4f46e5' : '#ffffff',
                      color: isActive ? '#ffffff' : '#475569',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>{tab}</span>
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        padding: '0.1rem 0.45rem',
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
          </div>

          {/* VIEW MODE: TABLE VIEW */}
          {viewMode === 'table' && (
            <>
              {filteredLeads.length > 0 ? (
                <div className="table-container">
                  <table className="leads-table">
                    <thead>
                      <tr>
                        <th>Lead Name</th>
                        <th>Company</th>
                        <th>Contact</th>
                        <th>Source</th>
                        <th>Deal Value</th>
                        <th>Pipeline Status (Click to Change)</th>
                        <th>Added Date</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeads.map((lead) => (
                        <tr key={lead.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedLeadForDetail(lead)}>
                          {/* Name & Initials */}
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <div className="avatar">
                                {lead.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .substring(0, 2)
                                  .toUpperCase()}
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, color: '#0f172a' }}>{lead.name}</div>
                                {lead.notes && (
                                  <div
                                    style={{
                                      fontSize: '0.75rem',
                                      color: '#64748b',
                                      maxWidth: '220px',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                    }}
                                    title={lead.notes}
                                  >
                                    {lead.notes}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Company */}
                          <td>
                            <span style={{ fontWeight: 500, color: '#334155' }}>
                              {lead.company || 'Independent'}
                            </span>
                          </td>

                          {/* Email */}
                          <td onClick={(e) => e.stopPropagation()}>
                            <a
                              href={`mailto:${lead.email}`}
                              style={{
                                color: '#4f46e5',
                                fontSize: '0.8125rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontWeight: 500,
                              }}
                              title={`Email ${lead.name}`}
                            >
                              <Mail size={13} />
                              <span>{lead.email}</span>
                            </a>
                          </td>

                          {/* Source */}
                          <td>
                            <span className={`badge ${getSourceBadgeClass(lead.source)}`}>
                              {lead.source}
                            </span>
                          </td>

                          {/* Deal Value */}
                          <td>
                            <span style={{ fontWeight: 700, color: '#0f172a' }}>
                              ${lead.deal_value.toLocaleString()}
                            </span>
                          </td>

                          {/* Interactive In-Row Status Dropdown */}
                          <td onClick={(e) => e.stopPropagation()}>
                            <select
                              value={lead.status}
                              onChange={(e) => handleStatusSelect(lead.id, e.target.value as LeadStatus)}
                              style={{
                                padding: '0.28rem 0.65rem',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                outline: 'none',
                                border: '1px solid',
                                ...(lead.status === 'New' && {
                                  backgroundColor: '#eff6ff',
                                  borderColor: '#bfdbfe',
                                  color: '#1d4ed8',
                                }),
                                ...(lead.status === 'Contacted' && {
                                  backgroundColor: '#fffbeb',
                                  borderColor: '#fde68a',
                                  color: '#b45309',
                                }),
                                ...(lead.status === 'Qualified' && {
                                  backgroundColor: '#f5f3ff',
                                  borderColor: '#ddd6fe',
                                  color: '#6d28d9',
                                }),
                                ...(lead.status === 'Converted' && {
                                  backgroundColor: '#ecfdf5',
                                  borderColor: '#a7f3d0',
                                  color: '#047857',
                                }),
                              }}
                            >
                              <option value="New">● New Inbound</option>
                              <option value="Contacted">● Contacted</option>
                              <option value="Qualified">● Qualified (Proposal)</option>
                              <option value="Converted">● Converted (Won 🎉)</option>
                            </select>
                          </td>

                          {/* Date */}
                          <td>
                            <span style={{ fontSize: '0.78125rem', color: '#64748b' }}>
                              {new Date(lead.created_at).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </td>

                          {/* Actions */}
                          <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                              <button
                                onClick={() => setSelectedLeadForDetail(lead)}
                                style={{
                                  background: 'none',
                                  border: '1px solid #e2e8f0',
                                  borderRadius: '6px',
                                  padding: '0.35rem',
                                  cursor: 'pointer',
                                  color: '#475569',
                                }}
                                title="View lead details card"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                onClick={() => onEditLead(lead)}
                                style={{
                                  background: 'none',
                                  border: '1px solid #e2e8f0',
                                  borderRadius: '6px',
                                  padding: '0.35rem',
                                  cursor: 'pointer',
                                  color: '#475569',
                                }}
                                title="Edit prospect details"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => setLeadToDelete(lead)}
                                style={{
                                  background: 'none',
                                  border: '1px solid #fee2e2',
                                  borderRadius: '6px',
                                  padding: '0.35rem',
                                  cursor: 'pointer',
                                  color: '#ef4444',
                                }}
                                title="Delete lead"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState onAddLead={onAddLead} onReset={() => { setSearchTerm(''); setStatusFilter('All'); setSourceFilter('All'); }} isFiltered={Boolean(searchTerm || statusFilter !== 'All' || sourceFilter !== 'All')} />
              )}
            </>
          )}

          {/* VIEW MODE: KANBAN BOARD VIEW */}
          {viewMode === 'kanban' && (
            <div className="kanban-grid">
              {kanbanColumns.map((col) => {
                const columnLeads = filteredLeads.filter((l) => l.status === col.status);
                const columnTotalValue = columnLeads.reduce((acc, curr) => acc + curr.deal_value, 0);

                return (
                  <div key={col.status} className="kanban-column">
                    {/* Column Header */}
                    <div className="kanban-column-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: col.dotColor }} />
                        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>{col.label}</span>
                        <span
                          style={{
                            fontSize: '0.6875rem',
                            fontWeight: 700,
                            backgroundColor: '#e2e8f0',
                            color: '#475569',
                            padding: '0.1rem 0.45rem',
                            borderRadius: 'var(--radius-full)',
                          }}
                        >
                          {columnLeads.length}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.78125rem', fontWeight: 700, color: '#64748b' }}>
                        ${columnTotalValue.toLocaleString()}
                      </span>
                    </div>

                    {/* Cards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {columnLeads.map((lead) => {
                        const nextStage = getNextStage(lead.status);
                        return (
                          <div
                            key={lead.id}
                            className="kanban-card"
                            onClick={() => setSelectedLeadForDetail(lead)}
                          >
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                              <div>
                                <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#0f172a' }}>{lead.name}</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{lead.company || 'Independent'}</div>
                              </div>
                              <span style={{ fontWeight: 800, fontSize: '0.9375rem', color: '#0f172a' }}>
                                ${lead.deal_value.toLocaleString()}
                              </span>
                            </div>

                            {lead.notes && (
                              <p style={{ fontSize: '0.75rem', color: '#475569', lineHeight: 1.4, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {lead.notes}
                              </p>
                            )}

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
                              <span className={`badge ${getSourceBadgeClass(lead.source)}`} style={{ fontSize: '0.6875rem' }}>
                                {lead.source}
                              </span>

                              {nextStage && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusSelect(lead.id, nextStage);
                                  }}
                                  className="btn btn-outline btn-sm"
                                  style={{ fontSize: '0.71875rem', padding: '0.2rem 0.5rem' }}
                                  title={`Advance to ${nextStage}`}
                                >
                                  <span>Move to {nextStage}</span>
                                  <ArrowRight size={11} />
                                </button>
                              )}
                              {!nextStage && (
                                <span style={{ fontSize: '0.71875rem', fontWeight: 700, color: '#10b981' }}>
                                  Deal Won ✓
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {columnLeads.length === 0 && (
                        <div
                          style={{
                            padding: '2rem 1rem',
                            textAlign: 'center',
                            color: '#94a3b8',
                            fontSize: '0.78125rem',
                            border: '1px dashed #cbd5e1',
                            borderRadius: 'var(--radius-md)',
                          }}
                        >
                          No deals in this stage
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Lead Detail Card Modal */}
      {selectedLeadForDetail && (
        <div className="modal-overlay" onClick={() => setSelectedLeadForDetail(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="avatar" style={{ width: '2.5rem', height: '2.5rem', fontSize: '0.9375rem' }}>
                  {selectedLeadForDetail.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                    {selectedLeadForDetail.name}
                  </h3>
                  <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                    {selectedLeadForDetail.company || 'Independent Client'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedLeadForDetail(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Value & Status Banner */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Estimated Budget</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
                    ${selectedLeadForDetail.deal_value.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>Stage</div>
                  <select
                    value={selectedLeadForDetail.status}
                    onChange={(e) => handleStatusSelect(selectedLeadForDetail.id, e.target.value as LeadStatus)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      outline: 'none',
                      border: '1px solid #cbd5e1',
                    }}
                  >
                    <option value="New">● New Inbound</option>
                    <option value="Contacted">● Contacted</option>
                    <option value="Qualified">● Qualified</option>
                    <option value="Converted">● Converted (Won)</option>
                  </select>
                </div>
              </div>

              {/* Information Grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <Mail size={16} color="#64748b" />
                  <span style={{ color: '#64748b', width: '80px' }}>Email:</span>
                  <a href={`mailto:${selectedLeadForDetail.email}`} style={{ color: '#4f46e5', fontWeight: 600 }}>
                    {selectedLeadForDetail.email}
                  </a>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <Tag size={16} color="#64748b" />
                  <span style={{ color: '#64748b', width: '80px' }}>Source:</span>
                  <span className={`badge ${getSourceBadgeClass(selectedLeadForDetail.source)}`}>
                    {selectedLeadForDetail.source}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <Calendar size={16} color="#64748b" />
                  <span style={{ color: '#64748b', width: '80px' }}>Created:</span>
                  <span style={{ color: '#0f172a' }}>
                    {new Date(selectedLeadForDetail.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.375rem' }}>
                  Discovery & Project Notes
                </div>
                <div
                  style={{
                    padding: '0.875rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.875rem',
                    color: '#334155',
                    lineHeight: 1.6,
                    minHeight: '70px',
                  }}
                >
                  {selectedLeadForDetail.notes || 'No specific notes recorded yet.'}
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
              <button
                type="button"
                onClick={() => {
                  const lead = selectedLeadForDetail;
                  setSelectedLeadForDetail(null);
                  setLeadToDelete(lead);
                }}
                className="btn btn-outline btn-sm"
                style={{ color: '#ef4444', borderColor: '#fecaca' }}
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    const lead = selectedLeadForDetail;
                    setSelectedLeadForDetail(null);
                    onEditLead(lead);
                  }}
                  className="btn btn-outline btn-sm"
                >
                  <Edit2 size={14} />
                  <span>Edit Details</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedLeadForDetail(null)}
                  className="btn btn-primary btn-sm"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {leadToDelete && (
        <div className="modal-overlay" onClick={() => setLeadToDelete(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b91c1c' }}>
                <AlertCircle size={20} />
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a' }}>Delete Prospect</h3>
              </div>
              <button
                onClick={() => setLeadToDelete(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '0.9375rem', color: '#475569', lineHeight: 1.6 }}>
                Are you sure you want to remove <strong>{leadToDelete.name}</strong> ({leadToDelete.company || 'Independent'}) from your pipeline? This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button onClick={() => setLeadToDelete(null)} className="btn btn-outline btn-sm">
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteLead(leadToDelete.id);
                  setLeadToDelete(null);
                }}
                className="btn btn-danger btn-sm"
              >
                <Trash2 size={14} />
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const EmptyState: React.FC<{ onAddLead: () => void; onReset: () => void; isFiltered: boolean }> = ({
  onAddLead,
  onReset,
  isFiltered,
}) => (
  <div
    style={{
      backgroundColor: '#ffffff',
      border: '1px dashed #cbd5e1',
      borderRadius: 'var(--radius-xl)',
      padding: '4rem 2rem',
      textAlign: 'center',
    }}
  >
    <div
      style={{
        width: '3.5rem',
        height: '3.5rem',
        borderRadius: '50%',
        backgroundColor: '#f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1.25rem auto',
        color: '#64748b',
      }}
    >
      <Search size={24} />
    </div>
    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
      No matching leads found
    </h3>
    <p style={{ fontSize: '0.9375rem', color: '#64748b', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
      {isFiltered
        ? 'Try clearing your filters or search keywords to view all pipeline leads.'
        : 'Start building your freelance revenue by recording your first prospect.'}
    </p>
    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
      {isFiltered && (
        <button onClick={onReset} className="btn btn-outline btn-sm">
          Reset All Filters
        </button>
      )}
      <button onClick={onAddLead} className="btn btn-primary btn-sm">
        <Plus size={15} />
        <span>Add First Lead</span>
      </button>
    </div>
  </div>
);
