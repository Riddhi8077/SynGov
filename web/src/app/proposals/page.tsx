import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import BottomNav from "@/components/BottomNav";
import { supabase } from '@/lib/supabase'

export const revalidate = 0; // Disable static rendering

export default async function Proposals() {
  const { data: proposals, error } = await supabase
    .from('proposals')
    .select('*')
    .order('created_at', { ascending: false });

  const safeProposals = proposals || [];

  return (
    <>
      <Navbar />
      <div className="app-layout">
        <Sidebar />
        <BottomNav />
        
        <main className="main-content">
          <div className="page-header">
            <div>
              <h1 className="text-h1">Proposals</h1>
              <p className="text-body-sm" style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
                {safeProposals.length} total proposals
              </p>
            </div>
            <a href="/proposals/create" className="btn btn-primary">+ New Proposal</a>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-sm" style={{ borderRadius: 'var(--radius-pill)' }}>All</button>
            <button className="btn btn-secondary btn-sm" style={{ borderRadius: 'var(--radius-pill)' }}>Active</button>
            <button className="btn btn-secondary btn-sm" style={{ borderRadius: 'var(--radius-pill)' }}>Passed</button>
            <button className="btn btn-secondary btn-sm" style={{ borderRadius: 'var(--radius-pill)' }}>Rejected</button>
            <button className="btn btn-secondary btn-sm" style={{ borderRadius: 'var(--radius-pill)' }}>Closed</button>
            <div style={{ flex: 1 }}></div>
            <input type="text" className="input" placeholder="Search proposals..." style={{ maxWidth: '280px', padding: '8px 16px', fontSize: '0.8125rem' }} />
          </div>

          <div className="proposals-grid">
            {error || safeProposals.length === 0 ? (
               <div style={{textAlign: 'center', padding: '40px', gridColumn: '1 / -1'}}>
                 <p style={{color: 'var(--text-muted)'}}>No proposals found. Be the first to create one!</p>
               </div>
            ) : (
              safeProposals.map((p: any) => {
                const wYes = parseFloat(p.weighted_yes || 0);
                const wNo = parseFloat(p.weighted_no || 0);
                const total = wYes + wNo;
                const yesPercent = total > 0 ? Math.round((wYes / total) * 100) : 0;
                const noPercent = total > 0 ? Math.round((wNo / total) * 100) : 0;

                return (
                  <a key={p.id} href={`/proposals/${p.id}`} className="proposal-card">
                    <div className="proposal-card-badges">
                      <span className={`badge badge-${p.category || 'general'}`}>{p.category || 'general'}</span>
                      <span className={`badge badge-status-${p.status || 'active'}`}>{p.status || 'active'}</span>
                    </div>
                    <h4 className="proposal-card-title">{p.title}</h4>
                    <p className="proposal-card-summary">{p.ai_summary?.what || 'No summary available'}</p>
                    <div className="proposal-card-vote">
                      <div className="proposal-card-vote-header">
                        <span style={{color: 'var(--success)'}}>{wYes.toFixed(1)} for</span>
                        <span style={{color: 'var(--danger)'}}>{wNo.toFixed(1)} against</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-bar-for" style={{width: `${total > 0 ? yesPercent : 0}%`}}></div>
                        <div className="progress-bar-against" style={{width: `${total > 0 ? noPercent : 0}%`}}></div>
                      </div>
                    </div>
                    <div className="proposal-card-meta">
                      <span>💰 {p.budget || 'None'}</span>
                      <span>📅 {p.status === 'active' ? 'Active' : 'Closed'}</span>
                    </div>
                  </a>
                )
              })
            )}
          </div>
        </main>
      </div>
    </>
  )
}
