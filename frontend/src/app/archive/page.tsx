'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import AuthGuard from '@/components/AuthGuard';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function Archive() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useState(() => {
    api.getSessions()
      .then((data: any) => { setSessions(Array.isArray(data) ? data : []); setIsLoading(false); })
      .catch(() => setIsLoading(false));
  });

  return (
    <AuthGuard>
      <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
          <main className="flex-1 overflow-y-auto px-margin-mobile md:px-gutter py-8 md:py-margin-desktop">
            <div className="max-w-container-max mx-auto">
              <header className="mb-12">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="material-symbols-outlined text-primary text-3xl">inventory_2</span>
                  <h2 className="font-headline-lg text-headline-lg text-primary">Archive Vault</h2>
                </div>
                <p className="font-body-lg text-body-lg text-on-surface-variant">Complete historical record of all operational sessions.</p>
              </header>

              {isLoading ? (
                <div className="flex justify-center items-center h-64 text-on-surface-variant">Loading archive...</div>
              ) : sessions.length === 0 ? (
                <div className="text-on-surface-variant p-12 text-center bg-surface-container-lowest border border-dashed border-outline-variant rounded embossed-card">
                  <span className="material-symbols-outlined text-4xl text-outline mb-4 block">folder_off</span>
                  <p className="font-body-lg">No records found in the archive.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session: any) => (
                    <Link 
                      key={session.id}
                      href={session.status === 'completed' ? `/report?session=${session.id}` : `/interview?session=${session.id}`}
                      className="block bg-surface p-6 rounded-lg embossed-card hover:-translate-y-1 transition-transform border border-outline-variant/20 opacity-80 hover:opacity-100"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="font-data-mono text-data-mono text-outline text-xs">ID-{String(session.id).padStart(4, '0')}</span>
                            <span className={`font-label-caps text-[10px] px-2 py-0.5 rounded-sm border ${
                              session.status === 'completed' ? 'border-primary text-primary' :
                              session.status === 'in_progress' ? 'border-secondary text-secondary' :
                              'border-outline text-outline'
                            }`}>
                              {session.status?.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                          <p className="font-body-md text-on-surface truncate">{session.job_description?.slice(0, 100)}...</p>
                          <p className="font-data-mono text-data-mono text-on-surface-variant text-xs mt-2">
                            {new Date(session.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                            {session.questions_count ? ` · ${session.questions_count} questions` : ''}
                          </p>
                        </div>
                        {session.overall_score && (
                          <div className="font-data-mono text-data-mono text-primary font-bold text-lg ml-4">
                            {Math.round(session.overall_score * 10)}/100
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
