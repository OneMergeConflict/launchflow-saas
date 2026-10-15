import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => {
        let icon = <CheckCircle2 size={18} color="#10b981" />;
        let toastClass = 'toast toast-success';

        if (toast.type === 'error') {
          icon = <AlertCircle size={18} color="#ef4444" />;
          toastClass = 'toast toast-error';
        } else if (toast.type === 'info') {
          icon = <Info size={18} color="#6366f1" />;
          toastClass = 'toast toast-info';
        }

        return (
          <div key={toast.id} className={toastClass} role="alert">
            <div style={{ flexShrink: 0, marginTop: '2px' }}>{icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0f172a' }}>{toast.title}</div>
              {toast.message && (
                <div style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '2px', wordBreak: 'break-word' }}>
                  {toast.message}
                </div>
              )}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#94a3b8',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
              }}
              aria-label="Dismiss notification"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
