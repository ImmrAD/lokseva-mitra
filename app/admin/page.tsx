'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('schemes');
  const [schemes, setSchemes] = useState([
    {
      id: 1,
      name: 'PM Kisan Samman Nidhi',
      status: 'Active',
      applicants: 1250,
    },
    {
      id: 2,
      name: 'Pradhan Mantri Ujjwala Yojana',
      status: 'Active',
      applicants: 890,
    },
  ]);

  const stats = [
    {
      title: 'Total Schemes',
      value: '24',
      icon: '📋',
      color: 'bg-blue-50 border-blue-700',
    },
    {
      title: 'Active Users',
      value: '12,456',
      icon: '👥',
      color: 'bg-green-50 border-green-700',
    },
    {
      title: 'Applications',
      value: '5,678',
      icon: '📝',
      color: 'bg-purple-50 border-purple-700',
    },
    {
      title: 'Documents Verified',
      value: '3,245',
      icon: '✓',
      color: 'bg-yellow-50 border-yellow-700',
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Header */}
      <header className="bg-white border-b-4 border-zinc-900 sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-serif font-black text-rose-950">ADMIN PANEL</h1>
            <p className="text-xs font-mono text-rose-900 uppercase tracking-wider">लोकसेवा मित्र</p>
          </div>
          <button className="text-zinc-600 hover:text-zinc-900 font-black">
            👤 Admin
          </button>
        </nav>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Key Statistics */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid md:grid-cols-4 gap-4 mb-12"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`${stat.color} border-2 p-6`}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <p className="text-4xl font-black text-zinc-900">{stat.value}</p>
              <p className="text-xs font-mono uppercase tracking-widest text-zinc-700 mt-1">
                {stat.title}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <div className="mb-8 flex gap-2 border-b-2 border-zinc-900">
          {['schemes', 'users', 'applications', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-black uppercase text-sm tracking-widest transition-all border-b-4 ${
                activeTab === tab
                  ? 'border-zinc-900 text-zinc-900'
                  : 'border-transparent text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {tab === 'schemes'
                ? '📋 Schemes'
                : tab === 'users'
                  ? '👥 Users'
                  : tab === 'applications'
                    ? '📝 Applications'
                    : '⚙️ Settings'}
            </button>
          ))}
        </div>

        {/* Schemes Tab */}
        {activeTab === 'schemes' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-white border-2 border-zinc-900 p-8 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif font-black text-zinc-900">Manage Schemes</h2>
                <button className="bg-zinc-900 hover:bg-zinc-700 text-white px-4 py-2 font-black text-xs uppercase tracking-widest">
                  + ADD SCHEME
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-zinc-900">
                      <th className="p-3 text-left font-black uppercase text-xs tracking-widest">Scheme Name</th>
                      <th className="p-3 text-left font-black uppercase text-xs tracking-widest">Status</th>
                      <th className="p-3 text-left font-black uppercase text-xs tracking-widest">Applicants</th>
                      <th className="p-3 text-left font-black uppercase text-xs tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schemes.map((scheme) => (
                      <tr key={scheme.id} className="border-b border-zinc-200 hover:bg-zinc-50">
                        <td className="p-3 font-serif">{scheme.name}</td>
                        <td className="p-3">
                          <span className="inline-block px-3 py-1 bg-green-100 text-green-900 font-black text-xs">
                            {scheme.status}
                          </span>
                        </td>
                        <td className="p-3 font-black">{scheme.applicants}</td>
                        <td className="p-3 flex gap-2">
                          <button className="text-blue-900 hover:underline font-black text-xs">EDIT</button>
                          <button className="text-red-900 hover:underline font-black text-xs">DELETE</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-white border-2 border-zinc-900 p-8">
              <h2 className="text-2xl font-serif font-black text-zinc-900 mb-6">Recent Users</h2>
              <div className="space-y-3">
                {[
                  { name: 'Rajesh Kumar', email: 'rajesh@example.com', joined: '2 days ago', status: 'Verified' },
                  {
                    name: 'Priya Sharma',
                    email: 'priya@example.com',
                    joined: '5 days ago',
                    status: 'Verified',
                  },
                  {
                    name: 'Amit Patel',
                    email: 'amit@example.com',
                    joined: '1 day ago',
                    status: 'Pending',
                  },
                ].map((user, idx) => (
                  <div key={idx} className="p-4 border-2 border-zinc-200 flex justify-between items-center">
                    <div>
                      <p className="font-black text-zinc-900">{user.name}</p>
                      <p className="text-sm text-zinc-600">{user.email}</p>
                      <p className="text-xs text-zinc-500 mt-1">{user.joined}</p>
                    </div>
                    <span
                      className={`font-black text-xs px-3 py-1 ${
                        user.status === 'Verified'
                          ? 'bg-green-100 text-green-900'
                          : 'bg-yellow-100 text-yellow-900'
                      }`}
                    >
                      {user.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-white border-2 border-zinc-900 p-8">
              <h2 className="text-2xl font-serif font-black text-zinc-900 mb-6">Pending Applications</h2>
              <div className="space-y-3">
                {[
                  {
                    id: 'APP001',
                    scheme: 'PM Kisan',
                    applicant: 'Rajesh Kumar',
                    submitted: '2 days ago',
                    status: 'Documents Verified',
                  },
                  {
                    id: 'APP002',
                    scheme: 'Ujjwala',
                    applicant: 'Priya Sharma',
                    submitted: '1 day ago',
                    status: 'Awaiting Verification',
                  },
                ].map((app, idx) => (
                  <div key={idx} className="p-4 border-2 border-zinc-200">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-black text-zinc-900">{app.scheme} Application</p>
                        <p className="text-sm text-zinc-600">{app.applicant}</p>
                      </div>
                      <span className="text-xs font-mono text-zinc-600">{app.id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-zinc-500">{app.submitted}</span>
                      <button className="bg-zinc-900 hover:bg-zinc-700 text-white px-3 py-1 font-black text-xs uppercase">
                        Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-white border-2 border-zinc-900 p-8">
              <h2 className="text-2xl font-serif font-black text-zinc-900 mb-6">System Settings</h2>
              <div className="space-y-4">
                {[
                  { label: 'System Maintenance', value: 'Enabled' },
                  { label: 'Email Notifications', value: 'Enabled' },
                  { label: 'Application Acceptance', value: 'Enabled' },
                  { label: 'Document Verification', value: 'In Progress' },
                ].map((setting, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 border-2 border-zinc-200">
                    <span className="font-black text-zinc-900">{setting.label}</span>
                    <span className="text-xs font-black px-3 py-1 bg-blue-100 text-blue-900">
                      {setting.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
