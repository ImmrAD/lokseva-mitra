'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          age: age ? Number(age) : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Registration failed');
        return;
      }

      setSuccess('Registration successful! Please check your email to verify your account.');
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    alert('Google signup coming soon');
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white border-4 border-zinc-900 p-8"
      >
        {/* Header */}
        <div className="text-center mb-8 pb-6 border-b-2 border-zinc-900">
          <h1 className="text-4xl font-serif font-black text-rose-950 mb-2">
            लोकसेवा मित्र
          </h1>
          <div className="flex items-center justify-center gap-2">
            <div className="flex-1 h-px bg-rose-950/20"></div>
            <span className="text-xs font-mono font-black text-rose-900 uppercase tracking-[0.2em]">
              Sign Up
            </span>
            <div className="flex-1 h-px bg-rose-950/20"></div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border-2 border-red-700 text-red-900 text-sm font-mono"
          >
            ✗ {error}
          </motion.div>
        )}

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 border-2 border-green-700 text-green-900 text-sm font-mono"
          >
            ✓ {success}
          </motion.div>
        )}

        {/* Sign Up Form */}
        <form onSubmit={handleSignUp} className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-mono font-black uppercase tracking-wide text-zinc-900 mb-2">
              FULL NAME
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border-2 border-zinc-900 px-4 py-3 focus:outline-none focus:border-rose-950 transition-all font-serif italic"
              placeholder="John Doe"
              required
            />
          </div>

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
              AGE
            </label>
            <input
              type="number"
              min="1"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full bg-white border-2 border-zinc-900 px-4 py-3 focus:outline-none focus:border-rose-950 transition-all font-serif italic"
              placeholder="18"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-black uppercase tracking-wide text-zinc-900 mb-2">
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border-2 border-zinc-900 px-4 py-3 focus:outline-none focus:border-rose-950 transition-all font-serif italic"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-black uppercase tracking-wide text-zinc-900 mb-2">
              CONFIRM PASSWORD
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-white border-2 border-zinc-900 px-4 py-3 focus:outline-none focus:border-rose-950 transition-all font-serif italic"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-zinc-900 hover:bg-zinc-700 disabled:bg-zinc-400 text-white py-3 font-black uppercase text-sm tracking-widest transition-all active:scale-95"
          >
            {isLoading ? 'SIGNING UP...' : 'SIGN UP'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-zinc-300"></div>
          <span className="text-xs font-mono text-zinc-500">OR</span>
          <div className="flex-1 h-px bg-zinc-300"></div>
        </div>

        {/* Google Sign Up */}
        <button
          onClick={handleGoogleSignUp}
          className="w-full bg-white border-2 border-zinc-900 hover:bg-zinc-50 text-zinc-900 py-3 font-black uppercase text-sm tracking-widest transition-all active:scale-95 mb-6 flex items-center justify-center gap-2"
        >
          <span>🔐</span> SIGN UP WITH GOOGLE
        </button>

        {/* Login Link */}
        <div className="text-center pt-6 border-t-2 border-zinc-900">
          <p className="text-sm text-zinc-600 mb-2">
            Already have an account?
          </p>
          <Link
            href="/auth/login"
            className="text-rose-950 font-black uppercase text-sm underline hover:text-rose-900 transition-colors"
          >
            LOGIN HERE →
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
