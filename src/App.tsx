import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Workflow } from './components/Workflow';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { EarlyAccessForm } from './components/EarlyAccessForm';
import { Footer } from './components/Footer';
import { DashboardView } from './components/DashboardView';
import { AuthModal } from './components/AuthModal';
import { LeadModal } from './components/LeadModal';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { CheckoutModal } from './components/CheckoutModal';
import { ToastContainer } from './components/Toast';

import { 
  apiFetchLeads, 
  apiCreateLead, 
  apiUpdateLead, 
  apiDeleteLead, 
  apiSignOut, 
  getStoredSession, 
  isSupabaseConfigured 
} from './lib/supabase';
import { Lead, LeadStatus, UserSession, ToastMessage } from './types';

export const App: React.FC = () => {
  // Navigation & View State
  const [currentView, setCurrentView] = useState<'landing' | 'app'>('landing');

  // Authentication State
  const [session, setSession] = useState<UserSession | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

  // Lead Data State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);

  // Modals
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [supabaseModalOpen, setSupabaseModalOpen] = useState(false);
  const [isSupabaseActive, setIsSupabaseActive] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: number }>({ name: 'Professional', price: 24 });

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initial Load & Auth verification
  useEffect(() => {
    const existingSession = getStoredSession();
    if (existingSession) {
      setSession(existingSession);
    }
    setIsSupabaseActive(isSupabaseConfigured());
    loadLeads(existingSession?.id);
  }, []);

  const loadLeads = async (userId?: string) => {
    setLoadingLeads(true);
    try {
      const res = await apiFetchLeads(userId);
      setLeads(res.data);
      if (res.source === 'supabase') {
        setIsSupabaseActive(true);
      }
    } catch {
      addToast('error', 'Failed to load leads', 'Falling back to local storage sandbox.');
    } finally {
      setLoadingLeads(false);
    }
  };

  // Auth Handlers
  const handleOpenAuth = (mode: 'signin' | 'signup') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (newSession: UserSession) => {
    setSession(newSession);
    setCurrentView('app');
    loadLeads(newSession.id);
    addToast('success', 'Welcome to LaunchFlow!', `Signed in as ${newSession.fullName}`);
  };

  const handleSignOut = async () => {
    await apiSignOut();
    setSession(null);
    setCurrentView('landing');
    addToast('info', 'Signed Out', 'You have been safely signed out.');
  };

  // Leads CRUD Handlers
  const handleOpenAddLead = () => {
    setEditingLead(null);
    setLeadModalOpen(true);
  };

  const handleOpenEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setLeadModalOpen(true);
  };

  const handleSaveLead = async (leadData: Omit<Lead, 'id' | 'created_at'>) => {
    if (editingLead) {
      // Update
      const res = await apiUpdateLead(editingLead.id, leadData);
      setLeads((prev) =>
        prev.map((item) => (item.id === editingLead.id ? { ...item, ...leadData, updated_at: new Date().toISOString() } : item))
      );
      addToast('success', 'Lead Updated', `${leadData.name} details have been saved.`);
    } else {
      // Create
      const res = await apiCreateLead(leadData, session?.id);
      setLeads((prev) => [res.data, ...prev]);
      addToast('success', 'Lead Added to Pipeline', `${leadData.name} ($${leadData.deal_value.toLocaleString()}) recorded.`);
    }
  };

  const handleDeleteLead = async (id: string) => {
    const lead = leads.find((l) => l.id === id);
    await apiDeleteLead(id);
    setLeads((prev) => prev.filter((l) => l.id !== id));
    addToast('info', 'Lead Removed', `${lead ? lead.name : 'Prospect'} was removed from your pipeline.`);
  };

  const handleStatusChange = async (id: string, newStatus: LeadStatus) => {
    await apiUpdateLead(id, { status: newStatus });
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: newStatus, updated_at: new Date().toISOString() } : l))
    );
    if (newStatus === 'Converted') {
      addToast('success', 'Deal Won & Converted! 🎉', 'Revenue added to closed contracts.');
    } else {
      addToast('info', 'Status Updated', `Moved to stage: ${newStatus}`);
    }
  };

  const handleSupabaseConfigChanged = () => {
    const active = isSupabaseConfigured();
    setIsSupabaseActive(active);
    loadLeads(session?.id);
    addToast('info', 'Database Config Updated', active ? 'Connected to live Supabase PostgreSQL' : 'Switched to browser sandbox');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Manager */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Main Views */}
      {currentView === 'landing' ? (
        <>
          <Navbar
            session={session}
            onOpenAuth={handleOpenAuth}
            onGoToApp={() => setCurrentView('app')}
            onGoToLanding={() => setCurrentView('landing')}
            onOpenSupabaseConfig={() => setSupabaseModalOpen(true)}
            isSupabaseActive={isSupabaseActive}
          />
          <Hero
            onStartFree={() => handleOpenAuth('signup')}
            onExploreDemo={() => {
              if (!session) {
                // Auto login as demo
                const demoSession: UserSession = {
                  id: 'demo-freelancer-session',
                  email: 'alex@launchflow-demo.io',
                  fullName: 'Alex Vance (Freelance Designer)',
                  isDemo: true,
                };
                setSession(demoSession);
              }
              setCurrentView('app');
            }}
          />
          <Features />
          <Workflow />
          <Pricing
            onSelectPlan={(plan, price) => {
              if (price === 0) {
                handleOpenAuth('signup');
              } else {
                setSelectedPlan({ name: plan, price });
                setCheckoutModalOpen(true);
              }
            }}
          />
          <FAQ />
          <EarlyAccessForm onSuccessToast={(msg) => addToast('success', 'Early Access Reserved', msg)} />
          <Footer
            onGoToLanding={() => setCurrentView('landing')}
            onOpenAuth={handleOpenAuth}
            onOpenSupabaseConfig={() => setSupabaseModalOpen(true)}
          />
        </>
      ) : (
        /* Authenticated Dashboard View */
        <DashboardView
          session={session || { id: 'guest', email: 'guest@launchflow.io', fullName: 'Demo Freelancer', isDemo: true }}
          leads={leads}
          onAddLead={handleOpenAddLead}
          onEditLead={handleOpenEditLead}
          onDeleteLead={handleDeleteLead}
          onStatusChange={handleStatusChange}
          onSignOut={handleSignOut}
          onGoToLanding={() => setCurrentView('landing')}
          onOpenSupabaseConfig={() => setSupabaseModalOpen(true)}
          isSupabaseActive={isSupabaseActive}
        />
      )}

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      <LeadModal
        isOpen={leadModalOpen}
        leadToEdit={editingLead}
        onClose={() => setLeadModalOpen(false)}
        onSave={handleSaveLead}
      />

      <CheckoutModal
        isOpen={checkoutModalOpen}
        planName={selectedPlan.name}
        price={selectedPlan.price}
        onClose={() => setCheckoutModalOpen(false)}
        onSuccess={() => {
          setCheckoutModalOpen(false);
          addToast('success', 'Subscription Activated! 🎉', `Welcome to LaunchFlow ${selectedPlan.name}. Full access unlocked.`);
          if (!session) {
            setSession({
              id: 'paid-subscriber-session',
              email: 'pro-member@launchflow.io',
              fullName: 'Pro Subscriber',
              isDemo: false,
            });
          }
          setCurrentView('app');
        }}
      />

      <SupabaseConfigModal
        isOpen={supabaseModalOpen}
        onClose={() => setSupabaseModalOpen(false)}
        onConfigChanged={handleSupabaseConfigChanged}
      />
    </div>
  );
};

export default App;
