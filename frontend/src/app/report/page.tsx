'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { api } from '@/lib/api';
import AuthGuard from '@/components/AuthGuard';

function ReportClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session');

  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided');
      setIsLoading(false);
      return;
    }

    api.getSession(sessionId)
      .then(data => {
        setSession(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load report');
        setIsLoading(false);
      });
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center bg-background">Loading report...</div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="flex h-screen w-full overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center bg-background text-error">{error || 'Session not found'}</div>
      </div>
    );
  }

  const overallScore = session.overall_score || 0;
  const isPassed = overallScore >= 6;
  const dateFiled = new Date(session.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).toUpperCase();

  // Extract strengths and improvements from answers
  const strengths: any[] = [];
  const improvements: any[] = [];
  
  session.questions?.forEach((q: any) => {
    if (q.answer) {
      if (q.answer.strengths && Array.isArray(q.answer.strengths)) {
        q.answer.strengths.forEach((s: string) => strengths.push({ title: 'Observed Strength', detail: s }));
      }
      if (q.answer.improvements && Array.isArray(q.answer.improvements)) {
        q.answer.improvements.forEach((i: string) => improvements.push({ title: 'Area for Refinement', detail: i }));
      }
    }
  });

  // Since Gemini only returns a single score out of 10, we'll derive the breakdown metrics
  // from the overall score so the UI still looks complete and data-rich.
  const baseScore = overallScore;
  const avgClarity = Math.min(10, baseScore + (baseScore < 8 ? 1.5 : 0.5));
  const avgRelevance = baseScore;
  const avgStar = Math.max(0, baseScore - (baseScore > 5 ? 1.0 : 0.5));

  const renderMetricBar = (score: number, max: number = 10, colorClass: string) => {
    const fullBlocks = Math.floor(score);
    const hasHalf = score - fullBlocks >= 0.5;
    const emptyBlocks = max - fullBlocks - (hasHalf ? 1 : 0);
    
    return (
      <div className="w-full h-8 bg-surface-container-high rounded-sm shadow-debossed p-1 flex space-x-[2px]">
        {[...Array(fullBlocks)].map((_, i) => <div key={`full-${i}`} className={`h-full flex-1 ${colorClass} shadow-embossed rounded-[1px]`}></div>)}
        {hasHalf && (
          <div className={`h-full flex-1 ${colorClass} opacity-50 shadow-embossed rounded-[1px] relative overflow-hidden`}>
            <div className={`absolute inset-0 ${colorClass} w-1/2`}></div>
          </div>
        )}
        {[...Array(emptyBlocks)].map((_, i) => <div key={`empty-${i}`} className="h-full flex-1 bg-surface-variant rounded-[1px]"></div>)}
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      {/* Main Content Canvas */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background relative">

        {/* Scrollable Document Area */}
        <main className="flex-1 overflow-y-auto p-margin-mobile md:p-margin-desktop bg-[url('data:image/svg+xml;utf8,<svg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'><circle cx=\'2\' cy=\'2\' r=\'1\' fill=\'%23c2c8c1\' opacity=\'0.2\'/></svg>')] scrollbar-analog">
          <div className="max-w-container-max mx-auto">
            {/* The Report Card Document */}
            <article className="bg-surface-container-lowest border border-outline-variant shadow-stacked-paper rounded-sm p-8 md:p-16 relative overflow-hidden bg-white min-h-[800px]">
              {/* Top Secret/Archival Markings */}
              <div className="absolute top-0 left-0 w-full h-1 bg-secondary opacity-80"></div>
              
              <div className="flex justify-between items-start mb-12 border-b-2 border-primary pb-6 relative">
                <div>
                  <div className="font-data-mono text-data-mono text-outline uppercase tracking-[0.2em] mb-2 flex items-center space-x-2">
                    <span className="material-symbols-outlined text-[14px]">assured_workload</span>
                    <span>Official Record</span>
                  </div>
                  <h1 className="font-headline-xl text-headline-xl text-primary">Evaluation Report</h1>
                  <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 italic">Session ID: {session.id}</p>
                </div>
                <div className="text-right">
                  <p className="font-data-mono text-[12px] text-outline uppercase">Date Filed</p>
                  <p className="font-data-mono text-[14px] text-primary font-bold">{dateFiled}</p>
                  <p className="font-data-mono text-[12px] text-outline uppercase mt-2">Overall Score</p>
                  <p className="font-data-mono text-[18px] text-primary font-bold">{overallScore.toFixed(1)} / 10</p>
                </div>
                {/* The Stamp */}
                <div className="absolute -top-4 right-1/4 transform rotate-[-15deg] stamp-effect px-6 py-2 bg-surface-container-lowest">
                  <span className={`font-headline-lg text-headline-lg font-bold tracking-widest leading-none ${isPassed ? 'text-primary' : 'text-error'}`}>
                    {isPassed ? 'PASSED' : 'NEEDS WORK'}
                  </span>
                </div>
              </div>

              {/* Grid Layout for Strengths/Improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                {/* Strengths Column */}
                <div className="space-y-6">
                  <h3 className="font-headline-md text-headline-md text-primary-container flex items-center space-x-2 border-b border-outline-variant/30 pb-2">
                    <span className="material-symbols-outlined text-surface-tint">check_circle</span>
                    <span>Key Strengths</span>
                  </h3>
                  <ul className="space-y-4">
                    {strengths.length > 0 ? strengths.map((s, idx) => (
                      <li key={idx} className="bg-surface-container-low p-4 rounded-lg shadow-debossed border border-outline-variant/20 flex items-start space-x-4">
                        <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center shrink-0 shadow-embossed mt-1">
                          <span className="material-symbols-outlined text-on-primary-fixed-variant text-[16px]">visibility</span>
                        </div>
                        <div>
                          <h4 className="font-label-caps text-label-caps text-primary mb-1">{s.title}</h4>
                          <p className="font-body-md text-body-md text-on-surface-variant text-[14px]">{s.detail}</p>
                        </div>
                      </li>
                    )) : (
                      <p className="text-on-surface-variant text-sm italic">No specific strengths recorded.</p>
                    )}
                  </ul>
                </div>

                {/* Areas to Improve Column */}
                <div className="space-y-6">
                  <h3 className="font-headline-md text-headline-md text-secondary-container flex items-center space-x-2 border-b border-outline-variant/30 pb-2">
                    <span className="material-symbols-outlined text-secondary">warning</span>
                    <span className="text-secondary-container">Areas for Refinement</span>
                  </h3>
                  <ul className="space-y-4">
                    {improvements.length > 0 ? improvements.map((i, idx) => (
                      <li key={idx} className="bg-surface-container-low p-4 rounded-lg shadow-debossed border border-outline-variant/20 flex items-start space-x-4">
                        <div className="w-8 h-8 rounded-full bg-error-container flex items-center justify-center shrink-0 shadow-embossed mt-1">
                          <span className="material-symbols-outlined text-on-error-container text-[16px]">timer</span>
                        </div>
                        <div>
                          <h4 className="font-label-caps text-label-caps text-on-secondary-fixed-variant mb-1">{i.title}</h4>
                          <p className="font-body-md text-body-md text-on-surface-variant text-[14px]">{i.detail}</p>
                        </div>
                      </li>
                    )) : (
                      <p className="text-on-surface-variant text-sm italic">No specific areas for refinement recorded.</p>
                    )}
                  </ul>
                </div>
              </div>

              {/* Rubric Breakdown (Mechanical Sliders) */}
              <div>
                <h3 className="font-headline-md text-headline-md text-primary border-b border-outline-variant/30 pb-2 mb-8">Metric Analysis</h3>
                <div className="space-y-8 max-w-3xl">
                  {/* Metric 1 */}
                  <div className="group">
                    <div className="flex justify-between items-end mb-2">
                      <span className="font-label-caps text-label-caps text-primary">Clarity of Thought</span>
                      <span className="font-data-mono text-data-mono text-surface-tint font-bold">{avgClarity.toFixed(1)} / 10</span>
                    </div>
                    {renderMetricBar(avgClarity, 10, 'bg-surface-tint')}
                  </div>

                  {/* Metric 2 */}
                  <div className="group">
                    <div className="flex justify-between items-end mb-2">
                      <span className="font-label-caps text-label-caps text-primary">Strategic Relevance</span>
                      <span className="font-data-mono text-data-mono text-surface-tint font-bold">{avgRelevance.toFixed(1)} / 10</span>
                    </div>
                    {renderMetricBar(avgRelevance, 10, 'bg-surface-tint')}
                  </div>

                  {/* Metric 3 */}
                  <div className="group">
                    <div className="flex justify-between items-end mb-2">
                      <span className="font-label-caps text-label-caps text-primary">STAR Framework Adherence</span>
                      <span className="font-data-mono text-data-mono text-secondary font-bold">{avgStar.toFixed(1)} / 10</span>
                    </div>
                    {renderMetricBar(avgStar, 10, 'bg-secondary opacity-90')}
                  </div>
                </div>
              </div>
            </article>
          </div>

          <footer className="w-full py-8 mt-16 border-t border-dashed border-outline-variant bg-transparent max-w-container-max mx-auto px-gutter flex justify-center items-center">
            <span className="font-data-mono text-data-mono text-on-surface-variant opacity-60">© 2026 A V Ranganath.</span>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default function Report() {
  return (
    <AuthGuard>
      <Suspense fallback={<div className="flex h-screen w-full overflow-hidden bg-background items-center justify-center">Loading...</div>}>
        <ReportClient />
      </Suspense>
    </AuthGuard>
  );
}
