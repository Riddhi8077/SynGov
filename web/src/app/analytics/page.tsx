import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import BottomNav from "@/components/BottomNav";
import { supabase } from '@/lib/supabase'
import { getUser } from '@/app/auth-actions'

export const revalidate = 0;

export default async function Analytics() {
  const user = await getUser()
  
  // 1. Fetch real proposals
  const { data: proposals } = await supabase
    .from('proposals')
    .select('*')
    
  const safeProposals = proposals || [];
  const totalProposals = safeProposals.length;
  
  // 2. Real pass/reject metrics
  const passedProposals = safeProposals.filter(p => p.status === 'passed').length;
  const rejectedProposals = safeProposals.filter(p => p.status === 'rejected').length;
  const pendingProposals = safeProposals.filter(p => p.status === 'active').length;
  const closedCount = passedProposals + rejectedProposals;
  
  // A proposal requires 60% to pass, if we just look at statuses:
  const passRate = closedCount > 0 ? Math.round((passedProposals / closedCount) * 100) : 0;
  const rejectRate = closedCount > 0 ? Math.round((rejectedProposals / closedCount) * 100) : 0;
  
  // 3. Real Categorization
  const categories = { finance: 0, events: 0, tech: 0, operations: 0, general: 0 };
  let maxCat = 1;
  safeProposals.forEach(p => {
    const cat = (p.category || 'general').toLowerCase();
    if (cat in categories) {
      categories[cat as keyof typeof categories]++;
    } else {
      categories.general++;
    }
  });
  
  maxCat = Math.max(...Object.values(categories), 1); // Avoid div by 0 for bar height scaling

  // 4. Fetch contribution activity for health metrics
  const { data: acts } = await supabase.from('contribution_activity').select('id');
  const activityCount = acts?.length || 0;
  const healthScore = Math.min(100, Math.round(50 + (activityCount * 0.5) + (totalProposals * 2)));

  return (
    <>
      <Navbar user={user} />
      <div className="app-layout">
        <Sidebar user={user} />
        <BottomNav />
        <main className="main-content">
          <div className="dashboard-header">
            <img src="/images/community-celebration.png" alt="Community analytics" />
            <div className="dashboard-header-overlay">
              <div className="dashboard-header-text">
                <h2 className="text-h2">Community Analytics</h2>
                <p className="text-body-sm">Governance health metrics and participation insights</p>
              </div>
            </div>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-card-label">Total Proposals</div>
              <div className="stat-card-value" data-count={totalProposals}>{totalProposals}</div>
              <div className="stat-card-delta up">Live Data</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-label">Passed</div>
              <div className="stat-card-value" data-count={passedProposals}>{passedProposals}</div>
              <div className="stat-card-delta" style={{color: 'var(--success)'}}>{passRate}% pass rate</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-label">Rejected</div>
              <div className="stat-card-value" data-count={rejectedProposals}>{rejectedProposals}</div>
              <div className="stat-card-delta" style={{color: 'var(--danger)'}}>{rejectRate}% reject rate</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-label">Health Score</div>
              <div className="stat-card-value" data-count={healthScore}>{healthScore}</div>
              <div className="stat-card-delta up">Dynamic Metric</div>
            </div>
          </div>

          <div className="analytics-grid" style={{marginBottom: '32px'}}>
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="text-h4">Proposals by Category</h3>
              </div>
              <div className="bar-chart">
                <div className="bar-group">
                  <div className="bar" style={{height: `${(categories.finance / maxCat) * 150}px`, minHeight: '5px', maxHeight: '180px', background: 'var(--cat-finance)'}}></div>
                  <div className="bar-label">Finance</div>
                  <div className="text-data" style={{fontSize: '0.75rem'}}>{categories.finance}</div>
                </div>
                <div className="bar-group">
                  <div className="bar" style={{height: `${(categories.events / maxCat) * 150}px`, minHeight: '5px', maxHeight: '180px', background: 'var(--cat-events)'}}></div>
                  <div className="bar-label">Events</div>
                  <div className="text-data" style={{fontSize: '0.75rem'}}>{categories.events}</div>
                </div>
                <div className="bar-group">
                  <div className="bar" style={{height: `${(categories.tech / maxCat) * 150}px`, minHeight: '5px', maxHeight: '180px', background: 'var(--cat-tech)'}}></div>
                  <div className="bar-label">Tech</div>
                  <div className="text-data" style={{fontSize: '0.75rem'}}>{categories.tech}</div>
                </div>
                <div className="bar-group">
                  <div className="bar" style={{height: `${(categories.operations / maxCat) * 150}px`, minHeight: '5px', maxHeight: '180px', background: 'var(--cat-operations)'}}></div>
                  <div className="bar-label">Ops</div>
                  <div className="text-data" style={{fontSize: '0.75rem'}}>{categories.operations}</div>
                </div>
                <div className="bar-group">
                  <div className="bar" style={{height: `${(categories.general / maxCat) * 150}px`, minHeight: '5px', maxHeight: '180px', background: 'var(--cat-general)'}}></div>
                  <div className="bar-label">General</div>
                  <div className="text-data" style={{fontSize: '0.75rem'}}>{categories.general}</div>
                </div>
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <h3 className="text-h4">Activity Log Count</h3>
              </div>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                 <div style={{textAlign: 'center'}}>
                    <div className="text-h1" style={{color: 'var(--accent)', fontSize: '4rem'}}>{activityCount}</div>
                    <div className="text-body" style={{color: 'var(--text-muted)'}}>Total Contribution Events Logged</div>
                 </div>
              </div>
            </div>
          </div>

          <div className="analytics-grid">
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="text-h4">Proposal Outcomes</h3>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '32px', padding: '20px 0'}}>
                <div className="donut-chart" style={{background: closedCount === 0 ? 'var(--surface)' : `conic-gradient(var(--success) 0% ${passRate}%, var(--danger) ${passRate}% ${passRate + rejectRate}%, var(--text-subtle) ${passRate + rejectRate}% 100%)`}}>
                  <div className="donut-center">
                    <div className="text-data" style={{fontSize: '1.5rem', color: 'var(--text-primary)'}}>{passRate}%</div>
                    <div className="text-caption" style={{color: 'var(--text-muted)'}}>pass rate</div>
                  </div>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <div style={{width: '12px', height: '12px', borderRadius: '3px', background: 'var(--success)'}}></div>
                    <div>
                      <div className="text-body-sm" style={{fontWeight: 600}}>{passedProposals} Passed</div>
                    </div>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <div style={{width: '12px', height: '12px', borderRadius: '3px', background: 'var(--danger)'}}></div>
                    <div>
                      <div className="text-body-sm" style={{fontWeight: 600}}>{rejectedProposals} Rejected</div>
                    </div>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <div style={{width: '12px', height: '12px', borderRadius: '3px', background: 'var(--text-subtle)'}}></div>
                    <div>
                      <div className="text-body-sm" style={{fontWeight: 600}}>{pendingProposals} Active</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <h3 className="text-h4">Community Health Details</h3>
                <span className="badge badge-status-active">Score: {healthScore}</span>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', gap: '20px', padding: '8px 0'}}>
                <div>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '6px'}}>
                    <span className="text-body-sm" style={{fontWeight: 500}}>Proposals Volume</span>
                    <span className="text-data" style={{fontSize: '0.75rem', color: 'var(--success)'}}>{totalProposals > 5 ? 'High' : 'Growing'}</span>
                  </div>
                  <div className="progress-bar" style={{height: '6px'}}>
                    <div className="progress-bar-for" style={{width: `${Math.min(100, totalProposals * 10)}%`}}></div>
                  </div>
                </div>
                <div>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '6px'}}>
                    <span className="text-body-sm" style={{fontWeight: 500}}>Activity Velocity</span>
                    <span className="text-data" style={{fontSize: '0.75rem', color: 'var(--accent)'}}>{activityCount > 20 ? 'Strong' : 'Average'}</span>
                  </div>
                  <div className="progress-bar" style={{height: '6px'}}>
                    <div style={{width: `${Math.min(100, activityCount * 2)}%`, background: 'var(--accent)', borderRadius: 'inherit'}}></div>
                  </div>
                </div>
                <div>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '6px'}}>
                    <span className="text-body-sm" style={{fontWeight: 500}}>Pending Decisions</span>
                    <span className="text-data" style={{fontSize: '0.75rem', color: 'var(--warning)'}}>{pendingProposals}</span>
                  </div>
                  <div className="progress-bar" style={{height: '6px'}}>
                    <div style={{width: `${Math.min(100, pendingProposals * 15)}%`, background: 'var(--warning)', borderRadius: 'inherit'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
