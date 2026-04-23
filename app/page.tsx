"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const features = [
    {
      icon: '🔍',
      title: 'Scheme Discovery',
      description: 'Find government schemes tailored to your profile',
      href: '/schemes',
    },
    {
      icon: '✓',
      title: 'Eligibility Checker',
      description: 'Check if you are eligible for specific schemes',
      href: '/eligibility',
    },
    {
      icon: '📄',
      title: 'Document Guidance',
      description: 'Get step-by-step document requirements',
      href: '/documents',
    },
    {
      icon: '📋',
      title: 'Application Guide',
      description: 'Complete walkthrough of application process',
      href: '/guide',
    },
    {
      icon: '💬',
      title: 'AI Chat Assistant',
      description: 'Get instant answers about schemes and mandis',
      href: '/chat',
    },
    {
      icon: '🛠️',
      title: 'Admin Dashboard',
      description: 'Manage schemes and system (admin only)',
      href: '/admin',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Header */}
      <header className="bg-white border-b-4 border-double border-zinc-900 sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          <div className="text-center flex-1">
            <h1 className="text-2xl md:text-3xl font-serif font-black text-rose-950">
              लोकसेवा मित्र
            </h1>
            <p className="text-xs font-mono font-black text-rose-900 uppercase tracking-[0.15em]">
              Voice of The Citizen
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/auth/login"
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-700 text-white font-black text-xs uppercase tracking-wider transition-colors"
            >
              LOGIN
            </Link>
            <Link
              href="/auth/signup"
              className="px-4 py-2 bg-white border-2 border-zinc-900 hover:bg-zinc-50 text-zinc-900 font-black text-xs uppercase tracking-wider transition-colors"
            >
              SIGN UP
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b-4 border-zinc-900 py-16 md:py-24"
      >
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <div className="mb-6 font-mono text-xs font-black text-rose-900 uppercase tracking-widest border-b-2 border-rose-950/20 pb-4">
            VOL. I | EDITION I | 2026
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black text-zinc-900 mb-6 leading-tight">
            Empowering Citizens with Government Benefits
          </h2>
          <p className="text-lg text-zinc-700 mb-8 font-serif leading-relaxed max-w-2xl mx-auto">
            लोकसेवा मित्र helps you discover, understand, and apply for government schemes designed for your needs. Multilingual support, AI-powered guidance, and step-by-step assistance.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="px-8 py-4 bg-rose-950 hover:bg-rose-900 text-white font-black uppercase text-sm tracking-widest transition-all active:scale-95"
            >
              GET STARTED →
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-4 bg-white border-2 border-zinc-900 hover:bg-zinc-50 text-zinc-900 font-black uppercase text-sm tracking-widest transition-all active:scale-95"
            >
              LOGIN
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-serif font-black text-zinc-900 mb-4">
              Our Services
            </h3>
            <div className="flex items-center justify-center gap-2">
              <div className="flex-1 h-px bg-zinc-300"></div>
              <span className="text-xs font-mono font-black text-zinc-600">EXPLORE ALL FEATURES</span>
              <div className="flex-1 h-px bg-zinc-300"></div>
            </div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="group"
              >
                <Link href={feature.href}>
                  <div className="bg-white border-2 border-zinc-900 p-8 h-full hover:shadow-[6px_6px_0_rgba(0,0,0,0.15)] transition-all active:scale-98 cursor-pointer">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h4 className="text-lg font-black text-zinc-900 mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-zinc-600 font-serif leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="text-xs font-mono font-black text-rose-950 uppercase tracking-wider mt-4 group-hover:translate-x-1 transition-transform">
                      EXPLORE →
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-white border-t-4 border-b-4 border-zinc-900 py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
            >
              <h3 className="text-2xl font-serif font-black text-zinc-900 mb-4">
                Why Choose लोकसेवा मित्र?
              </h3>
              <ul className="space-y-3">
                {[
                  'Discover schemes matching your profile',
                  'Get instant eligibility assessment',
                  'AI-powered guidance in 3 languages',
                  'Step-by-step application assistance',
                  'Document requirement checklist',
                  'Mandi price information',
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3 items-start">
                    <span className="text-rose-950 font-black mt-1">✓</span>
                    <span className="text-zinc-700 font-serif">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              className="bg-zinc-100 border-2 border-zinc-900 p-8"
            >
              <h3 className="text-2xl font-serif font-black text-zinc-900 mb-4">
                Direct Government Connection
              </h3>
              <p className="text-zinc-700 font-serif mb-4 leading-relaxed">
                लोकसेवा मित्र uses official OGD (Open Government Data) APIs to provide real-time, accurate information about government schemes and mandi prices.
              </p>
              <p className="text-xs font-mono text-zinc-600">
                Data refreshed automatically | Multilingual support | Mobile-friendly | Free to use
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900 text-white border-t-4 border-zinc-900 py-8">
        <div className="max-w-6xl mx-auto px-4 md:px-8 text-center">
          <p className="text-xs font-mono font-black uppercase tracking-widest mb-2">
            EDITORIAL DEPARTMENT | CITIZEN RELATIONS
          </p>
          <p className="text-xs text-zinc-400">
            © 2026 लोकसेवा मित्र. All rights reserved. | Designed for Indian Citizens
          </p>
        </div>
      </footer>
    </div>
  );
}
