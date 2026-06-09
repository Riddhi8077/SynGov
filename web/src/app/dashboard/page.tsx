import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import BottomNav from "@/components/BottomNav";
import { supabase } from '@/lib/supabase'
import { getUser } from '@/app/auth-actions'
import Link from 'next/link'

export const revalidate = 0;

export default async function Dashboard() {
  const user = await getUser()
  
  // Get DB user for real score
  let dbUser = null;
  if (user?.email) {
    const { data } = await supabase.from('users').select('*').eq('email', user.email).single();
    dbUser = data;
  }

  const displayName = dbUser?.name || user?.name || "Guest"
  
  // 1. Fetch real proposals
  const { data: proposals } = await supabase
    .from('proposals')
    .select('*, users!proposals_author_id_fkey(name)')
    .order('created_at', { ascending: false });
    
  // 2. Fetch all users count
  const { count: totalMembers } = await supabase
    .from('users')
    .select('id', { count: 'exact', head: true });

  // 3. Fetch recent activity feed
  const { data: activities } = await supabase
    .from('contribution_activity')
    .select('*, users!inner(name)')
    .order('created_at', { ascending: false })
    .limit(10);
    
  const safeProposals = proposals || [];
  const totalProposals = safeProposals.length;
  const activeProposals = safeProposals.filter(p => p.status === 'active');
  const activeCount = activeProposals.length;

  // Participation Rate estimation (average of passed/rejected proposals)
  const closedProposals = safeProposals.filter(p => p.status === 'passed' || p.status === 'rejected');
  let avgParticipation = 0;
  if (closedProposals.length > 0 && totalMembers) {
    // We don't have direct participation_rate in schema, so we estimate based on total votes recorded if any,
    // Or just a placeholder if no closed proposals exist yet.
    avgParticipation = 45; // Default fallback
  }

  // Time formatter
  const timeAgo = (dateStr: string) => {
    const diff = new Date().getTime() - new Date(dateStr).getTime();
    const min = Math.floor(diff / 60000);
    if (min < 60) return `${min} min ago`;
    const hours = Math.floor(min / 60);
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
  }

  return (
    <>
      <Navbar user={user} />
      <div className="app-layout">
        <Sidebar user={user} />
        <BottomNav />
        <main className="main-content">
          <div className="dashboard-header">
            <img src="/images/team-discussion.png" alt="Team collaboration" />
            <div className="dashboard-header-overlay">
              <div className="dashboard-header-text">
                <h2 className="text-h2">Good afternoon, {displayName.split(' ')[0]}</h2>
                <p className="text-body-sm">{activeCount} proposals active · Community health is strong</p>
              </div>
            </div>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-card-label">Total Proposals</div>
              <div className="stat-card-value" data-count={totalProposals}>{totalProposals}</div>
              <div className="stat-card-delta up">Live from Supabase</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-label">Total Members</div>
              <div className="stat-card-value" data-count={totalMembers || 0}>{totalMembers || 0}</div>
              <div className="stat-card-delta up">Live from Supabase</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-label">Active Votes</div>
              <div className="stat-card-value" data-count={activeCount}>{activeCount}</div>
              <div className="stat-card-delta">Awaiting decisions</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-label">Your Score</div>
              <div className="stat-card-value" data-count={dbUser?.contribution_score || 0}>{dbUser?.contribution_score || 0}</div>
              <div className="stat-card-delta up">Weight: {dbUser?.governance_weight || 1}x</div>
            </div>
          </div>

          <div className="page-header">
            <h3 className="text-h3">Active Proposals</h3>
            <Link href="/proposals/create" className="btn btn-primary btn-sm">+ New Proposal</Link>
          </div>

          <div className="proposals-grid mb-32">
              {activeProposals.length === 0 ? (
                <p style={{color: 'var(--text-muted)'}}>No active proposals currently.</p>
              ) : (
                activeProposals.slice(0, 4).map((p: any) => {
                  const wYes = parseFloat(p.weighted_yes || 0);
                  const wNo = parseFloat(p.weighted_no || 0);
                  const total = wYes + wNo;
                  const yesPercent = total > 0 ? Math.round((wYes / total) * 100) : 0;
                  const noPercent = total > 0 ? Math.round((wNo / total) * 100) : 0;

                  return (
                    <Link key={p.id} href={`/proposals/${p.id}`} className="proposal-card">
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
                        <span>📅 Active</span>
                      </div>
                    </Link>
                  )
                })
              )}
          </div>

          <div className="page-header">
            <h3 className="text-h3">Recent Activity</h3>
          </div>

          <div className="card-flat">
            <div className="activity-feed">
              {!activities || activities.length === 0 ? (
                <p style={{color: 'var(--text-muted)'}}>No recent activity.</p>
              ) : (
                activities.map((act: any) => (
                  <div key={act.id} className="activity-item">
                    <div className="activity-dot" style={{background: act.points_change < 0 ? 'var(--danger)' : 'var(--accent)'}}></div>
                    <div>
                      <p className="text-body-sm">
                        <strong>{(act.users as any)?.name || 'Someone'}</strong> {act.description}
                      </p>
                      <span className="activity-time">{timeAgo(act.created_at)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
