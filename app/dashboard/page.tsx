'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface UserProfile {
  name: string;
  email: string;
  role: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
    setIsLoading(false);
  }, []);

  const modules = [
    {
      icon: '🔍',
      title: 'Scheme Discovery',
      desc: 'Browse & find schemes',
      href: '/schemes',
      color: 'border-blue-700 bg-blue-50',
    },
    {
      icon: '✓',
      title: 'Eligibility Checker',
      desc: 'Check your eligibility',
      href: '/eligibility',
      color: 'border-green-700 bg-green-50',
    },
    {
      icon: '📄',
      title: 'Document Guidance',
      desc: 'Document requirements',
      href: '/documents',
      color: 'border-purple-700 bg-purple-50',
    },
    {
      icon: '📋',
      title: 'Application Guide',
      desc: 'Step-by-step guide',
      href: '/guide',
      color: 'border-yellow-700 bg-yellow-50',
    },
    {
      icon: '💬',
      title: 'AI Chat Assistant',
      desc: 'Ask AI for help',
      href: '/chat',
      color: 'border-pink-700 bg-pink-50',
    },
    {
      icon: '🛠️',
      title: 'Admin Panel',
      desc: 'Manage system',
      href: '/admin',
      color: 'border-red-700 bg-red-50',
      isAdmin: true,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/auth/login';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-black text-rose-950 mb-4">लोकसेवा मित्र</h1>
          <p className="text-zinc-600 font-mono">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Header */}
      <header className="bg-white border-b-4 border-double border-zinc-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-black text-rose-950">लोकसेवा मित्र</h1>
            <p className="text-xs font-mono text-rose-900 uppercase tracking-[0.15em]">Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm font-black text-zinc-900">{user?.name}</p>
              <p className="text-xs text-zinc-600 font-mono">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-rose-950 hover:bg-rose-900 text-white font-black text-xs uppercase tracking-wider transition-colors"
            >
              LOGOUT
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Welcome Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-4 border-zinc-900 p-8 md:p-12 mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-black text-zinc-900 mb-4">
            Welcome, {user?.name}! 👋
          </h2>
          <p className="text-lg text-zinc-700 font-serif mb-6 max-w-2xl leading-relaxed">
            Explore government schemes tailored to your needs. Use our AI-powered tools to find eligibility criteria,
            understand document requirements, and get step-by-step guidance for applications.
          </p>
          <div className="flex gap-3">
            <Link
              href="/schemes"
              className="px-6 py-3 bg-zinc-900 hover:bg-zinc-700 text-white font-black text-sm uppercase tracking-widest transition-all"
            >
              EXPLORE SCHEMES →
            </Link>
            <Link
              href="/chat"
              className="px-6 py-3 bg-white border-2 border-zinc-900 hover:bg-zinc-50 text-zinc-900 font-black text-sm uppercase tracking-widest transition-all"
            >
              ASK ASSISTANT
            </Link>
          </div>
        </motion.section>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          {[
            { title: 'Schemes Browsed', value: '0', icon: '📊' },
            { title: 'Eligibility Checked', value: '0', icon: '✓' },
            { title: 'Applications', value: '0', icon: '📝' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white border-2 border-zinc-900 p-6">
              <div className="text-3xl mb-3">{stat.icon}</div>
              <p className="text-2xl font-black text-zinc-900">{stat.value}</p>
              <p className="text-xs font-mono uppercase tracking-widest text-zinc-600 mt-2">{stat.title}</p>
            </div>
          ))}
        </motion.div>

        {/* Modules Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-serif font-black text-zinc-900 mb-8">
            Explore Our Services
            <span className="block text-xs font-mono text-zinc-600 font-normal mt-2">
              CLICK ON ANY SERVICE TO GET STARTED
            </span>
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules
              .filter((m) => !m.isAdmin || (user?.role === 'admin'))
              .map((module, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group"
                >
                  <Link href={module.href}>
                    <div
                      className={`${module.color} border-2 p-8 h-full hover:shadow-[6px_6px_0_rgba(0,0,0,0.15)] transition-all cursor-pointer`}
                    >
                      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{module.icon}</div>
                      <h4 className="text-lg font-black text-zinc-900 mb-2">{module.title}</h4>
                      <p className="text-sm text-zinc-700 font-serif">{module.desc}</p>
                      <div className="text-xs font-mono font-black text-zinc-700 uppercase tracking-wider mt-4 group-hover:translate-x-1 transition-transform">
                        →
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
          </div>
        </motion.div>

        {/* Resources Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-zinc-900 text-white border-4 border-zinc-900 p-8 md:p-12"
        >
          <h3 className="text-2xl font-serif font-black mb-6">Need Help?</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-black uppercase text-sm tracking-wider mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm font-serif">
                <li>
                  <Link href="/chat" className="hover:underline">
                    → Chat with AI Assistant
                  </Link>
                </li>
                <li>
                  <Link href="/schemes" className="hover:underline">
                    → Browse All Schemes
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    → FAQs & Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-black uppercase text-sm tracking-wider mb-3">Support</h4>
              <p className="text-sm font-serif mb-2">📧 Email: support@loksevamitra.gov.in</p>
              <p className="text-sm font-serif">📞 Helpline: 1800-XXX-XXXX (Toll Free)</p>
            </div>
          </div>
        </motion.section>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t-4 border-zinc-900 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-zinc-600 mb-1">
            EDITORIAL DEPARTMENT | CITIZEN RELATIONS
          </p>
          <p className="text-xs text-zinc-500">© 2026 लोकसेवा मित्र. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
