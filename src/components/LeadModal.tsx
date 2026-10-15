import React, { useState, useEffect } from 'react';
import { X, User, Mail, Building2, DollarSign, FileText, CheckCircle2, Sparkles, Tag } from 'lucide-react';
import { Lead, LeadStatus, LeadSource } from '../types';

interface LeadModalProps {
  isOpen: boolean;
  leadToEdit: Lead | null;
  onClose: () => void;
  onSave: (leadData: Omit<Lead, 'id' | 'created_at'>) => void;
}

export const LeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  leadToEdit,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [status, setStatus] = useState<LeadStatus>('New');
  const [source, setSource] = useState<LeadSource>('Upwork');
  const [dealValue, setDealValue] = useState<string>('3000');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (leadToEdit) {
      setName(leadToEdit.name);
      setEmail(leadToEdit.email);
      setCompany(leadToEdit.company || '');
      setStatus(leadToEdit.status);
      setSource(leadToEdit.source);
      setDealValue(leadToEdit.deal_value.toString());
      setNotes(leadToEdit.notes || '');
    } else {
      setName('');
      setEmail('');
      setCompany('');
      setStatus('New');
      setSource('Upwork');
      setDealValue('3500');
      setNotes('');
    }
    setErrors({});
  }, [leadToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Prospect name is required.';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'A valid email is required.';
    const parsedVal = parseFloat(dealValue);
    if (isNaN(parsedVal) || parsedVal < 0) newErrors.dealValue = 'Budget value must be $0 or greater.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      name: name.trim(),
      email: email.trim(),
      company: company.trim() || 'Independent',
      status,
      source,
      deal_value: parseFloat(dealValue) || 0,
      notes: notes.trim(),
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
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
              <User size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#0f172a' }}>
                {leadToEdit ? 'Edit Prospect Details' : 'Add New Client Opportunity'}
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                {leadToEdit ? `Updating ${leadToEdit.name}` : 'Record a new prospective lead in your pipeline'}
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

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {/* Row 1: Name and Email */}
            <div className="grid grid-2 gap-4">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Client Name *</label>
                <div style={{ position: 'relative' }}>
                  <User size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="e.g. Jordan Smith"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ paddingLeft: '2.1rem' }}
                  />
                </div>
                {errors.name && <span className="form-error-msg">{errors.name}</span>}
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Email Address *</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="email"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="jordan@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ paddingLeft: '2.1rem' }}
                  />
                </div>
                {errors.email && <span className="form-error-msg">{errors.email}</span>}
              </div>
            </div>

            {/* Row 2: Company and Estimated Value */}
            <div className="grid grid-2 gap-4">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Company / Brand</label>
                <div style={{ position: 'relative' }}>
                  <Building2 size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Acme Studio, LLC"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    style={{ paddingLeft: '2.1rem' }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Deal Value ($ USD) *</label>
                <div style={{ position: 'relative' }}>
                  <DollarSign size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="number"
                    step="50"
                    className={`form-input ${errors.dealValue ? 'error' : ''}`}
                    placeholder="5000"
                    value={dealValue}
                    onChange={(e) => setDealValue(e.target.value)}
                    style={{ paddingLeft: '2.1rem' }}
                  />
                </div>
                {errors.dealValue && <span className="form-error-msg">{errors.dealValue}</span>}
              </div>
            </div>

            {/* Row 3: Pipeline Status and Source */}
            <div className="grid grid-2 gap-4">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Pipeline Status</label>
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as LeadStatus)}
                >
                  <option value="New">New Inbound</option>
                  <option value="Contacted">Contacted (Discovery)</option>
                  <option value="Qualified">Qualified (Proposal Sent)</option>
                  <option value="Converted">Converted (Deal Won 🎉)</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Acquisition Channel</label>
                <select
                  className="form-select"
                  value={source}
                  onChange={(e) => setSource(e.target.value as LeadSource)}
                >
                  <option value="Upwork">Upwork</option>
                  <option value="Fiverr">Fiverr</option>
                  <option value="Website">Portfolio Website</option>
                  <option value="Referral">Client Referral</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Outbound">Outbound Prospecting</option>
                </select>
              </div>
            </div>

            {/* Row 4: Notes and Scope */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                <span>Discovery Notes & Project Scope</span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Optional</span>
              </label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Key deliverables, timeline expectations, tech stack requirements, or client feedback..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-outline btn-sm">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              <CheckCircle2 size={15} />
              <span>{leadToEdit ? 'Save Changes' : 'Add to Pipeline'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
