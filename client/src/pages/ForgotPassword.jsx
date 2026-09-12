import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from '../components/Toast';
import { Mail, ArrowLeft, KeyRound, Copy, Check } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetData, setResetData] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter email');

    setIsSubmitting(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setResetData(res.data);
      toast.success('Reset link generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initiate password reset');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    if (!resetData) return;
    const url = resetData.resetUrl;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Reset URL copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 py-12 animate-fade-in">
      <div className="max-w-md w-full p-8 rounded-3xl glass shadow-xl border border-slate-100 dark:border-slate-800 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-4xl">🔑</span>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
            Forgot Password
          </h2>
          <p className="text-sm text-slate-400">
            Enter your email and we'll generate a password reset link for you.
          </p>
        </div>

        {!resetData ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                  <Mail className="h-4.5 w-4.5" />
                </span>
                <input
                  type="email"
                  placeholder="mario@recipebox.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950/40 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 shadow-md hover:shadow-brand-500/10 active:scale-[0.98]"
            >
              <KeyRound className="h-5 w-5" />
              <span>{isSubmitting ? 'Requesting...' : 'Generate Reset Link'}</span>
            </button>
          </form>
        ) : (
          <div className="space-y-4 bg-slate-50 dark:bg-slate-950/60 p-5 rounded-2xl border border-slate-100 dark:border-slate-850">
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              ✔ Reset Link Generated
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              In production, an email is sent to your address. For local sandbox testing, copy the link below or click it directly to update your credentials:
            </p>
            
            <div className="flex gap-2 items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5">
              <span className="text-xs text-slate-600 dark:text-slate-350 truncate flex-1 font-mono">
                {resetData.resetUrl}
              </span>
              <button
                onClick={copyToClipboard}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                title="Copy Reset URL"
              >
                {copied ? <Check className="h-4.5 w-4.5 text-emerald-500" /> : <Copy className="h-4.5 w-4.5" />}
              </button>
            </div>

            <Link
              to={`/reset-password/${resetData.resetToken}`}
              className="block w-full text-center py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors shadow-md shadow-emerald-500/10 text-sm"
            >
              Go to Reset Form
            </Link>
          </div>
        )}

        <div className="text-center pt-2">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-850 dark:hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
