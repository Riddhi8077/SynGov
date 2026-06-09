'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Sidebar({ user }: { user?: { name: string, email: string } | null }) {
  const pathname = usePathname()
  
  const [localUser, setLocalUser] = useState<{ name: string, email: string } | null>(user || null)

  useEffect(() => {
    if (user === undefined) {
      import('@/app/auth-actions').then(m => m.getUser().then(u => setLocalUser(u)));
    } else {
      setLocalUser(user)
    }
  }, [user])
  
  // Default to Arjun Mehta if no user (for preview purposes)
  const displayName = localUser?.name || "Arjun Mehta"
  const initials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <Link href="/dashboard" className={`sidebar-link ${pathname === '/dashboard' ? 'active' : ''}`}>
          <span className="sidebar-icon">📊</span> Dashboard
        </Link>
        <Link href="/proposals" className={`sidebar-link ${pathname === '/proposals' ? 'active' : ''}`}>
          <span className="sidebar-icon">📋</span> Proposals
        </Link>
        <Link href="/create-proposal" className={`sidebar-link ${pathname === '/create-proposal' ? 'active' : ''}`}>
          <span className="sidebar-icon">✏️</span> New Proposal
        </Link>
        <Link href="/analytics" className={`sidebar-link ${pathname === '/analytics' ? 'active' : ''}`}>
          <span className="sidebar-icon">📈</span> Analytics
        </Link>
        <Link href="/members" className={`sidebar-link ${pathname === '/members' ? 'active' : ''}`}>
          <span className="sidebar-icon">👥</span> Members
        </Link>
      </nav>
      
      <div className="sidebar-user">
        <div className="sidebar-user-avatar">{initials}</div>
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">{displayName}</div>
          <div className="sidebar-user-score">Score: 72 · 1.2× weight</div>
        </div>
      </div>
    </aside>
  )
}
