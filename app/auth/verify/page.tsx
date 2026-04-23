'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams?.get('email') || '';
  const tokenFromQuery = searchParams?.get('token') || '';

  const [email, setEmail] = useState(emailFromQuery);
  const [token, setToken] = useState(tokenFromQuery);
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (emailFromQuery && tokenFromQuery) {
      handleVerify(emailFromQuery, tokenFromQuery);
    }
  }, [emailFromQuery, tokenFromQuery]);

  async function handleVerify(currentEmail: string, currentToken: string) {
    setStatus('verifying');
    setMessage('Verifying your email...');

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentEmail, token: currentToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus('error');
        setMessage(data.message || 'Verification failed. Please try again.');
        return;
      }

      setStatus('success');
      setMessage(data.message || 'Email verified successfully. You can now log in.');
      setTimeout(() => {
        router.push('/auth/login');
      }, 1800);
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
      setMessage('Unable to verify right now. Please try again later.');
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !token) {
      setStatus('error');
      setMessage('Both email and verification token are required.');
      return;
    }
    await handleVerify(email, token);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white border-4 border-zinc-900 p-8"
      >
        <div className="text-center mb-8 pb-6 border-b-2 border-zinc-900">
          <h1 className="text-4xl font-serif font-black text-rose-950 mb-2">
            लोकसेवा मित्र
          </h1>
          <div className="flex items-center justify-center gap-2">
            <div className="flex-1 h-px bg-rose-950/20"></div>
            <span className="text-xs font-mono font-black text-rose-900 uppercase tracking-[0.2em]">
              Email Verification
            </span>
            <div className="flex-1 h-px bg-rose-950/20"></div>
          </div>
        </div>

        {status === 'success' && (
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-700 text-green-900 text-sm font-mono">
            ✓ {message}
          </div>
        )}

        {status === 'error' && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-700 text-red-900 text-sm font-mono">
            ✗ {message}
          </div>
        )}

        {status === 'verifying' && (
          <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-700 text-blue-900 text-sm font-mono">
            {message}
          </div>
        )}

        <div className="mb-6 text-sm text-zinc-700 leading-relaxed">
          <p>If the automatic verification link did not work, paste your email and the verification token from your email below.</p>
          <p className="mt-3 text-xs text-zinc-500">
            You can also use the same link that was sent to your inbox to complete verification automatically.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-mono font-black uppercase tracking-wide text-zinc-900 mb-2">
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border-2 border-zinc-900 px-4 py-3 focus:outline-none focus:border-rose-950 transition-all font-serif italic"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-black uppercase tracking-wide text-zinc-900 mb-2">
              VERIFICATION TOKEN
            </label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full bg-white border-2 border-zinc-900 px-4 py-3 focus:outline-none focus:border-rose-950 transition-all font-serif italic"
              placeholder="Paste the code from your email"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-zinc-900 hover:bg-zinc-700 text-white py-3 font-black uppercase text-sm tracking-widest transition-all active:scale-95"
          >
            VERIFY EMAIL
          </button>
        </form>

        <div className="text-center pt-6 border-t-2 border-zinc-900">
          <p className="text-sm text-zinc-600 mb-2">
            Want to log in instead?
          </p>
          <Link
            href="/auth/login"
            className="text-rose-950 font-black uppercase text-sm underline hover:text-rose-900 transition-colors"
          >
            GO TO LOGIN →
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
