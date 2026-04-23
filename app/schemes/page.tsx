'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const SAMPLE_SCHEMES = [
  {
    id: 1,
    name: 'PM Kisan Samman Nidhi',
    nameHi: 'प्रधानमंत्री किसान सम्मान निधि',
    category: 'Agriculture',
    amount: '₹6000/year',
    description: 'Direct income support for farmers',
    eligibility: ['Farmers with land', 'Age 18+'],
  },
  {
    id: 2,
    name: 'Pradhan Mantri Ujjwala Yojana',
    nameHi: 'प्रधानमंत्री उज्ज्वला योजना',
    category: 'Energy',
    amount: 'Free LPG Connection',
    description: 'Provides free LPG connections to poor households',
    eligibility: ['BPL families', 'No existing LPG'],
  },
  {
    id: 3,
    name: 'PMAY - Housing Scheme',
    nameHi: 'प्रधानमंत्री आवास योजना',
    category: 'Housing',
    amount: '₹2-3 Lakhs',
    description: 'Affordable housing for economically weaker sections',
    eligibility: ['Income below ₹6 Lakhs', 'No existing housing'],
  },
];

export default function SchemesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const categories = ['All', 'Agriculture', 'Energy', 'Housing', 'Education', 'Healthcare'];

  const filtered = SAMPLE_SCHEMES.filter((scheme) => {
    const matchesSearch = scheme.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || scheme.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Header */}
      <header className="bg-white border-b-4 border-zinc-900 sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-xl font-black text-rose-950 hover:text-rose-900">
            ← लोकसेवा मित्र
          </Link>
          <h1 className="text-xl md:text-2xl font-serif font-black text-zinc-900">Scheme Discovery</h1>
          <button className="text-zinc-600 hover:text-zinc-900 font-black">⋮</button>
        </nav>
      </header>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        {/* Search & Filter */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="bg-white border-2 border-zinc-900 p-8">
            <div className="mb-6">
              <label className="block text-xs font-mono font-black uppercase tracking-widest text-zinc-900 mb-3">
                SEARCH SCHEMES
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="PM Kisan, Ujjwala, Housing..."
                className="w-full bg-white border-2 border-zinc-900 px-4 py-3 focus:outline-none focus:border-rose-950 transition-all font-serif italic"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-black uppercase tracking-widest text-zinc-900 mb-3">
                FILTER BY CATEGORY
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-2 font-black text-xs uppercase transition-all border-2 ${
                      selectedCategory === cat
                        ? 'bg-zinc-900 text-white border-zinc-900'
                        : 'bg-white text-zinc-900 border-zinc-300 hover:border-zinc-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        <div className="space-y-6">
          {filtered.length > 0 ? (
            filtered.map((scheme) => (
              <motion.div
                key={scheme.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border-2 border-zinc-900 overflow-hidden hover:shadow-[6px_6px_0_rgba(0,0,0,0.15)] transition-all"
              >
                <button
                  onClick={() => setExpandedId(expandedId === scheme.id ? null : scheme.id)}
                  className="w-full p-6 text-left flex justify-between items-start hover:bg-zinc-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-mono font-black uppercase tracking-widest text-rose-950 bg-rose-50 px-3 py-1">
                        {scheme.category}
                      </span>
                      <span className="text-xs font-mono font-black text-zinc-600">{scheme.amount}</span>
                    </div>
                    <h3 className="text-xl font-black text-zinc-900 mb-1">{scheme.name}</h3>
                    <p className="text-sm text-zinc-600">{scheme.nameHi}</p>
                  </div>
                  <span className="text-2xl text-zinc-600">{expandedId === scheme.id ? '×' : '+'}</span>
                </button>

                {expandedId === scheme.id && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="border-t-2 border-zinc-900 p-6 bg-zinc-50">
                    <p className="text-zinc-700 font-serif mb-4">{scheme.description}</p>
                    <div className="mb-6">
                      <h4 className="text-sm font-mono font-black uppercase tracking-widest text-zinc-900 mb-3">
                        Eligibility Criteria
                      </h4>
                      <ul className="space-y-2">
                        {scheme.eligibility.map((item, idx) => (
                          <li key={idx} className="flex gap-2 items-start">
                            <span className="text-rose-950 font-black mt-1">✓</span>
                            <span className="text-zinc-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex gap-3">
                      <Link
                        href={`/eligibility?scheme=${scheme.id}`}
                        className="flex-1 bg-zinc-900 hover:bg-zinc-700 text-white px-4 py-3 font-black text-xs uppercase tracking-widest transition-all active:scale-95"
                      >
                        CHECK ELIGIBILITY
                      </Link>
                      <button className="px-4 py-3 bg-white border-2 border-zinc-900 hover:bg-zinc-50 text-zinc-900 font-black text-xs uppercase tracking-widest transition-all">
                        LEARN MORE
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-zinc-600 font-serif mb-4">No schemes found matching your search.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
                className="text-rose-950 font-black uppercase text-sm underline hover:text-rose-900"
              >
                RESET FILTERS →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
