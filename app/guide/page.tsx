'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const STEPS = [
  {
    id: 1,
    title: 'Register Online',
    description: 'Visit the official scheme portal',
    details: [
      'Go to the official government website',
      'Click on "New Applicant" or "Register"',
      'Fill basic details (Name, Email, Phone)',
      'Create a password for future logins',
    ],
    duration: '5-10 minutes',
    difficulty: 'Easy',
  },
  {
    id: 2,
    title: 'Fill Application Form',
    description: 'Complete the detailed application',
    details: [
      'Click on "New Application"',
      'Select the scheme you want to apply for',
      'Fill all mandatory fields (*)',
      'Upload required documents (PDF/JPG)',
      'Review and save as draft if needed',
    ],
    duration: '15-20 minutes',
    difficulty: 'Medium',
  },
  {
    id: 3,
    title: 'Submit Application',
    description: 'Finalize and submit your application',
    details: [
      'Review all entered information',
      'Accept terms and conditions',
      'Click "Submit Application"',
      'You will receive an Application Reference Number',
      'Save the reference number for future tracking',
    ],
    duration: '2-3 minutes',
    difficulty: 'Easy',
  },
  {
    id: 4,
    title: 'Verify Documents',
    description: 'Government verification of submitted documents',
    details: [
      'You will receive a verification notice',
      'Visit the document verification center with originals',
      'Officers will verify your documents',
      'Certificate will be issued after verification',
      'Expected time: 7-15 days',
    ],
    duration: '1 day (on-site)',
    difficulty: 'Easy',
  },
  {
    id: 5,
    title: 'Final Approval',
    description: 'Scheme benefit disbursement',
    details: [
      'After verification, application goes for approval',
      'You will get email/SMS notification',
      'Benefit amount will be transferred to your bank account',
      'Keep reference number for future enquiries',
    ],
    duration: 'Variable',
    difficulty: 'Automatic',
  },
];

export default function ApplicationGuidePage() {
  const [expandedStep, setExpandedStep] = useState<number | null>(1);

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Header */}
      <header className="bg-white border-b-4 border-zinc-900 sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-xl font-black text-rose-950 hover:text-rose-900">
            ← लोकसेवा मित्र
          </Link>
          <h1 className="text-xl md:text-2xl font-serif font-black text-zinc-900">Application Guide</h1>
          <button className="text-zinc-600 hover:text-zinc-900 font-black">⋮</button>
        </nav>
      </header>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        {/* Timeline Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="bg-white border-2 border-zinc-900 p-8">
            <h2 className="text-2xl font-serif font-black text-zinc-900 mb-6">Application Timeline</h2>
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-zinc-900"></div>

              {/* Timeline Items */}
              <div className="space-y-8">
                {STEPS.map((step) => (
                  <div key={step.id} className="ml-20 flex gap-4 items-start">
                    <div className="absolute left-0 w-16 h-16 flex items-center justify-center bg-white border-2 border-zinc-900 rounded-full font-black text-zinc-900">
                      {step.id}
                    </div>
                    <div>
                      <h3 className="font-black text-lg text-zinc-900">{step.title}</h3>
                      <p className="text-sm text-zinc-600 font-mono">⏱ {step.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Detailed Steps */}
        <div className="space-y-4">
          {STEPS.map((step, idx) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white border-2 border-zinc-900 overflow-hidden"
            >
              <button
                onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                className="w-full p-6 flex justify-between items-start hover:bg-zinc-50 transition-colors"
              >
                <div className="text-left flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-block w-10 h-10 bg-zinc-900 text-white font-black flex items-center justify-center rounded-full">
                      {step.id}
                    </span>
                    <h3 className="text-xl font-black text-zinc-900">{step.title}</h3>
                  </div>
                  <div className="flex gap-4 text-xs font-mono font-black ml-13">
                    <span className="text-zinc-600">{step.description}</span>
                    <span className="bg-blue-100 text-blue-900 px-2 py-1">{step.difficulty}</span>
                  </div>
                </div>
                <span className="text-2xl text-zinc-600 ml-4">{expandedStep === step.id ? '−' : '+'}</span>
              </button>

              {expandedStep === step.id && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  className="border-t-2 border-zinc-900 p-6 bg-zinc-50"
                >
                  <ol className="space-y-3 ml-4">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex gap-3 items-start">
                        <span className="font-black text-zinc-900 min-w-6">{i + 1}.</span>
                        <span className="text-zinc-700 font-serif leading-relaxed">{detail}</span>
                      </li>
                    ))}
                  </ol>

                  {/* Important Notes */}
                  {(step.id === 2 || step.id === 3) && (
                    <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-600">
                      <p className="text-sm text-yellow-900 font-serif">
                        <strong>💡 Tip:</strong> Save your application progress regularly. You can continue from where you left
                        off anytime within 30 days.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-white border-2 border-zinc-900 p-8"
        >
          <h3 className="text-2xl font-serif font-black text-zinc-900 mb-6">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {[
              {
                q: 'How long does the entire process take?',
                a: 'Typically 30-45 days from submission to final approval.',
              },
              {
                q: 'Can I edit my application after submission?',
                a: 'No, submit only after reviewing all information carefully.',
              },
              {
                q: 'What if my application is rejected?',
                a: 'You can reapply after addressing the mentioned issues.',
              },
              {
                q: 'How will I get approval notification?',
                a: 'Via Email and SMS on the registered contact details.',
              },
            ].map((faq, idx) => (
              <div key={idx} className="p-4 border-2 border-zinc-300">
                <p className="font-black text-zinc-900 mb-2">{faq.q}</p>
                <p className="text-zinc-700 font-serif text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-col md:flex-row gap-4">
          <Link
            href="/schemes"
            className="flex-1 bg-zinc-900 hover:bg-zinc-700 text-white px-6 py-4 font-black text-sm uppercase tracking-widest transition-all text-center"
          >
            VIEW SCHEMES
          </Link>
          <Link
            href="/chat"
            className="flex-1 bg-white border-2 border-zinc-900 hover:bg-zinc-50 text-zinc-900 px-6 py-4 font-black text-sm uppercase tracking-widest transition-all text-center"
          >
            CHAT WITH AI
          </Link>
        </div>
      </div>
    </div>
  );
}
