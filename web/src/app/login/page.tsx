'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { login } from '@/app/auth-actions'

export default function Login() {
  const router = useRouter()
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true)
    // Simulate Google OAuth delay
    await new Promise(resolve => setTimeout(resolve, 800))
    // Call server action to set session
    await login("Arjun Mehta", "arjun@syngov.edu")
    router.push('/dashboard')
  }

  return (
    <div className="login-page">
      <div className="login-visual">
        <img src="/images/student-thinking.png" alt="Student making informed governance decisions" />
        <div className="login-visual-overlay">
          <p className="text-overline hero-anim-1" style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '16px' }}>Welcome to SynGov</p>
          <h1 className="text-display hero-anim-2">Where every voice shapes the outcome</h1>
          <p className="text-body-lg hero-anim-3" style={{ marginTop: '20px' }}>
            Join your community. Make informed decisions. Build trust through transparent governance.
          </p>

          <div className="hero-anim-4" style={{ marginTop: '48px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 'var(--radius-card)', padding: '20px', maxWidth: '400px' }}>
            <p style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.85)', fontStyle: 'italic', lineHeight: 1.6, marginBottom: '12px' }}>
              "SynGov changed how our tech club makes decisions. No more arguments in group chats — now everyone actually understands what we're voting on."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#fff', fontWeight: 700 }}>AS</div>
              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#fff' }}>Ananya Sharma</div>
                <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.5)' }}>President, Tech Society</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="login-form-side">
        <div className="login-form-container">
          <Link href="/" className="navbar-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '48px' }}>
            <img src="/images/syn-gov-logo.png" alt="SynGov Logo" style={{ height: '128px', width: 'auto' }} />
          </Link>

          <h2 className="text-h2">Welcome back</h2>
          <p className="text-body-sm">Sign in to your account to continue</p>

          <form className="login-form" onSubmit={(e) => { e.preventDefault(); handleGoogleLogin(); }}>
            <div className="form-group">
              <label className="label" htmlFor="login-email">Email address</label>
              <input type="email" id="login-email" className="input" placeholder="you@university.edu" required />
            </div>

            <div className="form-group">
              <label className="label" htmlFor="login-password">Password</label>
              <input type="password" id="login-password" className="input" placeholder="Enter your password" required />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <input type="checkbox" style={{ accentColor: 'var(--accent)', width: '16px', height: '16px' }} />
                Remember me
              </label>
              <a href="#" style={{ fontSize: '0.8125rem', color: 'var(--accent)', fontWeight: 500 }}>Forgot password?</a>
            </div>

            <button type="submit" className="btn btn-primary w-full" style={{ width: '100%', padding: '14px' }}>
              {isLoggingIn ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="login-divider">or continue with</div>

          <div className="social-login">
            <button onClick={handleGoogleLogin} disabled={isLoggingIn} className="social-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'transparent', border: '1px solid var(--border)', width: '100%' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: '8px' }}><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
              {isLoggingIn ? 'Connecting...' : 'Continue with Google'}
            </button>
            <button onClick={handleGoogleLogin} disabled={isLoggingIn} className="social-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'transparent', border: '1px solid var(--border)', width: '100%' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
              Continue with GitHub
            </button>
          </div>

          <p style={{ textAlign: 'center', marginTop: '32px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Don't have an account? <a href="#" style={{ color: 'var(--accent)', fontWeight: 600 }}>Create one →</a>
          </p>
        </div>
      </div>
    </div>
  )
}
