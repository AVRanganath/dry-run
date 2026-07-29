'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { api } from '@/lib/api';
import AuthGuard from '@/components/AuthGuard';

export default function Dashboard() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getSessions(),
      api.getAnalytics()
    ])
      .then(([sessionsData, analyticsData]) => {
        setSessions(sessionsData);
        setAnalytics(analyticsData);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load dashboard data', err);
        setIsLoading(false);
      });
  }, []);

  const totalSessions = analytics?.total_sessions || 0;
  const avgScore = analytics?.average_score ? Math.round(analytics.average_score * 10) : 0; // Convert 10 scale to 100 scale for UI

  // Helper for rendering tally marks
  const renderTallies = (count: number) => {
    const groups = Math.floor(count / 5);
    const remainder = count % 5;
    
    const elements = [];
    
    for (let i = 0; i < groups; i++) {
      elements.push(
        <div key={`group-${i}`} className="relative flex items-center">
          <div className="tally-mark"></div><div className="tally-mark"></div><div className="tally-mark"></div><div className="tally-mark"></div>
          <div className="tally-diagonal"></div>
        </div>
      );
    }
    
    if (remainder > 0) {
      elements.push(
        <div key="remainder" className="flex items-center">
          {[...Array(remainder)].map((_, i) => <div key={`rem-${i}`} className="tally-mark"></div>)}
        </div>
      );
    }
    
    return elements.length > 0 ? elements : <span className="text-on-surface-variant text-sm italic">No logs yet.</span>;
  };

  const getCardClasses = (index: number) => {
    if (index === 0) return "rotate-[4deg] origin-bottom-left group-hover:rotate-[6deg]";
    if (index === 1) return "rotate-[-3deg] origin-bottom-right group-hover:rotate-[-5deg]";
    return "rotate-[5deg] origin-center group-hover:rotate-[7deg]";
  };
  
  const getCardShadowClasses = (index: number) => {
    if (index === 0) return "rotate-[-2deg] origin-bottom-left group-hover:rotate-[-3deg]";
    if (index === 1) return "rotate-[2deg] origin-bottom-right group-hover:rotate-[4deg]";
    return "rotate-[5deg] origin-center group-hover:rotate-[7deg]";
  };

  const getBorderColor = (index: number) => {
    if (index === 0) return "border-t-primary";
    if (index === 1) return "border-t-secondary";
    return "border-t-on-primary-container";
  };

  return (
    <AuthGuard>
      <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden">
        <Sidebar />

      {/* Main Content Canvas */}
      <main className="flex-1 overflow-y-auto pt-20 md:pt-0">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 space-y-12">
          {/* Dashboard Header */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-outline-variant/30">
            <div>
              <h1 className="font-headline-xl text-headline-xl text-primary mb-2">Progress Hub</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                Your preparation ledger. Review past performance metrics and initiate a new rigorous interview simulation.
              </p>
            </div>
            <Link href="/setup" className="shrink-0 bg-primary text-on-primary font-label-caps text-label-caps px-8 py-4 rounded-sm heavy-button flex items-center space-x-2">
              <span className="material-symbols-outlined text-lg">play_arrow</span>
              <span>Start New Interview</span>
            </Link>
          </header>

          {isLoading ? (
            <div className="flex justify-center items-center h-64 text-on-surface-variant">
              Loading dossier...
            </div>
          ) : (
            <>
              {/* Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Performance Gauge (Analog Meter) */}
                <div className="md:col-span-7 bg-surface p-8 rounded-lg embossed-card flex flex-col relative overflow-hidden">
                  {/* Decorative screws */}
                  <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-outline-variant/50 shadow-inner"></div>
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-outline-variant/50 shadow-inner"></div>
                  <div className="absolute bottom-4 left-4 w-2 h-2 rounded-full bg-outline-variant/50 shadow-inner"></div>
                  <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-outline-variant/50 shadow-inner"></div>
                  
                  <h2 className="font-headline-md text-headline-md text-primary mb-6 flex items-center">
                    <span className="material-symbols-outlined mr-2 opacity-70">speed</span>
                    Aggregate Competency
                  </h2>
                  
                  <div className="flex-1 flex items-center justify-center">
                    <div className="relative w-full max-w-[400px] aspect-[2/1] debossed-well rounded-t-full bg-surface-container-low overflow-hidden border-b-0 flex items-end justify-center pb-2">
                      {/* Gauge Background/Scale */}
                      <div className="absolute inset-0 pt-8 px-8">
                        <svg className="w-full h-full opacity-30" viewBox="0 0 100 50">
                          <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#424843" strokeDasharray="1 3" strokeWidth="0.5"></path>
                          <path d="M 5 50 A 45 45 0 0 1 95 50" fill="none" stroke="#424843" strokeWidth="1"></path>
                        </svg>
                      </div>
                      {/* Gauge Labels */}
                      <div className="absolute bottom-4 left-6 font-data-mono text-data-mono text-xs text-on-surface-variant opacity-60">0</div>
                      <div className="absolute bottom-4 right-6 font-data-mono text-data-mono text-xs text-on-surface-variant opacity-60">100</div>
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 font-data-mono text-data-mono text-xs text-on-surface-variant opacity-60">50</div>
                      
                      {/* The Needle */}
                      <div className="relative w-4 h-4 rounded-full bg-tertiary shadow-md z-10">
                        <div 
                          className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-[140px] bg-secondary origin-bottom rounded-t-full shadow-lg transition-transform duration-1000 ease-out" 
                          style={{ transform: `rotate(${avgScore ? (avgScore / 100) * 180 - 90 : -90}deg)` }}
                        ></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-surface border border-tertiary"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <div className="font-data-mono text-data-mono text-5xl text-primary tracking-tighter">{avgScore}<span className="text-2xl text-on-surface-variant/50">/100</span></div>
                    <div className="font-label-caps text-label-caps text-on-surface-variant mt-2">Current Moving Average</div>
                  </div>
                </div>

                {/* Preparation Ledger (Tally Marks) */}
                <div className="md:col-span-5 bg-surface p-8 rounded-lg embossed-card relative">
                  <h2 className="font-headline-md text-headline-md text-primary mb-6 flex items-center">
                    <span className="material-symbols-outlined mr-2 opacity-70">fact_check</span>
                    Preparation Volume
                  </h2>
                  <div className="debossed-well bg-surface-container-highest p-6 rounded-sm mb-6 min-h-[160px]">
                    <div className="font-label-caps text-label-caps text-on-surface-variant mb-4 border-b border-outline-variant/30 pb-2">Sessions Completed</div>
                    <div className="flex flex-wrap gap-x-6 gap-y-4 pt-2">
                      {renderTallies(totalSessions)}
                    </div>
                  </div>
                  <div className="flex justify-between items-end border-t border-dashed border-outline-variant/50 pt-4">
                    <div className="font-body-md text-body-md text-on-surface-variant">Total Logged</div>
                    <div className="font-data-mono text-data-mono text-2xl text-primary font-bold">{totalSessions}</div>
                  </div>
                </div>

                {/* Recent Sessions (Stacked Case Files) */}
                <div className="md:col-span-12 mt-8">
                  <h2 className="font-headline-md text-headline-md text-primary mb-8 border-b-2 border-primary inline-block pb-2">Recent Sessions</h2>
                  {sessions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 pt-4">
                      {sessions.slice(0, 3).map((session, idx) => (
                        <Link href={`/report?session=${session.id}`} key={session.id} className={`relative h-64 cursor-pointer group ${idx === 2 ? 'hidden md:block' : ''}`}>
                          <div className={`absolute inset-0 bg-surface-container-highest border border-outline-variant/50 rounded-sm shadow-sm transition-transform ${getCardClasses(idx)}`}></div>
                          <div className={`absolute inset-0 bg-surface-container-low border border-outline-variant/50 rounded-sm shadow-sm transition-transform ${getCardShadowClasses(idx)}`}></div>
                          <div className={`absolute inset-0 bg-surface border border-outline-variant/60 rounded-sm embossed-card border-t-[6px] ${getBorderColor(idx)} flex flex-col p-6 transition-transform group-hover:-translate-y-2 group-hover:shadow-[4px_8px_15px_rgba(0,0,0,0.1)]`}>
                            <div className="flex justify-between items-start mb-4">
                              <div className="font-data-mono text-data-mono text-on-surface-variant text-xs">ID-{String(session.id).padStart(4, '0')}-{String.fromCharCode(65 + idx)}</div>
                              <div className="stamp-badge font-label-caps text-[10px] px-2 py-0.5 rounded-sm">
                                {session.status === 'completed' ? 'Reviewed' : 'Action Req'}
                              </div>
                            </div>
                            <h3 className="font-headline-md text-headline-md text-primary mb-2 line-clamp-2">
                              {session.job_description.slice(0, 50)}...
                            </h3>
                            <p className="font-body-md text-body-md text-on-surface-variant text-sm line-clamp-3 mb-auto">
                              Session overview based on provided target mandate and profile.
                            </p>
                            <div className="mt-4 pt-4 border-t border-outline-variant/30 flex justify-between items-center">
                              <div className="font-data-mono text-data-mono text-xs text-on-surface-variant">
                                {new Date(session.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                              </div>
                              <div className="font-data-mono text-data-mono text-primary font-bold">
                                {session.overall_score ? Math.round(session.overall_score * 10) : 0}/100
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-on-surface-variant p-8 text-center bg-surface-container-lowest border border-dashed border-outline-variant rounded">
                      <p>No recent session data located in the archives.</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Footer */}
          <footer className="w-full py-8 border-t border-dashed border-outline-variant max-w-container-max mx-auto flex justify-center items-center mt-16">
            <div className="font-data-mono text-data-mono text-on-surface-variant opacity-60">
              © 2026 A V Ranganath.
            </div>
          </footer>
        </div>
      </main>
    </div>
    </AuthGuard>
  );
}
