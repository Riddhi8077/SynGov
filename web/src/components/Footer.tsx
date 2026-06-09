import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-logo" style={{ marginBottom: '8px' }}>
              <img src="/images/syn-gov-logo.png" alt="SynGov Logo" style={{ height: '128px', width: 'auto' }} />
            </div>
            <p className="footer-tagline">Smarter decision-making for college communities. Built with AI, secured by blockchain.</p>
          </div>
          <div>
            <h4 className="footer-heading">Product</h4>
            <ul className="footer-links">
              <li><Link href="/#features">Features</Link></li>
              <li><Link href="/#how-it-works">How It Works</Link></li>
              <li><Link href="/dashboard">Dashboard</Link></li>
              <li><Link href="/proposals">Proposals</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-heading">Resources</h4>
            <ul className="footer-links">
              <li><a href="#">Documentation</a></li>
              <li><a href="#">API Reference</a></li>
              <li><a href="#">GitHub</a></li>
              <li><a href="#">Changelog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-heading">Community</h4>
            <ul className="footer-links">
              <li><a href="#">About</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Twitter</a></li>
              <li><a href="#">Discord</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          © 2025 SynGov · Open source · Polygon Amoy · Built for hackathons, designed for real communities.
        </div>
      </div>
    </footer>
  )
}
