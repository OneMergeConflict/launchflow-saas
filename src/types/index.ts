export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Converted';

export type LeadSource = 'Upwork' | 'Fiverr' | 'Website' | 'Referral' | 'LinkedIn' | 'Outbound';

export interface Lead {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  company: string;
  status: LeadStatus;
  source: LeadSource;
  deal_value: number;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface LeadStats {
  total: number;
  newCount: number;
  contactedCount: number;
  qualifiedCount: number;
  convertedCount: number;
  conversionRate: number;
  totalPipelineValue: number;
  wonValue: number;
}

export interface EarlyAccessSubmission {
  id: string;
  email: string;
  created_at: string;
}

export interface UserSession {
  id: string;
  email: string;
  fullName: string;
  isDemo?: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}
