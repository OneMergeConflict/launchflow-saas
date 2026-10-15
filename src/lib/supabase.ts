import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Lead, UserSession } from '../types';
import { SEED_LEADS } from '../data/seedLeads';

const STORAGE_KEYS = {
  CONFIG_URL: 'launchflow_supabase_url',
  CONFIG_KEY: 'launchflow_supabase_anon_key',
  LOCAL_LEADS: 'launchflow_local_leads_v1',
  LOCAL_SIGNUPS: 'launchflow_early_signups_v1',
  LOCAL_SESSION: 'launchflow_user_session_v1',
};

// Retrieve configuration from env or local storage override
export function getSupabaseConfig(): { url: string; anonKey: string; isCustom: boolean } {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  const storedUrl = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.CONFIG_URL) || '' : '';
  const storedKey = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.CONFIG_KEY) || '' : '';

  const url = storedUrl || envUrl;
  const anonKey = storedKey || envKey;

  return {
    url,
    anonKey,
    isCustom: Boolean(storedUrl || storedKey),
  };
}

export function saveSupabaseConfig(url: string, anonKey: string): boolean {
  // Security safeguard: Never accept service_role keys
  if (anonKey.includes('service_role') || (anonKey.startsWith('ey') && atob(anonKey.split('.')[1] || '').includes('service_role'))) {
    throw new Error('Security Error: Service-role or secret keys must NEVER be exposed in the frontend client. Please use only your public publishable (anon) key.');
  }

  if (url && anonKey) {
    localStorage.setItem(STORAGE_KEYS.CONFIG_URL, url.trim());
    localStorage.setItem(STORAGE_KEYS.CONFIG_KEY, anonKey.trim());
    // Reinitialize client
    supabaseClientInstance = createClient(url.trim(), anonKey.trim());
    return true;
  } else {
    localStorage.removeItem(STORAGE_KEYS.CONFIG_URL);
    localStorage.removeItem(STORAGE_KEYS.CONFIG_KEY);
    supabaseClientInstance = null;
    return false;
  }
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(url && anonKey && url.startsWith('http'));
}

// Lazy client instance
let supabaseClientInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClientInstance) return supabaseClientInstance;
  const { url, anonKey } = getSupabaseConfig();
  if (url && anonKey && url.startsWith('http')) {
    try {
      supabaseClientInstance = createClient(url, anonKey);
      return supabaseClientInstance;
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return null;
}

// -------------------------------------------------------------
// LOCAL STORAGE STORE (SANDBOX FALLBACK)
// -------------------------------------------------------------
function getLocalLeads(): Lead[] {
  if (typeof window === 'undefined') return SEED_LEADS;
  const raw = localStorage.getItem(STORAGE_KEYS.LOCAL_LEADS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.LOCAL_LEADS, JSON.stringify(SEED_LEADS));
    return SEED_LEADS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return SEED_LEADS;
  }
}

function saveLocalLeads(leads: Lead[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.LOCAL_LEADS, JSON.stringify(leads));
  }
}

// -------------------------------------------------------------
// LEADS API (SUPABASE FIRST, FALLBACK TO SECURE LOCAL SANDBOX)
// -------------------------------------------------------------
export async function apiFetchLeads(userId?: string): Promise<{ data: Lead[]; source: 'supabase' | 'local'; error?: string }> {
  const client = getSupabaseClient();
  if (client) {
    try {
      let query = client.from('leads').select('*').order('created_at', { ascending: false });
      if (userId && !userId.startsWith('demo') && !userId.startsWith('user_')) {
        query = query.or(`user_id.eq.${userId},user_id.is.null`);
      }
      const { data, error } = await query;
      if (error) {
        console.warn('Supabase fetch leads error, falling back to local data:', error.message);
        return { data: getLocalLeads(), source: 'local', error: error.message };
      }
      if (data && data.length > 0) {
        return { data: data as Lead[], source: 'supabase' };
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Unknown network error';
      return { data: getLocalLeads(), source: 'local', error: errMsg };
    }
  }

  // Local storage mode
  return { data: getLocalLeads(), source: 'local' };
}

export async function apiCreateLead(leadData: Omit<Lead, 'id' | 'created_at'>, userId?: string): Promise<{ data: Lead; source: 'supabase' | 'local' }> {
  const client = getSupabaseClient();
  const validUserId = (userId && !userId.startsWith('demo') && !userId.startsWith('user_')) ? userId : null;

  if (client) {
    try {
      const { data, error } = await client
        .from('leads')
        .insert([{
          user_id: validUserId,
          name: leadData.name,
          email: leadData.email,
          company: leadData.company,
          status: leadData.status,
          source: leadData.source,
          deal_value: leadData.deal_value,
          notes: leadData.notes || '',
        }])
        .select()
        .single();

      if (!error && data) {
        return { data: data as Lead, source: 'supabase' };
      }
      console.warn('Supabase insert failed, saving locally:', error?.message);
    } catch (err) {
      console.warn('Supabase client error during insert:', err);
    }
  }

  // Local fallback
  const newLeadObj: Lead = {
    ...leadData,
    id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    user_id: userId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  const current = getLocalLeads();
  const updated = [newLeadObj, ...current];
  saveLocalLeads(updated);
  return { data: newLeadObj, source: 'local' };
}

export async function apiUpdateLead(id: string, updates: Partial<Lead>): Promise<{ success: boolean; source: 'supabase' | 'local' }> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const payload: Record<string, unknown> = {
        ...updates,
        updated_at: new Date().toISOString(),
      };
      delete payload.id;

      const { error } = await client
        .from('leads')
        .update(payload)
        .eq('id', id);

      if (!error) {
        return { success: true, source: 'supabase' };
      }
      console.warn('Supabase update failed:', error.message);
    } catch (err) {
      console.warn('Supabase client error during update:', err);
    }
  }

  // Local update
  const current = getLocalLeads();
  const next = current.map(item => (item.id === id ? { ...item, ...updates, updated_at: new Date().toISOString() } : item));
  saveLocalLeads(next);
  return { success: true, source: 'local' };
}

