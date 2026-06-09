import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Navbar />

      <section className="hero-section" id="hero">
        <div className="hero-bg-image">
          <img src="/images/hero-collab.png" alt="Students collaborating in a modern workspace" loading="eager" />
        </div>

        <div className="container-wide">
          {/* Desktop Hero */}
          <div className="hero-content hide-mobile-hero">

            <div className="hero-text">
              <p className="text-overline hero-anim-1">Built for college communities</p>
              <h1 className="text-display hero-anim-2">
                <span className="hide-mobile">Governance that works for everyone</span>
                <span className="show-mobile">Decisions,<br/>Simplified.</span>
              </h1>
              <p className="text-body-lg hero-anim-3">
                SynGov gives your club the structure to make decisions together — fairly, transparently, and without drama. AI simplifies proposals. Your contributions shape your influence.
              </p>
              <div className="hero-buttons hero-anim-4">
                <Link href="/login" className="btn btn-primary-lg">Get Started Free</Link>
                <Link href="/#how-it-works" className="btn btn-ghost">See how it works →</Link>
              </div>
            </div>

            <div className="hero-image-container hero-anim-5">
              <div className="hero-main-image">
                <img src="/images/laptop-dashboard.png" alt="SynGov governance dashboard on laptop" />
              </div>

              <div className="hero-float-card hero-float-card-1 float-anim">
                <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px'}}>
                  <div className="pulse-dot"></div>
                  <span className="text-caption" style={{fontWeight:600, color:'var(--success)'}}>Live Voting</span>
                </div>
                <div style={{fontFamily:'var(--font-mono)', fontSize:'1.5rem', fontWeight:500, color:'var(--text-primary)'}}>78%</div>
                <div className="text-caption" style={{color:'var(--text-muted)'}}>participation rate</div>
              </div>

              <div className="hero-float-card hero-float-card-2 float-anim" style={{animationDelay:'1s'}}>
                <div style={{display:'flex', alignItems:'center', gap:'6px', marginBottom:'8px'}}>
                  <span style={{fontSize:'1rem'}}>✨</span>
                  <span className="text-caption" style={{fontWeight:600, color:'var(--accent)'}}>AI Summary</span>
                </div>
                <div className="text-body-sm" style={{color:'var(--text-secondary)', lineHeight:1.5}}>
                  "Allocate ₹20K for annual hackathon..."
                </div>
              </div>
            </div>

          </div>

          {/* Mobile Hero */}
          <div className="show-mobile-hero">
            <div className="hero-text" style={{ textAlign: 'center', paddingTop: '20px' }}>
              <h1 className="text-display hero-anim-1" style={{ fontSize: '3rem', lineHeight: '1.1' }}>Your Club.<br/>Your Rules.</h1>
              <p className="text-body-lg hero-anim-2" style={{ marginTop: '16px', color: 'var(--text-muted)' }}>
                Governance without the drama.
              </p>
              
              <div className="mobile-interactive-card hero-anim-3" style={{ margin: '40px auto', background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <div className="pulse-dot"></div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--success)' }}>AI Approved</span>
                </div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px', textAlign: 'left' }}>Annual Tech Hackathon</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textAlign: 'left', marginBottom: '16px' }}>Requested Budget: $500</p>
                <div style={{ height: '8px', background: 'var(--surface-raised)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '85%', height: '100%', background: 'var(--success)' }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.75rem', fontWeight: 600 }}>
                  <span style={{ color: 'var(--success)' }}>85% Yes</span>
                  <span style={{ color: 'var(--text-subtle)' }}>15% No</span>
                </div>
              </div>

              <div className="hero-buttons hero-anim-4" style={{ justifyContent: 'center' }}>
                <Link href="/login" className="btn btn-primary-lg" style={{ width: '100%' }}>Get Started Free</Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      <div className="image-marquee">
        <div className="marquee-track">
          <div className="marquee-item"><img src="/images/hero-collab.png" alt="Students collaborating" /></div>
          <div className="marquee-item"><img src="/images/voting-hands.png" alt="Hands raised in vote" /></div>
          <div className="marquee-item"><img src="/images/student-presenting.png" alt="Student presenting proposal" /></div>
          <div className="marquee-item"><img src="/images/team-discussion.png" alt="Team discussion outdoors" /></div>
          <div className="marquee-item"><img src="/images/organized-meeting.png" alt="Organized meeting" /></div>
          <div className="marquee-item"><img src="/images/community-celebration.png" alt="Community celebration" /></div>
        </div>
      </div>

      <section className="section-spacing" id="problem">
        <div className="container">

          <div className="text-center mb-48 reveal">
            <p className="text-overline mb-12">The reality of club governance</p>
            <h2 className="text-h1">Sound familiar?</h2>
          </div>

          <div className="problem-grid mb-48">
            <div className="reveal-left">
              <div className="problem-image">
                <img src="/images/chaotic-meeting.png" alt="Chaotic, disorganized club meeting" />
                <span className="problem-image-label before">✗ Before SynGov</span>
              </div>
            </div>
            <div className="reveal-right">
              <div className="problem-image">
                <img src="/images/organized-meeting.png" alt="Well-organized meeting with SynGov" />
                <span className="problem-image-label after">✓ With SynGov</span>
              </div>
            </div>
          </div>

          <div className="stagger-children" style={{maxWidth:'900px', margin:'0 auto'}}>
            <div className="comparison-row">
              <div className="comparison-before">
                <span className="comparison-icon">✗</span>
                Decisions made by 2–3 people
              </div>
              <div className="comparison-after">
                <span className="comparison-icon">✓</span>
                Every member gets a weighted voice
              </div>
            </div>
            <div className="comparison-row">
              <div className="comparison-before">
                <span className="comparison-icon">✗</span>
                Proposals are hard to understand
              </div>
              <div className="comparison-after">
                <span className="comparison-icon">✓</span>
                AI-simplified KPI summaries
              </div>
            </div>
            <div className="comparison-row">
              <div className="comparison-before">
                <span className="comparison-icon">✗</span>
                Fund usage is opaque
              </div>
              <div className="comparison-after">
                <span className="comparison-icon">✓</span>
                Every vote logged on blockchain
              </div>
            </div>
            <div className="comparison-row">
              <div className="comparison-before">
                <span className="comparison-icon">✗</span>
                Active members treated like lurkers
              </div>
              <div className="comparison-after">
                <span className="comparison-icon">✓</span>
                Contribution score = real influence
              </div>
            </div>
            <div className="comparison-row">
              <div className="comparison-before">
                <span className="comparison-icon">✗</span>
                No record of past decisions
              </div>
              <div className="comparison-after">
                <span className="comparison-icon">✓</span>
                Full governance history, always visible
              </div>
            </div>
          </div>

        </div>
      </section>

      <section className="section-spacing" style={{background:'var(--surface)'}} id="how-it-works">
        <div className="container">

          <div className="text-center mb-48 reveal">
            <p className="text-overline mb-12">Simple by design</p>
            <h2 className="text-h1">From idea to decision in four steps</h2>
          </div>

          <div className="steps-grid stagger-children">

            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon">📝</div>
              <h4 className="text-h4">Create a Proposal</h4>
              <p className="text-body-sm">Write your proposal in plain text. SynGov does the rest.</p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon">✨</div>
              <h4 className="text-h4">AI Simplifies It</h4>
              <p className="text-body-sm">Gemini extracts what matters — cost, risk, impact, deadline.</p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon">⚖️</div>
              <h4 className="text-h4">Members Vote</h4>
              <p className="text-body-sm">Each vote is weighted by contribution and expertise — not rank.</p>
            </div>

            <div className="step-card">
              <div className="step-number">4</div>
              <div className="step-icon">🔗</div>
              <h4 className="text-h4">Decision is Logged</h4>
              <p className="text-body-sm">The result is transparent and permanently recorded on Polygon.</p>
            </div>

          </div>

        </div>
      </section>

      <section className="section-spacing" id="features">
        <div className="container">

          <div className="problem-grid mb-48" style={{alignItems:'center'}}>
            <div className="reveal-left">
              <p className="text-overline mb-12">What makes SynGov different</p>
              <h2 className="text-h1 mb-16">Every voice counts. Every decision is clear.</h2>
              <p className="text-body-lg" style={{color:'var(--text-muted)', maxWidth:'480px'}}>
                We built SynGov around three innovations that transform how student communities make decisions — from chaotic group chats to structured, fair governance.
              </p>
            </div>
            <div className="reveal-right">
              <div className="image-reveal" style={{height:'380px'}}>
                <img src="/images/student-presenting.png" alt="Student presenting to engaged peers" />
                <div className="image-reveal-overlay"></div>
              </div>
            </div>
          </div>

          <div className="features-grid stagger-children">

            <div className="feature-card">
              <div className="feature-icon">⚖️</div>
              <h4 className="text-h4">Contribution-Aware Voting</h4>
              <p className="text-body-sm">
                Your influence reflects your involvement. Attendance, tasks, proposals — all of it counts toward your governance weight. Newcomers start at 1.0×. Core members earn up to 1.5×.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h4 className="text-h4">AI-Simplified Proposals</h4>
              <p className="text-body-sm">
                Long proposals get turned into clear summaries instantly. What's being asked. Why it matters. What it costs. What the risk is. No reading fatigue.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔗</div>
              <h4 className="text-h4">Transparent by Default</h4>
              <p className="text-body-sm">
                Every vote, every decision, every proposal outcome is logged on Polygon. Anyone can verify. Nothing is hidden. Trust is built into the system.
              </p>
            </div>

          </div>

        </div>
      </section>

      <section className="stats-section section-spacing-sm" id="stats">
        <div className="container">
          <div className="stats-grid">

            <div className="stat-item reveal">
              <div className="stat-value" data-count="3x">3x</div>
              <div className="stat-label">faster proposal understanding</div>
            </div>

            <div className="stat-item reveal" style={{transitionDelay:'100ms'}}>
              <div className="stat-value" data-count="78%">78%</div>
              <div className="stat-label">avg participation rate</div>
            </div>

            <div className="stat-item reveal" style={{transitionDelay:'200ms'}}>
              <div className="stat-value" data-count="100%">100%</div>
              <div className="stat-label">votes publicly verifiable</div>
            </div>

            <div className="stat-item reveal" style={{transitionDelay:'300ms'}}>
              <div className="stat-value" data-count="< 30s">&lt; 30s</div>
              <div className="stat-label">to understand any proposal</div>
            </div>

          </div>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container">
          <div className="problem-grid" style={{alignItems:'center'}}>

            <div className="reveal-left">
              <div className="image-reveal" style={{height:'420px'}}>
                <img src="/images/voting-hands.png" alt="Diverse hands raised in democratic vote" />
                <div className="image-reveal-overlay"></div>
              </div>
            </div>

            <div className="reveal-right">
              <p className="text-overline mb-12">Democratic by design</p>
              <h2 className="text-h1 mb-16">Your contribution is your influence</h2>
              <p className="text-body" style={{color:'var(--text-muted)', marginBottom:'24px'}}>
                In SynGov, everyone starts equal. But the more you contribute — attending meetings, completing tasks, creating proposals — the more your vote weighs. It's not about seniority. It's about showing up.
              </p>

              <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
                <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                  <div style={{width:'40px', height:'40px', borderRadius:'50%', background:'var(--accent-light)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
                    <span style={{fontFamily:'var(--font-mono)', fontWeight:500, color:'var(--accent)', fontSize:'0.75rem'}}>1.0×</span>
                  </div>
                  <div>
                    <div className="text-body-sm" style={{fontWeight:600}}>New Members</div>
                    <div className="text-caption" style={{color:'var(--text-muted)'}}>Start with base voting weight</div>
                  </div>
                </div>
                <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                  <div style={{width:'40px', height:'40px', borderRadius:'50%', background:'var(--accent-muted)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
                    <span style={{fontFamily:'var(--font-mono)', fontWeight:500, color:'var(--accent)', fontSize:'0.75rem'}}>1.2×</span>
                  </div>
                  <div>
                    <div className="text-body-sm" style={{fontWeight:600}}>Active Contributors</div>
                    <div className="text-caption" style={{color:'var(--text-muted)'}}>Earned through consistent participation</div>
                  </div>
                </div>
                <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                  <div style={{width:'40px', height:'40px', borderRadius:'50%', background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
                    <span style={{fontFamily:'var(--font-mono)', fontWeight:500, color:'#fff', fontSize:'0.75rem'}}>1.5×</span>
                  </div>
                  <div>
                    <div className="text-body-sm" style={{fontWeight:600}}>Core Members</div>
                    <div className="text-caption" style={{color:'var(--text-muted)'}}>Maximum weight cap — fair governance</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="cta-section section-spacing" id="cta">
        <div className="cta-bg-image">
          <img src="/images/community-celebration.png" alt="Students celebrating successful governance" />
        </div>
        <div className="container">
          <div className="cta-content reveal">
            <h2 className="text-h1">Your club deserves better than a WhatsApp poll.</h2>
            <p className="text-body-lg">Set up SynGov in minutes. No blockchain knowledge required.</p>
            <div className="hero-buttons" style={{justifyContent:'center'}}>
              <Link href="/login" className="btn btn-primary-lg" style={{background:'#fff', color:'var(--accent)'}}>Get Started Free</Link>
              <Link href="#" className="btn btn-ghost" style={{color:'rgba(255,255,255,0.9)'}}>Read the Docs →</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
