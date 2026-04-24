'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Scheme {
  id: string;
  name: string;
  description: string;
  sector: string;
  organization: string;
  link: string;
  tags: string[];
  updated: string | null;
}

export default function SchemesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [sectors, setSectors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    const fetchSchemes = async () => {
      setIsLoading(true);
      setError('');
      setIsFallback(false);

      try {
        const response = await fetch('/api/schemes');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Could not load scheme data');
        }

        setSchemes(data.schemes || []);
        setSectors(['All', ...(data.sectors || [])]);
        setIsFallback(Boolean(data.fallback));
      } catch (err) {
        console.error(err);
        setError('Unable to fetch latest schemes from data.gov.in. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchemes();
  }, []);

  const categories = sectors.length > 0 ? sectors : ['All'];

  const filtered = schemes.filter((scheme) => {
    const matchesSearch = scheme.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || scheme.sector === selectedCategory;
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
        {isFallback && (
          <div className="mb-6 rounded-lg border-2 border-amber-500 bg-amber-50 p-4 text-amber-900 font-black text-sm uppercase tracking-widest">
            Latest schemes are currently unavailable from data.gov.in. Showing fallback official schemes for discovery.
          </div>
        )}
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
          {isLoading ? (
            <div className="text-center py-12 text-zinc-700 font-mono uppercase tracking-widest">
              Loading latest schemes from Data.gov.in...
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-700 font-mono uppercase tracking-widest">
              {error}
            </div>
          ) : filtered.length > 0 ? (
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
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="text-xs font-mono font-black uppercase tracking-widest text-rose-950 bg-rose-50 px-3 py-1">
                        {scheme.sector}
                      </span>
                      <span className="text-xs font-mono font-black text-zinc-600">{scheme.organization}</span>
                    </div>
                    <h3 className="text-xl font-black text-zinc-900 mb-1">{scheme.name}</h3>
                    <p className="text-sm text-zinc-600 line-clamp-2">{scheme.description}</p>
                  </div>
                  <span className="text-2xl text-zinc-600">{expandedId === scheme.id ? '×' : '+'}</span>
                </button>

                {expandedId === scheme.id && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="border-t-2 border-zinc-900 p-6 bg-zinc-50">
                    <p className="text-zinc-700 font-serif mb-4">{scheme.description}</p>
                    <div className="grid gap-4 sm:grid-cols-2 mb-6">
                      <div>
                        <h4 className="text-sm font-mono font-black uppercase tracking-widest text-zinc-900 mb-2">
                          Sector
                        </h4>
                        <p className="text-zinc-700">{scheme.sector}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-mono font-black uppercase tracking-widest text-zinc-900 mb-2">
                          Authority
                        </h4>
                        <p className="text-zinc-700">{scheme.organization}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <h4 className="text-sm font-mono font-black uppercase tracking-widest text-zinc-900 mb-2">
                          Official dataset link
                        </h4>
                        <a href={scheme.link} target="_blank" rel="noreferrer" className="text-blue-900 underline font-black">
                          View on data.gov.in
                        </a>
                      </div>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                      <Link
                        href={scheme.link}
                        target="_blank"
                        className="flex-1 bg-zinc-900 hover:bg-zinc-700 text-white px-4 py-3 font-black text-xs uppercase tracking-widest transition-all active:scale-95 text-center"
                      >
                        OPEN DATASET
                      </Link>
                      <button className="px-4 py-3 bg-white border-2 border-zinc-900 hover:bg-zinc-50 text-zinc-900 font-black text-xs uppercase tracking-widest transition-all">
                        BROADCAST TO CHAT
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
