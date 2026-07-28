'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import AuthGuard from '@/components/AuthGuard'
import { api, Session } from '@/lib/api'

export default function ReportsPage() {
  const router = useRouter()
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await api.getSessions()
        setSessions(data.filter(s => s.status === 'completed'))
      } catch (error) {
        console.error('Failed to fetch sessions:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSessions()
  }, [])

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      <AuthGuard>
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
          <div className="flex-1 overflow-y-auto px-margin-mobile md:px-gutter py-8 md:py-margin-desktop">
            <div className="max-w-container-max mx-auto">
              <header className="flex items-center gap-4 mb-8 pb-4 border-b border-primary/20">
                <span className="material-symbols-outlined text-4xl text-primary">assignment</span>
                <h1 className="font-headline-lg text-headline-lg text-primary m-0">Evaluation Reports</h1>
              </header>

              {loading ? (
                <div className="text-on-surface-variant font-body-md">Loading...</div>
              ) : sessions.length === 0 ? (
                <div className="bg-surface rounded-lg embossed-card p-8 text-center">
                  <p className="font-body-md text-on-surface-variant">No completed sessions yet.</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {sessions.map((session) => (
                    <div 
                      key={session.id} 
                      className="bg-surface rounded-lg shadow-stacked-paper p-6 cursor-pointer hover:-translate-y-1 transition-transform border border-primary/10"
                      onClick={() => router.push(`/report?session=${session.id}`)}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="font-data-mono text-data-mono text-on-surface-variant">{session.id.substring(0, 8)}</div>
                        <div className="font-data-mono text-data-mono bg-primary text-white px-2 py-1 rounded">Score: {session.score || 0}</div>
                      </div>
                      <p className="font-body-md text-on-surface mb-6 line-clamp-2">
                        {session.job_description || 'No description'}
                      </p>
                      <div className="flex justify-between items-center pt-4 border-t border-primary/10 border-dashed">
                        <span className="font-label-caps text-label-caps text-on-surface-variant">Date</span>
                        <span className="font-data-mono text-data-mono">{new Date(session.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </AuthGuard>
    </div>
  )
}
