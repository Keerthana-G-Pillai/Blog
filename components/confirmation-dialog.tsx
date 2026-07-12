'use client';

import { useEffect, useRef, useCallback } from 'react';
import { AlertTriangle } from 'lucide-react';

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  isDestructive?: boolean;
}

export function ConfirmationDialog({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  confirmLabel = 'Confirm',
  isDestructive = false,
}: ConfirmationDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    },
    [onCancel]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    cancelRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKey]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(4px)' }}
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-desc"
        className="relative z-10 w-full max-w-sm rounded-2xl p-6"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        {/* Icon */}
        {isDestructive && (
          <div
            className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
            style={{ background: 'rgba(239,68,68,0.08)' }}
          >
            <AlertTriangle className="h-6 w-6" style={{ color: 'var(--color-danger)' }} />
          </div>
        )}

        <h2 id="dialog-title" className="text-base font-bold text-center mb-2"
          style={{ color: 'var(--text-primary)' }}>
          {title}
        </h2>
        <p id="dialog-desc" className="text-sm text-center mb-6"
          style={{ color: 'var(--text-secondary)' }}>
          {message}
        </p>

        <div className="flex gap-3">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: 'var(--bg-elevated)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-default)',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={isDestructive ? {
              background: 'rgba(239,68,68,0.08)',
              color: '#EF4444',
              border: '1px solid rgba(239,68,68,0.2)',
            } : {
              background: 'var(--accent)',
              color: '#fff',
              border: '1px solid transparent',
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
