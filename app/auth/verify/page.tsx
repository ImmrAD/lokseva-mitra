'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function VerifyPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationMethod, setVerificationMethod] = useState<'token' | 'otp'>('token');
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const emailFromQuery = params.get('email') || '';
    const tokenFromQuery = params.get('token') || '';

    setEmail(emailFromQuery);
    setToken(tokenFromQuery);

    if (emailFromQuery && tokenFromQuery) {
      handleTokenVerify(emailFromQuery, tokenFromQuery);
    }
  }, []);

  async function handleTokenVerify(currentEmail: string, currentToken: string) {
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

  async function handleOTPVerify(currentEmail: string, currentOtp: string) {
    setStatus('verifying');
    setMessage('Verifying OTP...');

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentEmail, otp: currentOtp }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus('error');
        setMessage(data.message || 'OTP verification failed. Please try again.');
        return;
      }

      setStatus('success');
      setMessage(data.message || 'Email verified successfully. You can now log in.');
      setTimeout(() => {
        router.push('/auth/login');
      }, 1800);
    } catch (error) {
      console.error('OTP verification error:', error);
      setStatus('error');
      setMessage('Unable to verify right now. Please try again later.');
    }
  }

  const handleSendOTP = async () => {
    if (!email) {
      setStatus('error');
      setMessage('Please enter your email address first.');
      return;
    }

    setStatus('verifying');
    setMessage('Sending OTP...');

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus('error');
        setMessage(data.message || 'Failed to send OTP.');
        return;
      }

      setStatus('idle');
      setMessage('OTP sent! Please check your email and enter the code below.');
      setVerificationMethod('otp');
    } catch (error) {
      console.error('Send OTP error:', error);
      setStatus('error');
      setMessage('Failed to send OTP. Please try again.');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (verificationMethod === 'token') {
      if (!email || !token) {
        setStatus('error');
        setMessage('Both email and verification token are required.');
        return;
      }
      await handleTokenVerify(email, token);
    } else {
      if (!email || !otp) {
        setStatus('error');
        setMessage('Both email and OTP are required.');
        return;
      }
      await handleOTPVerify(email, otp);
    }
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
          <p>If the automatic verification link did not work, choose your preferred verification method below.</p>
        </div>

        {/* Verification Method Toggle */}
        <div className="mb-6">
          <div className="flex gap-4 mb-4">
            <button
              type="button"
              onClick={() => setVerificationMethod('token')}
              className={`px-4 py-2 text-sm font-mono font-black uppercase tracking-wide border-2 transition-all ${
                verificationMethod === 'token'
                  ? 'bg-zinc-900 text-white border-zinc-900'
                  : 'bg-white text-zinc-900 border-zinc-900 hover:bg-zinc-50'
              }`}
            >
              Use Token
            </button>
            <button
              type="button"
              onClick={() => setVerificationMethod('otp')}
              className={`px-4 py-2 text-sm font-mono font-black uppercase tracking-wide border-2 transition-all ${
                verificationMethod === 'otp'
                  ? 'bg-zinc-900 text-white border-zinc-900'
                  : 'bg-white text-zinc-900 border-zinc-900 hover:bg-zinc-50'
              }`}
            >
              Use OTP
            </button>
          </div>
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
              className="w-full bg-white border-2 border-zinc-900 px-4 py-3 focus:outline-none focus:border-rose-950 transition-all text-zinc-900 font-sans"
              placeholder="your@email.com"
              required
            />
          </div>

          {verificationMethod === 'token' ? (
            <div>
              <label className="block text-xs font-mono font-black uppercase tracking-wide text-zinc-900 mb-2">
                VERIFICATION TOKEN
              </label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full bg-white border-2 border-zinc-900 px-4 py-3 focus:outline-none focus:border-rose-950 transition-all text-zinc-900 font-sans"
                placeholder="Paste the code from your email"
                required
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-mono font-black uppercase tracking-wide text-zinc-900 mb-2">
                OTP CODE
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-white border-2 border-zinc-900 px-4 py-3 focus:outline-none focus:border-rose-950 transition-all text-zinc-900 font-sans"
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                required
              />
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-zinc-900 hover:bg-zinc-700 text-white py-3 font-black uppercase text-sm tracking-widest transition-all active:scale-95"
            >
              VERIFY EMAIL
            </button>

            {verificationMethod === 'otp' && (
              <button
                type="button"
                onClick={handleSendOTP}
                className="px-6 bg-rose-950 hover:bg-rose-900 text-white py-3 font-black uppercase text-sm tracking-widest transition-all active:scale-95"
              >
                SEND OTP
              </button>
            )}
          </div>
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
