'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import AuthGuard from '@/components/AuthGuard';
import { api } from '@/lib/api';

export default function SessionsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSessions()
      .then((data: any) => setSessions(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthGuard>
      <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
          <div className="flex-1 overflow-y-auto px-margin-mobile md:px-gutter py-8 md:py-margin-desktop">
            <div className="max-w-container-max mx-auto">
              <header className="mb-12">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="material-symbols-outlined text-primary text-3xl">folder_open</span>
                  <h2 className="font-headline-lg text-headline-lg text-primary">Session Archive</h2>
                </div>
                <p className="font-body-lg text-body-lg text-on-surface-variant">All your interview sessions in one place.</p>
              </header>

              {loading ? (
                <div className="text-on-surface-variant font-body-md text-center py-16">Loading sessions...</div>
              ) : sessions.length === 0 ? (
                <div className="bg-surface-container-lowest rounded-lg embossed-card p-12 text-center border border-dashed border-outline-variant">
                  <span className="material-symbols-outlined text-4xl text-outline mb-4 block">folder_off</span>
                  <p className="font-body-lg text-on-surface-variant">No sessions found. Start a new one from the Briefcase.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {sessions.map((session: any) => (
                    <div
                      key={session.id}
                      className="bg-surface rounded-lg embossed-card p-6 cursor-pointer hover:-translate-y-1 transition-transform border border-outline-variant/20"
                      onClick={() => {
                        if (session.status === 'completed') {
                          router.push(`/report?session=${session.id}`);
                        } else {
                          router.push(`/interview?session=${session.id}`);
                        }
                      }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-data-mono text-data-mono text-on-surface-variant text-xs">ID-{String(session.id).padStart(4, '0')}</span>
                        <span className={`px-3 py-1 rounded-sm font-label-caps text-[10px] uppercase tracking-wider border ${
                          session.status === 'completed' ? 'border-primary text-primary' :
                          session.status === 'in_progress' ? 'border-secondary text-secondary' :
                          'border-outline text-outline'
                        }`}>
                          {session.status?.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="font-body-md text-on-surface mb-4 line-clamp-2">
                        {session.job_description?.slice(0, 120) || 'No description'}...
                      </p>
                      <div className="flex justify-between items-end border-t border-dashed border-outline-variant/30 pt-4">
                        <div>
                          <span className="font-label-caps text-label-caps text-on-surface-variant block text-[10px]">Created</span>
                          <span className="font-data-mono text-data-mono text-primary">
                            {new Date(session.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                          </span>
                        </div>
                        {session.status === 'completed' && (
                          <div className="text-right">
                            <span className="font-label-caps text-label-caps text-on-surface-variant block text-[10px]">Score</span>
                            <span className="font-data-mono text-data-mono text-primary font-bold">
                              {session.overall_score ? Math.round(session.overall_score * 10) : 0}/100
                            </span>
                          </div>
                        )}
                        <div className="text-right">
                          <span className="font-label-caps text-label-caps text-on-surface-variant block text-[10px]">Questions</span>
                          <span className="font-data-mono text-data-mono">{session.questions_count || 0}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
