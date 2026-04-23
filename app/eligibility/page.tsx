'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function EligibilityPage() {
  const [formData, setFormData] = useState({
    age: '',
    income: '',
    state: '',
    category: '',
    landHolding: '',
    hasLPG: 'no',
  });

  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const checkEligibility = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate eligibility check
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const eligible = parseInt(formData.age) >= 18 && parseInt(formData.income) < 600000;

    setResults({
      eligible,
      message: eligible
        ? '✓ You are eligible for this scheme!'
        : '✗ You do not meet the eligibility criteria for this scheme.',
      details: [
        { criterion: 'Age (18+)', status: parseInt(formData.age) >= 18 ? 'Pass' : 'Fail' },
        {
          criterion: 'Income (Below ₹6L)',
          status: parseInt(formData.income) < 600000 ? 'Pass' : 'Fail',
        },
      ],
      nextSteps: eligible ? [
        'Gather Required Documents',
        'Visit Nearest Application Center',
        'Submit Online ApplicationForm',
      ] : [],
    });

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Header */}
      <header className="bg-white border-b-4 border-zinc-900 sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-xl font-black text-rose-950 hover:text-rose-900">
            ← लोकसेवा मित्र
          </Link>
          <h1 className="text-xl md:text-2xl font-serif font-black text-zinc-900">Eligibility Checker</h1>
          <button className="text-zinc-600 hover:text-zinc-900 font-black">⋮</button>
        </nav>
      </header>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        {/* Form Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="bg-white border-2 border-zinc-900 p-8">
            <h2 className="text-2xl font-serif font-black text-zinc-900 mb-8">Enter Your Details</h2>

            <form onSubmit={checkEligibility} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono font-black uppercase tracking-widest text-zinc-900 mb-2">
                    AGE
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full bg-white border-2 border-zinc-900 px-4 py-3 focus:outline-none focus:border-rose-950 transition-all"
                    placeholder="25"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-black uppercase tracking-widest text-zinc-900 mb-2">
                    ANNUAL INCOME (₹)
                  </label>
                  <input
                    type="number"
                    name="income"
                    value={formData.income}
                    onChange={handleInputChange}
                    className="w-full bg-white border-2 border-zinc-900 px-4 py-3 focus:outline-none focus:border-rose-950 transition-all"
                    placeholder="500000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-black uppercase tracking-widest text-zinc-900 mb-2">
                    STATE
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full bg-white border-2 border-zinc-900 px-4 py-3 focus:outline-none focus:border-rose-950 transition-all"
                    required
                  >
                    <option value="">Select State</option>
                    <option value="maharashtra">Maharashtra</option>
                    <option value="karnataka">Karnataka</option>
                    <option value="uttarpradesh">Uttar Pradesh</option>
                    <option value="bihar">Bihar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-black uppercase tracking-widest text-zinc-900 mb-2">
                    CATEGORY
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-white border-2 border-zinc-900 px-4 py-3 focus:outline-none focus:border-rose-950 transition-all"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="general">General</option>
                    <option value="obc">OBC</option>
                    <option value="sc">SC</option>
                    <option value="st">ST</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-zinc-900 hover:bg-zinc-700 disabled:bg-zinc-400 text-white py-4 font-black uppercase text-sm tracking-widest transition-all active:scale-95"
              >
                {isLoading ? 'CHECKING...' : 'CHECK ELIGIBILITY'}
              </button>
            </form>
          </div>
        </motion.div>

        {/* Results Section */}
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white border-4 p-8 ${results.eligible ? 'border-green-700 bg-green-50' : 'border-red-700 bg-red-50'}`}
          >
            <div className="mb-8 pb-6 border-b-2 border-current">
              <p className={`text-3xl font-black text-center ${results.eligible ? 'text-green-900' : 'text-red-900'}`}>
                {results.message}
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-mono font-black uppercase tracking-widest text-zinc-900 mb-4">CRITERIA ASSESSMENT</h3>
              <div className="space-y-3">
                {results.details.map((detail: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-white border-2 border-zinc-300">
                    <span className="font-serif text-zinc-800">{detail.criterion}</span>
                    <span
                      className={`font-black px-3 py-1 text-xs ${
                        detail.status === 'Pass'
                          ? 'bg-green-200 text-green-900'
                          : 'bg-red-200 text-red-900'
                      }`}
                    >
                      {detail.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {results.nextSteps.length > 0 && (
              <div>
                <h3 className="text-lg font-mono font-black uppercase tracking-widest text-zinc-900 mb-4">
                  NEXT STEPS
                </h3>
                <ol className="space-y-2">
                  {results.nextSteps.map((step: string, idx: number) => (
                    <li key={idx} className="flex gap-3 items-start">
                      <span className="font-black text-green-900 bg-green-100 px-3 py-1 rounded text-xs">
                        {idx + 1}
                      </span>
                      <span className="text-zinc-700 font-serif mt-1">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {results.eligible && (
              <div className="mt-8 pt-6 border-t-2 border-green-700 flex gap-3">
                <Link
                  href="/documents"
                  className="flex-1 bg-green-700 hover:bg-green-600 text-white px-4 py-3 font-black text-xs uppercase tracking-widest transition-all"
                >
                  VIEW DOCUMENTS →
                </Link>
                <Link
                  href="/guide"
                  className="flex-1 bg-white border-2 border-green-700 hover:bg-green-50 text-green-900 px-4 py-3 font-black text-xs uppercase tracking-widest transition-all"
                >
                  APPLICATION GUIDE →
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
