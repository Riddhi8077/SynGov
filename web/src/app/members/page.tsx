import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import BottomNav from "@/components/BottomNav";
import { supabase } from '@/lib/supabase'
import { getUser } from '@/app/auth-actions'

export const revalidate = 0;

export default async function Members() {
  const user = await getUser()
  
  // Fetch real users ordered by score
  const { data: members, error } = await supabase
    .from('users')
    .select('*')
    .order('contribution_score', { ascending: false });

  const safeMembers = members || [];
  
  // Fetch total votes count per user to display on card
  // This is a little heavy for a massive DB, but fine for a small community DB
  const { data: votes } = await supabase.from('votes').select('user_id');
  const voteCounts: Record<string, number> = {};
  if (votes) {
    votes.forEach(v => {
      voteCounts[v.user_id] = (voteCounts[v.user_id] || 0) + 1;
    });
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  return (
    <>
      <Navbar user={user} />
      <div className="app-layout">
        <Sidebar user={user} />
        <BottomNav />
        <main className="main-content">
          <div className="dashboard-header">
            <img src="/images/hero-collab.png" alt="Community members" />
            <div className="dashboard-header-overlay">
              <div className="dashboard-header-text">
                <h2 className="text-h2">Members Directory</h2>
                <p className="text-body-sm">{safeMembers.length} total members registered</p>
              </div>
            </div>
          </div>

          <div style={{display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap'}}>
            <button className="btn btn-primary btn-sm" style={{borderRadius: 'var(--radius-pill)'}}>All Members</button>
            <div style={{flex: 1}}></div>
            <input type="text" className="input" placeholder="Search members..." style={{maxWidth: '260px', padding: '8px 16px', fontSize: '0.8125rem'}} />
          </div>

          <div className="members-grid">
            {error || safeMembers.length === 0 ? (
              <p style={{color: 'var(--text-muted)'}}>No members found.</p>
            ) : (
              safeMembers.map(m => {
                const score = m.contribution_score || 0;
                let tier = 'low';
                let tierColor = '#9CA3AF';
                let tierBg = '#F3F4F6';
                if (score >= 100) { tier = 'core'; tierColor = '#fff'; tierBg = 'var(--success)'; }
                else if (score >= 50) { tier = 'high'; tierColor = '#1D4ED8'; tierBg = '#DBEAFE'; }
                else if (score >= 20) { tier = 'medium'; tierColor = '#B45309'; tierBg = '#FEF3C7'; }

                return (
                  <div key={m.id} className="member-card">
                    <div className="member-avatar" style={{background: 'var(--accent)', color: '#fff'}}>{getInitials(m.name)}</div>
                    <div className="member-name">{m.name}</div>
                    <div className="member-role">
                      Member · <span className="badge" style={{fontSize: '0.6875rem', background: tierBg, color: tierColor}}>{tier}</span>
                    </div>
                    <div className="member-stats">
                      <div className="member-stat">
                        <div className="member-stat-value">{score}</div>
                        <div className="member-stat-label">Score</div>
                      </div>
                      <div className="member-stat">
                        <div className="member-stat-value">{m.governance_weight || 1}×</div>
                        <div className="member-stat-label">Weight</div>
                      </div>
                      <div className="member-stat">
                        <div className="member-stat-value">{voteCounts[m.id] || 0}</div>
                        <div className="member-stat-label">Votes</div>
                      </div>
                    </div>
                    <div className="member-tags">
                      {(m.expertise_tags || []).length > 0 ? (
                        m.expertise_tags.map((tag: string) => (
                          <span key={tag} className="member-tag">{tag}</span>
                        ))
                      ) : (
                        <span className="member-tag" style={{background: 'transparent', border: '1px dashed var(--border)'}}>No tags</span>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </main>
      </div>
    </>
  )
}
