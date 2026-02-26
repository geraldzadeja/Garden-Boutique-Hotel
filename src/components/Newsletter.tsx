'use client';

import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Something went wrong');
      }

      setStatus('success');
      setMessage('You\'re subscribed! Welcome aboard.');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  return (
    <section className="py-12 md:py-14 px-4 bg-gradient-to-br from-sage-600 to-sage-700">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-white/70 text-[10px] tracking-[0.35em] uppercase mb-3 font-medium">Stay Connected</p>
        <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-serif mb-3 leading-[1.2] text-white">
          Join Our Newsletter
        </h2>
        <p className="text-[14px] text-white/70 leading-[1.7] font-light mb-6 max-w-lg mx-auto">
          Be the first to hear about exclusive offers, seasonal packages, and curated experiences at Garden Boutique Hotel.
        </p>

        {status === 'success' ? (
          <p className="text-[14px] text-white font-medium">{message}</p>
        ) : (
          <>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-5 py-3 border border-white/30 bg-white/10 text-[13px] text-white font-light placeholder:text-white/50 focus:outline-none focus:border-white/60 transition-colors rounded-sm"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-8 py-3 bg-white hover:bg-white/90 text-[#873260] text-[11px] font-medium tracking-[0.2em] uppercase transition-colors rounded-sm whitespace-nowrap disabled:opacity-50"
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            {status === 'error' && (
              <p className="text-[12px] text-red-300 mt-3 font-light">{message}</p>
            )}
          </>
        )}

        <p className="text-[11px] text-white/40 mt-4 font-light">No spam, ever. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}
