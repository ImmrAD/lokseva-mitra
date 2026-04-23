'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const DOCUMENTS = [
  {
    id: 1,
    title: 'Aadhar Card',
    required: true,
    copies: 2,
    details: 'Original and photocopy (front & back)',
    link: 'https://uidai.gov.in',
  },
  {
    id: 2,
    title: 'PAN Card',
    required: true,
    copies: 2,
    details: 'Original and photocopy',
    link: '#',
  },
  {
    id: 3,
    title: 'Bank Account Proof',
    required: true,
    copies: 1,
    details: 'Passbook/Statement with account number',
    link: '#',
  },
  {
    id: 4,
    title: 'Income Certificate',
    required: true,
    copies: 1,
    details: 'Issued by Taluka/Gram Panchayat',
    link: '#',
  },
  {
    id: 5,
    title: 'Caste Certificate',
    required: false,
    copies: 1,
    details: 'If applicable (SC/ST/OBC)',
    link: '#',
  },
  {
    id: 6,
    title: 'Land Ownership Documents',
    required: false,
    copies: 1,
    details: 'For agriculture-based schemes',
    link: '#',
  },
];

export default function DocumentsPage() {
  const [checkedDocs, setCheckedDocs] = useState<number[]>([]);

  const toggleDoc = (id: number) => {
    setCheckedDocs((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const progress = (checkedDocs.length / DOCUMENTS.filter((d) => d.required).length) * 100;

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Header */}
      <header className="bg-white border-b-4 border-zinc-900 sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-xl font-black text-rose-950 hover:text-rose-900">
            ← लोकसेवा मित्र
          </Link>
          <h1 className="text-xl md:text-2xl font-serif font-black text-zinc-900">Document Guidance</h1>
          <button className="text-zinc-600 hover:text-zinc-900 font-black">⋮</button>
        </nav>
      </header>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12">
        {/* Progress Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="bg-white border-2 border-zinc-900 p-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-black text-zinc-900">Document Checklist</h2>
              <span className="text-sm font-mono font-black text-zinc-600">
                {checkedDocs.length} / {DOCUMENTS.filter((d) => d.required).length}
              </span>
            </div>
            <div className="w-full bg-zinc-200 border-2 border-zinc-900 h-6 overflow-hidden">
              <motion.div
                animate={{ width: `${progress}%` }}
                className="h-full bg-green-600 transition-all"
              />
            </div>
            <p className="text-xs text-zinc-600 mt-3 font-mono">
              Complete all required documents before applying
            </p>
          </div>
        </motion.div>

        {/* Documents List */}
        <div className="space-y-4">
          {DOCUMENTS.map((doc, idx) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`bg-white border-2 p-6 cursor-pointer transition-all hover:shadow-[4px_4px_0_rgba(0,0,0,0.1)] ${
                checkedDocs.includes(doc.id) ? 'border-green-700 bg-green-50' : 'border-zinc-900'
              }`}
              onClick={() => toggleDoc(doc.id)}
            >
              <div className="flex gap-4 items-start">
                <input
                  type="checkbox"
                  checked={checkedDocs.includes(doc.id)}
                  onChange={() => {}}
                  className="w-6 h-6 border-2 border-zinc-900 cursor-pointer mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-black text-zinc-900">{doc.title}</h3>
                    {doc.required && (
                      <span className="text-xs font-mono font-black bg-red-100 text-red-900 px-2 py-1">
                        REQUIRED
                      </span>
                    )}
                    {!doc.required && (
                      <span className="text-xs font-mono font-black bg-blue-100 text-blue-900 px-2 py-1">
                        OPTIONAL
                      </span>
                    )}
                  </div>
                  <p className="text-zinc-600 font-serif mb-3">{doc.details}</p>
                  <div className="flex gap-4 text-xs">
                    <span className="font-mono font-black text-zinc-700">📋 {doc.copies} COPY(IES)</span>
                    {doc.link && doc.link !== '#' && (
                      <a
                        href={doc.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-900 underline font-black hover:text-blue-700"
                        onClick={(e) => e.stopPropagation()}
                      >
                        OFFICIAL LINK →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-yellow-50 border-2 border-yellow-700 p-8"
        >
          <h3 className="text-lg font-black text-yellow-900 mb-4">💡 Pro Tips</h3>
          <ul className="space-y-2 text-zinc-800 font-serif">
            <li>• Get all documents in original and photocopy (2 copies)</li>
            <li>• Ensure all documents are recent and valid</li>
            <li>• Keep soft copies as backup for online submission</li>
            <li>• Get attested copies from notary if required</li>
            <li>• Check specific scheme website for additional requirements</li>
          </ul>
        </motion.div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-col md:flex-row gap-4">
          <Link
            href="/guide"
            className="flex-1 bg-zinc-900 hover:bg-zinc-700 text-white px-6 py-4 font-black text-sm uppercase tracking-widest transition-all text-center"
          >
            NEXT: APPLICATION GUIDE →
          </Link>
          <Link
            href="/chat"
            className="flex-1 bg-white border-2 border-zinc-900 hover:bg-zinc-50 text-zinc-900 px-6 py-4 font-black text-sm uppercase tracking-widest transition-all text-center"
          >
            ASK AI ASSISTANT
          </Link>
        </div>
      </div>
    </div>
  );
}
