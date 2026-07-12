'use client';

import { useState } from 'react';
import { X, Mail, Lock, User, ShieldCheck } from 'lucide-react';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userName: string) => void;
}

export function SignInModal({ isOpen, onClose, onSuccess }: SignInModalProps) {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }
    if (tab === 'signup' && !name.trim()) {
      setError('Name is required');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess(tab === 'signin' ? email.split('@')[0] : name);
      onClose();
      // Reset form
      setName('');
      setEmail('');
      setPassword('');
    }, 1000);
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: 600,
    marginBottom: '0.375rem',
    color: 'var(--text-secondary)',
  };

  const inputContainerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  };

  const inputStyle: React.CSSProperties = {
    background: 'var(--bg-input)',
    border: '1px solid var(--border-default)',
    color: 'var(--text-primary)',
    borderRadius: 'var(--radius-md)',
    outline: 'none',
    width: '100%',
    padding: '0.625rem 0.875rem 0.625rem 2.25rem',
    fontSize: '0.8125rem',
    boxShadow: 'var(--shadow-sm)',
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className="relative w-full max-w-[380px] mx-4 rounded-2xl overflow-hidden border shadow-2xl animate-in fade-in zoom-in-95 duration-150"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
      >
        {/* Header / Tabs */}
        <div className="flex border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <button
            onClick={() => { setTab('signin'); setError(null); }}
            className="flex-1 py-3 text-xs font-bold transition-colors"
            style={{
              color: tab === 'signin' ? 'var(--accent)' : 'var(--text-muted)',
              borderBottom: tab === 'signin' ? '2px solid var(--accent)' : 'none',
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab('signup'); setError(null); }}
            className="flex-1 py-3 text-xs font-bold transition-colors"
            style={{
              color: tab === 'signup' ? 'var(--accent)' : 'var(--text-muted)',
              borderBottom: tab === 'signup' ? '2px solid var(--accent)' : 'none',
            }}
          >
            Sign Up
          </button>
          <button
            onClick={onClose}
            aria-label="Close"
            className="px-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="text-center pb-2">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 mb-2">
              <ShieldCheck className="h-5.5 w-5.5" />
            </div>
            <h2 className="text-sm font-extrabold" style={{ color: 'var(--text-primary)' }}>
              {tab === 'signin' ? 'Welcome back to InkVerse' : 'Create your InkVerse account'}
            </h2>
          </div>

          {error && (
            <div className="text-center text-xs font-semibold" style={{ color: 'var(--color-danger)' }}>
              {error}
            </div>
          )}

          {/* Name (Sign Up only) */}
          {tab === 'signup' && (
            <div>
              <label htmlFor="auth-name" style={labelStyle}>Full Name *</label>
              <div style={inputContainerStyle}>
                <User className="absolute left-3 h-4 w-4 text-gray-400" />
                <input
                  id="auth-name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="auth-email" style={labelStyle}>Email Address *</label>
            <div style={inputContainerStyle}>
              <Mail className="absolute left-3 h-4 w-4 text-gray-400" />
              <input
                id="auth-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="auth-password" style={labelStyle}>Password *</label>
            <div style={inputContainerStyle}>
              <Lock className="absolute left-3 h-4 w-4 text-gray-400" />
              <input
                id="auth-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full justify-center py-2 text-xs font-bold disabled:opacity-60"
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            {isLoading ? 'Processing…' : tab === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
