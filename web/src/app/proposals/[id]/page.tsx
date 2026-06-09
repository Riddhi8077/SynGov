'use client'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import BottomNav from "@/components/BottomNav";
import { useState, useEffect, use } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import VotingPanel from '@/components/VotingPanel'

export default function ProposalDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [proposal, setProposal] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  // User Profile State
  const [userProfile, setUserProfile] = useState<any>(null)
  const [userVoteRecord, setUserVoteRecord] = useState<any>(null)

  const [newComment, setNewComment] = useState('')
  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'Priya Sharma',
      avatar: 'PS',
      time: '2 hours ago',
      text: 'I think the budget breakdown looks reasonable. One question — have we explored any sponsorship options to offset costs?'
    },
    {
      id: 2,
      author: 'Rahul Kumar',
      avatar: 'RK',
      time: '1 hour ago',
      text: '@Priya — great point! We\'ve reached out to 3 local tech companies for sponsorship.'
    }
  ])

  useEffect(() => {
    async function fetchData() {
      // 1. Fetch Proposal
      const { data: propData } = await supabase
        .from('proposals')
        .select('*')
        .eq('id', resolvedParams.id)
        .single()
      
      if (propData) {
        setProposal(propData)
      }

      // 2. Fetch logged in user
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.email) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('email', session.user.email)
          .single()
        
        if (profile) {
          setUserProfile(profile)
          
          // 3. Check if user already voted
          if (propData) {
            const { data: vote } = await supabase
              .from('votes')
              .select('*')
              .eq('proposal_id', propData.id)
              .eq('user_id', profile.id)
              .single()
            
            if (vote) {
              setUserVoteRecord(vote)
            }
          }
        }
      }

      setLoading(false)
    }
    fetchData()
  }, [resolvedParams.id])

  const handlePostComment = () => {
    if (!newComment.trim()) return
    const newEntry = {
      id: Date.now(),
      author: 'You',
      avatar: 'AM',
      time: 'Just now',
      text: newComment
    }
    setComments([...comments, newEntry])
    setNewComment('')
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="app-layout">
          <Sidebar />
          <BottomNav />
          <main className="main-content">
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading proposal...</div>
          </main>
        </div>
      </>
    )
  }

  if (!proposal) {
    return (
      <>
        <Navbar />
        <div className="app-layout">
          <Sidebar />
          <BottomNav />
          <main className="main-content">
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--danger)' }}>Proposal not found.</div>
          </main>
        </div>
      </>
    )
  }

  const aiSummary = proposal.ai_summary || {}

  return (
    <>
      <Navbar />
      <div className="app-layout">
        <Sidebar />
        <BottomNav />
        <main className="main-content">
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '0.8125rem'}}>
            <Link href="/proposals" style={{color: 'var(--text-muted)'}}>Proposals</Link>
            <span style={{color: 'var(--text-subtle)'}}>/</span>
            <span style={{color: 'var(--text-primary)', fontWeight: 500}}>{proposal.title}</span>
          </div>

          <div className="detail-layout">
            <div>
              <div className="mb-24">
                <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px'}}>
                  <span className={`badge badge-${proposal.category || 'general'}`}>{proposal.category || 'general'}</span>
                  <span className={`badge badge-risk-${proposal.risk_level || 'low'}`}>{proposal.risk_level || 'low'} risk</span>
                  <span className={`badge badge-status-${proposal.status || 'active'}`}>{proposal.status || 'active'}</span>
                </div>
                <h1 className="text-h1 mb-8">{proposal.title}</h1>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8125rem', color: 'var(--text-muted)'}}>
                  <span>Proposed by <strong style={{color: 'var(--text-primary)'}}>Community Member</strong></span>
                  <span>·</span>
                  <span>{new Date(proposal.created_at).toLocaleDateString()}</span>
                  <span>·</span>
                  <span>Closes {new Date(new Date(proposal.created_at).getTime() + 30*24*60*60*1000).toLocaleDateString()}</span>
                </div>
              </div>

              {aiSummary && Object.keys(aiSummary).length > 0 && (
                <div className="kpi-panel mb-24">
                  <div className="kpi-header">
                    <div className="kpi-header-title">
                      <span>✨</span> AI Summary
                    </div>
                    <span className="ai-badge">Generated by Gemini 2.5 Flash</span>
                  </div>
                  <div className="kpi-grid">
                    <div className="kpi-cell">
                      <div className="kpi-label">📋 What</div>
                      <div className="kpi-value">{aiSummary.what || 'Not specified'}</div>
                    </div>
                    <div className="kpi-cell">
                      <div className="kpi-label">💡 Why</div>
                      <div className="kpi-value">{aiSummary.why || 'Not specified'}</div>
                    </div>
                    <div className="kpi-cell">
                      <div className="kpi-label">💰 Cost</div>
                      <div className="kpi-value" style={{fontFamily: 'var(--font-mono)'}}>{aiSummary.cost || proposal.budget || 'Not specified'}</div>
                    </div>
                    <div className="kpi-cell">
                      <div className="kpi-label">📈 Impact</div>
                      <div className="kpi-value">{aiSummary.impact || 'Not specified'}</div>
                    </div>
                    <div className="kpi-cell">
                      <div className="kpi-label">⚠️ Risk</div>
                      <div className="kpi-value"><span className={`badge badge-risk-${aiSummary.risk || proposal.risk_level || 'low'}`}>{aiSummary.risk || proposal.risk_level || 'low'}</span></div>
                    </div>
                    <div className="kpi-cell">
                      <div className="kpi-label">📅 Deadline</div>
                      <div className="kpi-value" style={{fontFamily: 'var(--font-mono)'}}>{aiSummary.deadline || proposal.deadline || 'Not specified'}</div>
                    </div>
                    <div className="kpi-cell full-width">
                      <div className="kpi-label">👥 Who it affects</div>
                      <div className="kpi-value">{aiSummary.affects || 'All community members'}</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="card-flat mb-24">
                <h3 className="text-h4 mb-12">Full Proposal</h3>
                <div className="text-body" style={{color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-wrap'}}>
                  {proposal.description || 'No description provided.'}
                </div>
              </div>

              <div className="card-flat">
                <h3 className="text-h4 mb-20">Discussion</h3>

                <div className="discussion-thread mb-24">
                  {comments.map((comment) => (
                    <div key={comment.id} className="comment">
                      <div className="comment-avatar">{comment.avatar}</div>
                      <div className="comment-body">
                        <div className="comment-header">
                          <span className="comment-author">{comment.author}</span>
                          <span className="comment-time">{comment.time}</span>
                        </div>
                        <p className="comment-text">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{display: 'flex', gap: '12px'}}>
                  <div className="comment-avatar" style={{background: 'var(--accent)', color: '#fff'}}>AM</div>
                  <div style={{flex: 1}}>
                    <textarea 
                      className="textarea" 
                      placeholder="Add your thoughts to the discussion..." 
                      style={{minHeight: '80px'}}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    ></textarea>
                    <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '8px'}}>
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={handlePostComment}
                        disabled={!newComment.trim()}
                      >
                        Post Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="detail-right" style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
              
              {/* ── VOTING PANEL REPLACEMENT ── */}
              {userProfile ? (
                <VotingPanel 
                  proposalId={proposal.id}
                  proposalCategory={proposal.category || 'general'}
                  proposalStatus={proposal.status || 'active'}
                  deadline={proposal.deadline}
                  weightedYes={parseFloat(proposal.weighted_yes || 0)}
                  weightedNo={parseFloat(proposal.weighted_no || 0)}
                  txHash={proposal.tx_hash}
                  userId={userProfile.id}
                  userName={userProfile.name}
                  userContributionScore={userProfile.contribution_score || 0}
                  userGovernanceWeight={userProfile.governance_weight || 1}
                  userExpertiseTags={userProfile.expertise_tags || []}
                  userHasVoted={!!userVoteRecord}
                  userVoteType={userVoteRecord?.vote_type}
                  userVoteWeight={userVoteRecord?.final_weight}
                />
              ) : (
                <div className="card-flat" style={{textAlign: 'center', padding: '32px 16px'}}>
                  <p style={{color: 'var(--text-muted)'}}>Please log in to view and participate in governance voting.</p>
                </div>
              )}

              <div className="card-flat">
                <h4 className="text-h4 mb-16">Details</h4>
                <div style={{display: 'flex', flexDirection: 'column', gap: '14px'}}>
                  <div>
                    <div className="text-caption" style={{color: 'var(--text-muted)', marginBottom: '2px'}}>Category</div>
                    <div className="text-body-sm" style={{fontWeight: 500, textTransform: 'capitalize'}}>{proposal.category || 'General'}</div>
                  </div>
                  <div>
                    <div className="text-caption" style={{color: 'var(--text-muted)', marginBottom: '2px'}}>Budget</div>
                    <div className="text-data">{proposal.budget || 'None'}</div>
                  </div>
                  <div>
                    <div className="text-caption" style={{color: 'var(--text-muted)', marginBottom: '2px'}}>Timeline</div>
                    <div className="text-body-sm" style={{fontWeight: 500}}>{proposal.timeline || 'Not specified'}</div>
                  </div>
                  <div>
                    <div className="text-caption" style={{color: 'var(--text-muted)', marginBottom: '2px'}}>Risk Level</div>
                    <span className={`badge badge-risk-${proposal.risk_level || 'low'}`}>{proposal.risk_level || 'low'}</span>
                  </div>
                  <div>
                    <div className="text-caption" style={{color: 'var(--text-muted)', marginBottom: '2px'}}>Status</div>
                    <span className={`badge badge-status-${proposal.status || 'active'}`}>{proposal.status || 'active'}</span>
                  </div>
                </div>
              </div>

              {/* Only show the blockchain manual link if the VotingPanel isn't already showing the banner with the link */}
              {(!proposal.tx_hash) && (
                <div className="card-flat" style={{borderColor: 'var(--accent-muted)', background: 'var(--accent-light)'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
                    <span>🔗</span>
                    <span className="text-body-sm" style={{fontWeight: 600, color: 'var(--accent)'}}>Blockchain Connected</span>
                  </div>
                  <p className="text-caption" style={{color: 'var(--text-muted)', marginBottom: '8px'}}>This governance system leverages Polygon Amoy for transparent and immutable vote logging.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
