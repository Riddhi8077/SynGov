import Link from 'next/link'

export default function ProposalCard({ id, title, category, status, weight, score, author, authorAvatar, aiSummary }: any) {
  return (
    <div className="proposal-card reveal-stagger">
      <div className="proposal-card-header">
        <span className={`badge badge-category-${category}`}>{category}</span>
        <span className={`badge badge-status-${status}`}>{status}</span>
      </div>
      <h3 className="proposal-card-title">{title}</h3>
      <p className="proposal-card-desc">{aiSummary?.what || "Loading summary..."}</p>
      
      <div className="proposal-card-meta">
        <div className="proposal-card-author">
          <div className="author-avatar">{authorAvatar}</div>
          <span className="text-body-sm font-medium">{author}</span>
        </div>
        <div className="text-body-sm font-mono" style={{ color: 'var(--foreground-muted)' }}>Weight: {weight}</div>
      </div>
      
      <div className="proposal-card-footer">
        <div className="vote-progress-bar">
          <div className="vote-progress-fill" style={{ width: `${score}%` }}></div>
        </div>
        <div className="proposal-card-meta" style={{ marginTop: '8px' }}>
          <span className="text-body-sm" style={{ color: 'var(--foreground-muted)' }}>{score}% Approval</span>
          <Link href={`/proposals/${id || 1}`} className="btn btn-secondary btn-sm" style={{ padding: '4px 12px' }}>Vote</Link>
        </div>
      </div>
    </div>
  )
}
