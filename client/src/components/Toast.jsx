import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export const toast = {
  success: (msg) => window.dispatchEvent(new CustomEvent('toast', { detail: { msg, type: 'success' } })),
  error: (msg) => window.dispatchEvent(new CustomEvent('toast', { detail: { msg, type: 'error' } })),
  warning: (msg) => window.dispatchEvent(new CustomEvent('toast', { detail: { msg, type: 'warning' } })),
  info: (msg) => window.dispatchEvent(new CustomEvent('toast', { detail: { msg, type: 'info' } })),
};

export default function Toast() {
  const [activeToast, setActiveToast] = useState(null);

  useEffect(() => {
    const handleToast = (e) => {
      const { msg, type } = e.detail;
      setActiveToast({ msg, type, id: Date.now() });
    };

    window.addEventListener('toast', handleToast);
    return () => window.removeEventListener('toast', handleToast);
  }, []);

  useEffect(() => {
    if (!activeToast) return;
    const timer = setTimeout(() => {
      setActiveToast(null);
    }, 4000);

    return () => clearTimeout(timer);
  }, [activeToast]);

  if (!activeToast) return null;

  const bgStyles = {
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/40',
    error: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/40',
    warning: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/40',
    info: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/40',
  };

  const Icons = {
    success: <CheckCircle className="h-5 w-5 text-emerald-500" />,
    error: <XCircle className="h-5 w-5 text-rose-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in max-w-sm w-full">
      <div className={`flex items-center gap-3 p-4 rounded-xl border glass shadow-lg ${bgStyles[activeToast.type]}`}>
        <div>{Icons[activeToast.type]}</div>
        <div className="flex-1 text-sm font-medium">{activeToast.msg}</div>
        <button
          onClick={() => setActiveToast(null)}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
