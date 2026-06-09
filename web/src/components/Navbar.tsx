'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Navbar({ user }: { user?: { name: string, email: string } | null }) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [avatarOpen, setAvatarOpen] = useState(false)
  
  const [localUser, setLocalUser] = useState<{ name: string, email: string } | null>(user || null)
  const [isLoadingUser, setIsLoadingUser] = useState(user === undefined)

  useEffect(() => {
    if (user === undefined) {
      import('@/app/auth-actions').then(m => m.getUser().then(u => {
        setLocalUser(u)
        setIsLoadingUser(false)
      }));
    } else {
      setLocalUser(user)
      setIsLoadingUser(false)
    }
  }, [user])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className="navbar" style={{ boxShadow: scrolled ? '0 1px 8px rgba(0,0,0,0.06)' : 'none' }}>
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo">
          <img src="/images/syn-gov-logo.png" alt="SynGov Logo" className="navbar-logo-img" style={{ height: '128px', width: 'auto' }} />
        </Link>

        {/* Desktop Links */}
        <div className={`navbar-links ${mobileOpen ? 'mobile-open' : ''}`}>
          <Link href="/#features" className={`navbar-link ${pathname === '/#features' ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>Features</Link>
          <Link href="/#how-it-works" className={`navbar-link ${pathname === '/#how-it-works' ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>How It Works</Link>
          <Link href="/#stats" className={`navbar-link ${pathname === '/#stats' ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>Impact</Link>
          <Link href="/dashboard" className={`navbar-link ${pathname.includes('/dashboard') ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>Dashboard</Link>
          
          {/* Mobile Only: Show Login inside menu if not logged in (optional, but user wants it top right) */}
        </div>

        <div className="navbar-right-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="navbar-actions" style={{ display: 'flex' }}>
            {isLoadingUser ? null : localUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
                <div 
                  className="user-avatar-circle"
                  onClick={() => setAvatarOpen(!avatarOpen)}
                  style={{
                    width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent)',
                    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', userSelect: 'none'
                  }}
                >
                  {localUser.name ? localUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'}
                </div>
                {avatarOpen && (
                  <div className="avatar-dropdown" style={{
                    position: 'absolute', top: '120%', right: '0', background: '#fff',
                    boxShadow: 'var(--shadow-card)', borderRadius: 'var(--radius-sm)',
                    padding: '8px', zIndex: 100, border: '1px solid var(--border)', minWidth: '150px'
                  }}>
                    <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', marginBottom: '4px' }}>
                      <p className="text-body-sm" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{localUser.name}</p>
                    </div>
                    <button onClick={async () => {
                      const { logout } = await import('@/app/auth-actions')
                      await logout()
                      window.location.href = '/'
                    }} className="btn btn-ghost btn-sm" style={{ width: '100%', textAlign: 'left', justifyContent: 'flex-start' }}>
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link href="/login" className="btn btn-ghost btn-sm">Log In</Link>
                <Link href="/login" className="btn btn-primary btn-sm hide-mobile">Get Started</Link>
              </div>
            )}
          </div>

          <div className={`nav-toggle ${mobileOpen ? 'active' : ''}`} onClick={() => setMobileOpen(!mobileOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </nav>
  )
}
