'use client'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import BottomNav from "@/components/BottomNav";
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { generateProposalSummary, createProposal } from '@/app/actions'

export default function CreateProposal() {
  const router = useRouter()
  const [description, setDescription] = useState('')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [budget, setBudget] = useState('')
  const [timeline, setTimeline] = useState('')
  const [riskLevel, setRiskLevel] = useState('low')
  const [deadline, setDeadline] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)
    
    try {
      // 1. Generate real AI Summary via Gemini
      const aiSummary = await generateProposalSummary(description, title, budget, timeline)
      
      // 2. Save to Supabase and log to Blockchain
      const result = await createProposal({
        title,
        category,
        description,
        budget,
        timeline,
        riskLevel,
        deadline,
        aiSummary
      })
      
      // 3. Redirect to the actual real newly created proposal
      if (result.success && result.id) {
        router.push(`/proposals/${result.id}`)
      }
    } catch (err) {
      console.error(err)
      alert("Failed to create proposal. Please try again.")
      setIsSubmitting(false)
    }
  }

  const showAiPreview = description.length > 50

  return (
    <>
      <Navbar />
      <div className="app-layout">
        <Sidebar />
        <BottomNav />
        <main className="main-content">
          <div className="mb-32">
            <h1 className="text-h1 mb-8">Create a Proposal</h1>
            <p className="text-body" style={{color: 'var(--text-muted)', maxWidth: '500px'}}>
              Describe your idea. AI will extract the key details and create a structured summary for your community to review.
            </p>
          </div>

          <div className="create-layout">
            <div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="label" htmlFor="proposal-title">Proposal Title</label>
                  <input type="text" id="proposal-title" className="input" placeholder="e.g. Annual Hackathon Event Budget" required value={title} onChange={e => setTitle(e.target.value)} />
                </div>

                <div className="form-group">
                  <label className="label" htmlFor="proposal-category">Category</label>
                  <select id="proposal-category" className="select" required value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="" disabled>Select a category</option>
                    <option value="finance">💰 Finance</option>
                    <option value="events">🎉 Events</option>
                    <option value="tech">💻 Tech</option>
                    <option value="operations">⚙️ Operations</option>
                    <option value="general">📋 General</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="label" htmlFor="proposal-description">Description</label>
                  <textarea id="proposal-description" className="textarea" style={{minHeight: '200px'}} placeholder="Describe your proposal in detail. Include context, reasoning, and any supporting data. The AI will extract key information automatically.

Example: We propose allocating ₹20,000 from the club treasury to organize our annual hackathon. The budget covers venue rental (₹5,000), food (₹6,000), prizes (₹5,000), branding (₹2,500), and contingency (₹1,500). Expected attendance: 150+ students." required value={description} onChange={e => setDescription(e.target.value)}></textarea>
                </div>

                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                  <div className="form-group">
                    <label className="label" htmlFor="proposal-budget">Budget</label>
                    <input type="text" id="proposal-budget" className="input" placeholder="₹20,000 or none" value={budget} onChange={e => setBudget(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="label" htmlFor="proposal-timeline">Timeline</label>
                    <input type="text" id="proposal-timeline" className="input" placeholder="e.g. 3 months, Q2 2025" value={timeline} onChange={e => setTimeline(e.target.value)} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="label">Risk Level</label>
                  <div className="segmented-control" id="riskControl">
                    <div className={`segmented-option ${riskLevel === 'low' ? 'active' : ''}`} onClick={() => setRiskLevel('low')}>🟢 Low</div>
                    <div className={`segmented-option ${riskLevel === 'medium' ? 'active' : ''}`} onClick={() => setRiskLevel('medium')}>🟡 Medium</div>
                    <div className={`segmented-option ${riskLevel === 'high' ? 'active' : ''}`} onClick={() => setRiskLevel('high')}>🔴 High</div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="label" htmlFor="proposal-deadline">Voting Deadline</label>
                  <input type="date" id="proposal-deadline" className="input" required value={deadline} onChange={e => setDeadline(e.target.value)} />
                </div>

                <div style={{display: 'flex', gap: '12px', marginTop: '32px'}}>
                  <button type="submit" className="btn btn-primary" style={{padding: '14px 32px'}} disabled={isSubmitting}>
                    {isSubmitting ? 'Generating AI Summary & Submitting...' : 'Submit Proposal'}
                  </button>
                  <a href="/proposals" className="btn btn-secondary">Cancel</a>
                </div>
              </form>
            </div>

            <div className="ai-preview">
              <div className="ai-preview-header">
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <span style={{fontSize: '1.25rem'}}>✨</span>
                  <h3 className="text-h4">AI Preview</h3>
                </div>
                <span className="ai-badge">Gemini 2.5</span>
              </div>

              {!showAiPreview ? (
                <div className="kpi-panel">
                  <div className="kpi-header">
                    <div className="kpi-header-title"><span>✨</span> AI Summary</div>
                  </div>
                  <div style={{padding: '24px'}}>
                    <p className="text-body-sm text-center" style={{color: 'var(--text-subtle)', marginBottom: '20px'}}>
                      Start typing your proposal description and the AI will generate a structured summary automatically.
                    </p>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                      <div className="shimmer" style={{height: '16px', width: '100%'}}></div>
                      <div className="shimmer" style={{height: '16px', width: '80%'}}></div>
                      <div className="shimmer" style={{height: '16px', width: '60%'}}></div>
                      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px'}}>
                        <div className="shimmer" style={{height: '48px'}}></div>
                        <div className="shimmer" style={{height: '48px'}}></div>
                        <div className="shimmer" style={{height: '48px'}}></div>
                        <div className="shimmer" style={{height: '48px'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="kpi-panel">
                  <div className="kpi-header">
                    <div className="kpi-header-title"><span>✨</span> AI Summary</div>
                    <span className="ai-badge">Generated by Gemini</span>
                  </div>
                  <div className="kpi-grid">
                    <div className="kpi-cell">
                      <div className="kpi-label">📋 What</div>
                      <div className="kpi-value">{title || 'Your proposal'} — {description.substring(0, 80)}...</div>
                    </div>
                    <div className="kpi-cell">
                      <div className="kpi-label">💡 Why</div>
                      <div className="kpi-value">Supports community growth and engagement.</div>
                    </div>
                    <div className="kpi-cell">
                      <div className="kpi-label">💰 Cost</div>
                      <div className="kpi-value" style={{fontFamily: 'var(--font-mono)'}}>{budget || 'Not specified'}</div>
                    </div>
                    <div className="kpi-cell">
                      <div className="kpi-label">📈 Impact</div>
                      <div className="kpi-value">Positive impact on club members and visibility.</div>
                    </div>
                    <div className="kpi-cell">
                      <div className="kpi-label">⚠️ Risk</div>
                      <div className="kpi-value">
                        <span className={`badge badge-risk-${riskLevel}`}>{riskLevel}</span>
                      </div>
                    </div>
                    <div className="kpi-cell">
                      <div className="kpi-label">📅 Deadline</div>
                      <div className="kpi-value" style={{fontFamily: 'var(--font-mono)'}}>{timeline || 'Not specified'}</div>
                    </div>
                    <div className="kpi-cell full-width">
                      <div className="kpi-label">👥 Who it affects</div>
                      <div className="kpi-value">All club members and the broader community.</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="card-flat mt-16" style={{background: 'var(--surface)'}}>
                <h4 className="text-h4 mb-8" style={{fontSize: '0.8125rem'}}>💡 Tips for a good proposal</h4>
                <ul style={{paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '6px'}}>
                  <li className="text-caption" style={{color: 'var(--text-muted)'}}>Be specific about costs and timelines</li>
                  <li className="text-caption" style={{color: 'var(--text-muted)'}}>Explain why this matters to the community</li>
                  <li className="text-caption" style={{color: 'var(--text-muted)'}}>Address potential risks proactively</li>
                  <li className="text-caption" style={{color: 'var(--text-muted)'}}>Keep it clear — the AI works best with plain language</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
