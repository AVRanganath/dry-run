'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import AuthGuard from '@/components/AuthGuard';

const faqs = [
  {
    question: 'How do I start a mock interview?',
    answer: 'Navigate to the Briefcase page from the sidebar. Paste a job description and upload your resume (or paste it as text). Click "Compile Briefcase" and the AI will generate tailored interview questions for you.'
  },
  {
    question: 'How is my answer evaluated?',
    answer: 'Each answer is evaluated by Google Gemini AI on a 1-10 scale across multiple dimensions including clarity of thought, strategic relevance, and STAR framework adherence. You receive detailed feedback with specific strengths and areas for improvement.'
  },
  {
    question: 'Can I retake an interview?',
    answer: 'Each session is a unique evaluation. To practice again, simply create a new session from the Briefcase with the same or different job description. Your previous sessions are preserved in the Archive for reference.'
  },
  {
    question: 'What AI model is used for evaluation?',
    answer: 'We use Google Gemini 2.0 Flash for both question generation and answer evaluation. It provides fast, accurate assessments with detailed structured feedback.'
  },
  {
    question: 'How is my data stored?',
    answer: 'All your interview data is stored securely and is only accessible to your account. Each user has their own isolated data. Your job descriptions, resumes, and answers are never shared with other users.'
  },
];

export default function Support() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <AuthGuard>
      <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
          <main className="flex-1 overflow-y-auto px-margin-mobile md:px-gutter py-8 md:py-margin-desktop">
            <div className="max-w-container-max mx-auto">
              <header className="mb-12">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="material-symbols-outlined text-primary text-3xl">help_outline</span>
                  <h2 className="font-headline-lg text-headline-lg text-primary">Support & Resources</h2>
                </div>
                <p className="font-body-lg text-body-lg text-on-surface-variant">Frequently asked questions and guidance for interview simulations.</p>
              </header>

              {/* FAQ Section */}
              <div className="max-w-3xl">
                <h3 className="font-headline-md text-headline-md text-primary mb-6 flex items-center space-x-2">
                  <span className="material-symbols-outlined">quiz</span>
                  <span>Frequently Asked Questions</span>
                </h3>
                <div className="space-y-3">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="bg-surface rounded-lg embossed-card overflow-hidden">
                      <button
                        onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                        className="w-full flex items-center justify-between p-5 text-left"
                      >
                        <span className="font-body-md text-body-md font-medium text-on-surface pr-4">{faq.question}</span>
                        <span className={`material-symbols-outlined text-outline transition-transform duration-200 ${openIdx === idx ? 'rotate-180' : ''}`}>
                          expand_more
                        </span>
                      </button>
                      {openIdx === idx && (
                        <div className="px-5 pb-5 pt-0">
                          <div className="border-t border-outline-variant/30 pt-4">
                            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{faq.answer}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
