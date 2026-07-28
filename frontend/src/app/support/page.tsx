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
  const [contactSent, setContactSent] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setContactForm({ name: '', email: '', message: '' });
    setTimeout(() => setContactSent(false), 3000);
  };

  return (
    <AuthGuard>
      <div className="flex h-screen w-full overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
          <main className="flex-1 overflow-y-auto px-margin-mobile md:px-gutter py-8 md:py-margin-desktop">
            <div className="max-w-container-max mx-auto">
              <header className="mb-12">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="material-symbols-outlined text-primary text-3xl">help_outline</span>
                  <h2 className="font-headline-lg text-headline-lg text-primary">Support & Resources</h2>
                </div>
                <p className="font-body-lg text-body-lg text-on-surface-variant">Frequently asked questions and contact information.</p>
              </header>

              {/* FAQ Section */}
              <div className="mb-16">
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

              {/* Contact Section */}
              <div>
                <h3 className="font-headline-md text-headline-md text-primary mb-6 flex items-center space-x-2">
                  <span className="material-symbols-outlined">mail</span>
                  <span>Contact & Feedback</span>
                </h3>
                <div className="bg-surface rounded-lg embossed-card p-8 max-w-2xl">
                  {contactSent && (
                    <div className="mb-6 bg-primary-fixed text-on-primary-fixed p-4 rounded-lg font-body-md">
                      Message sent successfully. Thank you for your feedback!
                    </div>
                  )}
                  <form onSubmit={handleContact} className="space-y-5">
                    <div>
                      <label className="font-label-caps text-label-caps text-on-surface-variant mb-2 block">Name</label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={e => setContactForm({...contactForm, name: e.target.value})}
                        className="w-full bg-surface-container-lowest debossed-well rounded-lg p-4 font-data-mono text-data-mono text-on-surface focus:ring-2 focus:ring-secondary/40 outline-none border-none"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="font-label-caps text-label-caps text-on-surface-variant mb-2 block">Email</label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={e => setContactForm({...contactForm, email: e.target.value})}
                        className="w-full bg-surface-container-lowest debossed-well rounded-lg p-4 font-data-mono text-data-mono text-on-surface focus:ring-2 focus:ring-secondary/40 outline-none border-none"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="font-label-caps text-label-caps text-on-surface-variant mb-2 block">Message</label>
                      <textarea
                        required
                        rows={4}
                        value={contactForm.message}
                        onChange={e => setContactForm({...contactForm, message: e.target.value})}
                        className="w-full bg-surface-container-lowest debossed-well rounded-lg p-4 font-data-mono text-data-mono text-on-surface focus:ring-2 focus:ring-secondary/40 outline-none border-none resize-none"
                        placeholder="Your message or feedback..."
                      />
                    </div>
                    <button type="submit" className="bg-primary text-on-primary font-label-caps text-label-caps py-3 px-8 rounded-lg mechanical-btn uppercase tracking-widest">
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
