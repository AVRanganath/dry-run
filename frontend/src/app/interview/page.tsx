'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import AuthGuard from '@/components/AuthGuard';

function InterviewClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session');

  const [session, setSession] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answerText, setAnswerText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided');
      setIsLoading(false);
      return;
    }

    api.getSession(sessionId)
      .then(data => {
        setSession(data);
        setQuestions(data.questions || []);
        
        // Find the first unanswered question
        const nextUnansweredIdx = data.questions?.findIndex((q: any) => !q.answer && !q.answer_text);
        if (nextUnansweredIdx !== -1 && nextUnansweredIdx !== undefined) {
          setCurrentIdx(nextUnansweredIdx);
        } else if (data.questions && data.questions.length > 0 && data.questions.every((q: any) => q.answer || q.answer_text)) {
          // All answered
          router.push(`/report?session=${sessionId}`);
        }
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load session');
        setIsLoading(false);
      });
  }, [sessionId, router]);

  const handleSubmit = async () => {
    if (!answerText.trim() || isSubmitting) return;

    const questionId = questions[currentIdx].id;
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      await api.submitAnswer(questionId, { answer_text: answerText });
      
      setFeedbackToast('Response submitted successfully');
      setAnswerText('');
      
      setTimeout(() => {
        setFeedbackToast('');
        if (currentIdx < questions.length - 1) {
          setCurrentIdx(currentIdx + 1);
        } else {
          router.push(`/report?session=${sessionId}`);
        }
        setIsSubmitting(false);
      }, 1200);

    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit answer. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-surface text-on-surface font-data-mono">Loading session data...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-surface text-error font-data-mono">{error}</div>;
  }

  const currentQuestion = questions[currentIdx];
  if (!currentQuestion) {
    return <div className="min-h-screen flex items-center justify-center bg-surface text-on-surface">No questions found.</div>;
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-body-md overflow-hidden antialiased selection:bg-primary selection:text-on-primary relative">
      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-50 bg-secondary text-on-secondary px-6 py-3 rounded shadow-lg font-label-caps uppercase tracking-widest transition-opacity">
          {feedbackToast}
        </div>
      )}

      {/* Minimal Header */}
      <header className="w-full px-gutter py-6 flex justify-between items-start max-w-container-max mx-auto absolute top-0 left-0 right-0 z-10">
        <button onClick={() => router.push('/')} className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-container shadow-embossed active:shadow-debossed group" title="Exit Session">
          <span className="material-symbols-outlined group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
        </button>
        <div className="flex flex-col items-end gap-2">
          <span className="font-label-caps text-label-caps text-on-surface-variant opacity-70 uppercase tracking-widest">Session Progress</span>
          <div className="flex gap-1.5 items-end h-6" title={`Question ${currentIdx + 1} of ${questions.length}`}>
            {questions.map((_, i) => (
              <div 
                key={i} 
                className={`w-1.5 h-5 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)] rounded-sm transform ${i % 2 === 0 ? '-rotate-2' : 'rotate-1'} ${i <= currentIdx ? 'bg-primary' : 'bg-outline-variant/40 shadow-debossed'}`}
              ></div>
            ))}
          </div>
          <span className="font-data-mono text-data-mono text-outline text-[10px]">{String(currentIdx + 1).padStart(2, '0')} / {String(questions.length).padStart(2, '0')}</span>
        </div>
      </header>

      {/* Main Interrogation Canvas */}
      <main className="flex-1 flex flex-col items-center justify-center px-gutter pt-24 pb-12 max-w-4xl mx-auto w-full relative z-0">
        <div className="w-full bg-surface-container-lowest rounded-xl p-8 md:p-14 shadow-embossed border border-surface-variant relative transform transition-transform hover:scale-[1.01] duration-500 ease-out z-10 mb-8">
          <div className="absolute -top-3 -right-3 border-2 border-secondary text-secondary px-3 py-1 rounded font-label-caps text-label-caps uppercase tracking-widest transform rotate-6 opacity-90 shadow-sm bg-surface-container-lowest">
            Active Probe
          </div>
          <p className="font-headline-md md:font-headline-lg text-headline-md md:text-headline-lg text-primary text-center leading-relaxed">
            {currentQuestion.question_text}
          </p>
        </div>

        {/* Controls Area */}
        <div className="flex flex-col items-center gap-6 w-full">
          {/* Text Input Area */}
          <div className="w-full max-w-2xl transition-opacity duration-500 opacity-100">
            {submitError && (
              <div className="w-full bg-error-container text-on-error-container p-4 rounded-lg mb-4 text-sm font-data-mono flex items-center justify-between border border-error/30 shadow-sm animate-fade-in">
                <div className="flex items-center space-x-2">
                  <span className="material-symbols-outlined text-base text-error">hourglass_top</span>
                  <span>{submitError}</span>
                </div>
                <button 
                  onClick={() => setSubmitError('')} 
                  className="text-on-error-container hover:opacity-75 font-bold ml-2"
                  title="Dismiss"
                >
                  ✕
                </button>
              </div>
            )}

            <textarea 
              className="w-full h-40 bg-surface-container shadow-debossed border-none rounded-lg p-6 font-body-lg text-body-lg text-on-surface focus:ring-1 focus:ring-primary focus:outline-none resize-none placeholder-outline-variant/60 scrollbar-analog" 
              placeholder="Type your response here..."
              value={answerText}
              onChange={(e) => {
                setAnswerText(e.target.value);
                if (submitError) setSubmitError('');
              }}
              disabled={isSubmitting}
            ></textarea>
            <div className="flex justify-end mt-4">
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting || !answerText.trim()}
                className="bg-primary text-on-primary px-8 py-3 rounded-lg shadow-embossed hover:shadow-mechanical-button active:shadow-debossed transform transition-all active:translate-y-1 font-label-caps text-label-caps tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                <span>{isSubmitting ? 'Evaluating...' : 'Submit Answer'}</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ActiveInterview() {
  return (
    <AuthGuard>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-surface text-on-surface">Loading interface...</div>}>
        <InterviewClient />
      </Suspense>
    </AuthGuard>
  );
}