export async function apiDeleteLead(id: string): Promise<{ success: boolean; source: 'supabase' | 'local' }> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { error } = await client
        .from('leads')
        .delete()
        .eq('id', id);

      if (!error) {
        return { success: true, source: 'supabase' };
      }
      console.warn('Supabase delete failed:', error.message);
    } catch (err) {
      console.warn('Supabase client error during delete:', err);
    }
  }

  // Local delete
  const current = getLocalLeads();
  const next = current.filter(item => item.id !== id);
  saveLocalLeads(next);
  return { success: true, source: 'local' };
}

// -------------------------------------------------------------
// EARLY ACCESS SUBMISSION (PUBLIC SAFE INSERT)
// -------------------------------------------------------------
export async function apiSubmitEarlyAccess(email: string): Promise<{ success: boolean; isDuplicate: boolean; message: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const client = getSupabaseClient();

  if (client) {
    try {
      const { error } = await client
        .from('early_access_signups')
        .insert([{ email: normalizedEmail }]);

      if (!error) {
        return { success: true, isDuplicate: false, message: '🎉 You have successfully joined the early access VIP list!' };
      }

      // Check unique constraint code (Postgres 23505)
      if (error.code === '23505' || error.message.toLowerCase().includes('duplicate') || error.message.toLowerCase().includes('unique')) {
        return { success: true, isDuplicate: true, message: 'You are already on our early-access list! We will reach out shortly.' };
      }

      console.warn('Supabase early-access error:', error.message);
    } catch (err) {
      console.warn('Supabase early-access exception:', err);
    }
  }

  // Local fallback
  const rawSignups = localStorage.getItem(STORAGE_KEYS.LOCAL_SIGNUPS);
  const signups: string[] = rawSignups ? JSON.parse(rawSignups) : [];

  if (signups.includes(normalizedEmail)) {
    return { success: true, isDuplicate: true, message: 'You are already on our early-access list! We will reach out shortly.' };
  }

  signups.push(normalizedEmail);
  localStorage.setItem(STORAGE_KEYS.LOCAL_SIGNUPS, JSON.stringify(signups));
  return { success: true, isDuplicate: false, message: '🎉 You have successfully joined the early access VIP list!' };
}

// -------------------------------------------------------------
// AUTHENTICATION (SUPABASE AUTH + DEMO SESSION)
// -------------------------------------------------------------
export async function apiSignUp(email: string, password: string, fullName: string): Promise<{ session: UserSession | null; error?: string }> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        return { session: null, error: error.message };
      }

      if (data.user) {
        const session: UserSession = {
          id: data.user.id,
          email: data.user.email || email,
          fullName: fullName || data.user.email?.split('@')[0] || 'User',
          isDemo: false,
        };
        localStorage.setItem(STORAGE_KEYS.LOCAL_SESSION, JSON.stringify(session));
        return { session };
      }
    } catch (err) {
      return { session: null, error: err instanceof Error ? err.message : 'Sign up failed' };
    }
  }

  // Fallback demo signup
  const demoSession: UserSession = {
    id: `user_${Date.now()}`,
    email,
    fullName: fullName || email.split('@')[0],
    isDemo: true,
  };
  localStorage.setItem(STORAGE_KEYS.LOCAL_SESSION, JSON.stringify(demoSession));
  return { session: demoSession };
}

export async function apiSignIn(email: string, password: string): Promise<{ session: UserSession | null; error?: string }> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { session: null, error: error.message };
      }

      if (data.user) {
        const session: UserSession = {
          id: data.user.id,
          email: data.user.email || email,
          fullName: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
          isDemo: false,
        };
        localStorage.setItem(STORAGE_KEYS.LOCAL_SESSION, JSON.stringify(session));
        return { session };
      }
    } catch (err) {
      return { session: null, error: err instanceof Error ? err.message : 'Sign in failed' };
    }
  }

  // Demo fallback
  const demoSession: UserSession = {
    id: `demo_${Date.now()}`,
    email,
    fullName: email.split('@')[0] || 'Demo Freelancer',
    isDemo: true,
  };
  localStorage.setItem(STORAGE_KEYS.LOCAL_SESSION, JSON.stringify(demoSession));
  return { session: demoSession };
}

export async function apiSignOut(): Promise<void> {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.auth.signOut();
    } catch (err) {
      console.warn('Supabase sign out error:', err);
    }
  }
  localStorage.removeItem(STORAGE_KEYS.LOCAL_SESSION);
}

export function getStoredSession(): UserSession | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(STORAGE_KEYS.LOCAL_SESSION);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
