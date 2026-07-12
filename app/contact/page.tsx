'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquareText } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    // Simulate form submission
    setSubmitted(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.8125rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
    color: 'var(--text-primary)',
  };

  const inputStyle: React.CSSProperties = {
    background: 'var(--bg-input)',
    border: '1px solid var(--border-default)',
    color: 'var(--text-primary)',
    borderRadius: 'var(--radius-lg)',
    outline: 'none',
    width: '100%',
    padding: '0.875rem 1rem',
    fontSize: '0.875rem',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    boxShadow: 'var(--shadow-sm)',
  };

  return (
    <div className="mx-auto max-w-[1000px] px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <header className="mb-10 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
          <MessageSquareText className="h-5 w-5" style={{ color: 'var(--accent)' }} />
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
            Get in Touch
          </span>
        </div>
        <h1 className="text-3xl font-extrabold mb-3" style={{ color: 'var(--text-primary)' }}>
          Contact Us
        </h1>
        <p className="text-sm max-w-md" style={{ color: 'var(--text-muted)' }}>
          Have any questions, feedback, or suggestions? We would love to hear from you.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Info panel: spans 2 */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl p-6 border" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-card)' }}>
            <h3 className="font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>Contact Information</h3>
            <p className="text-xs leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
              Feel free to reach out via email, phone, or by visiting our headquarters. We try to respond to all inquiries within 24 hours.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Email Us</p>
                  <a href="mailto:hello@inkverse.dev" className="text-xs hover:underline" style={{ color: 'var(--text-secondary)' }}>hello@inkverse.dev</a>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400">
                  <Phone className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Call Us</p>
                  <a href="tel:+1234567890" className="text-xs hover:underline" style={{ color: 'var(--text-secondary)' }}>+1 (234) 567-890</a>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400">
                  <MapPin className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Visit Us</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>120 Innovation Way, Suite 400, San Francisco, CA</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form: spans 3 */}
        <div className="lg:col-span-3">
          {submitted ? (
            <div
              className="rounded-2xl p-8 border text-center space-y-3"
              style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-card)' }}
            >
              <div className="text-4xl">✉️</div>
              <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Message Sent Successfully!</h3>
              <p className="text-xs max-w-sm mx-auto" style={{ color: 'var(--text-secondary)' }}>
                Thank you for getting in touch. One of our team members will review your message and reply as soon as possible.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="btn-ghost py-2 px-5 text-xs mt-2"
                style={{ borderRadius: 'var(--radius-md)' }}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl p-6 border" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-card)' }}>
              <h3 className="font-bold text-base mb-2" style={{ color: 'var(--text-primary)' }}>Send Us a Message</h3>

              {error && (
                <div className="text-xs font-semibold" style={{ color: 'var(--color-danger)' }}>
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" style={labelStyle}>Your Name *</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" style={labelStyle}>Email Address *</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" style={labelStyle}>Subject</label>
                <input
                  id="contact-subject"
                  type="text"
                  placeholder="How can we help you?"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label htmlFor="contact-message" style={labelStyle}>Message *</label>
                <textarea
                  id="contact-message"
                  rows={5}
                  required
                  placeholder="Tell us what you're thinking…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-2.5 justify-center text-sm"
                style={{ borderRadius: 'var(--radius-lg)' }}
              >
                <Send className="h-4 w-4" />
                Submit Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
