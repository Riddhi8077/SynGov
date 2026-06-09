'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BottomNav() {
  const pathname = usePathname()
  
  return (
    <nav className="bottom-nav">
      <Link href="/dashboard" className={`bottom-nav-link ${pathname === '/dashboard' ? 'active' : ''}`}>
        <span className="bottom-nav-icon">📊</span>
        <span className="bottom-nav-label">Home</span>
      </Link>
      <Link href="/proposals" className={`bottom-nav-link ${pathname === '/proposals' ? 'active' : ''}`}>
        <span className="bottom-nav-icon">📋</span>
        <span className="bottom-nav-label">Proposals</span>
      </Link>
      <Link href="/create-proposal" className={`bottom-nav-link ${pathname === '/create-proposal' ? 'active' : ''}`}>
        <div className="bottom-nav-fab">
          <span className="bottom-nav-icon">✏️</span>
        </div>
      </Link>
      <Link href="/analytics" className={`bottom-nav-link ${pathname === '/analytics' ? 'active' : ''}`}>
        <span className="bottom-nav-icon">📈</span>
        <span className="bottom-nav-label">Analytics</span>
      </Link>
      <Link href="/members" className={`bottom-nav-link ${pathname === '/members' ? 'active' : ''}`}>
        <span className="bottom-nav-icon">👥</span>
        <span className="bottom-nav-label">Members</span>
      </Link>
    </nav>
  )
}
