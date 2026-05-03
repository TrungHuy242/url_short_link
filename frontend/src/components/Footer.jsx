export default function Footer() {
  return (
    <footer className="footer-region" style={{
      background: '#ffffff',
      borderTop: '1px solid #e5e3df',
      padding: '64px 32px',
      fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif",
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '1.50',
      color: '#37352f'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '32px',
          '@media (min-width: 640px)': {
            gridTemplateColumns: 'repeat(3, 1fr)'
          },
          '@media (min-width: 1024px)': {
            gridTemplateColumns: 'repeat(6, 1fr)'
          }
        }}>
          {/* Column 1: Product */}
          <div>
            <h3 style={{
              fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              lineHeight: '1.40',
              color: '#37352f',
              margin: '0 0 12px 0'
            }}>Product</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {['Features', 'Pricing', 'API', 'Integrations'].map((item, i) => (
                <li key={i}>
                  <a href="#" className="footer-link" style={{
                    background: 'transparent',
                    color: '#787671',
                    fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif",
                    fontSize: '14px',
                    fontWeight: 400,
                    lineHeight: '1.50',
                    padding: '4px 0',
                    display: 'block',
                    textDecoration: 'none',
                    transition: 'text-decoration 0.15s ease'
                  }}
                  onMouseEnter={(e) => { e.target.style.textDecoration = 'underline' }}
                  onMouseLeave={(e) => { e.target.style.textDecoration = 'none' }}
                  >{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div>
            <h3 style={{
              fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              lineHeight: '1.40',
              color: '#37352f',
              margin: '0 0 12px 0'
            }}>Resources</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {['Documentation', 'API Docs', 'Status', 'Blog'].map((item, i) => (
                <li key={i}>
                  <a href="#" className="footer-link" style={{
                    background: 'transparent',
                    color: '#787671',
                    fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif",
                    fontSize: '14px',
                    fontWeight: 400,
                    lineHeight: '1.50',
                    padding: '4px 0',
                    display: 'block',
                    textDecoration: 'none',
                    transition: 'text-decoration 0.15s ease'
                  }}
                  onMouseEnter={(e) => { e.target.style.textDecoration = 'underline' }}
                  onMouseLeave={(e) => { e.target.style.textDecoration = 'none' }}
                  >{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h3 style={{
              fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              lineHeight: '1.40',
              color: '#37352f',
              margin: '0 0 12px 0'
            }}>Company</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {['About', 'Careers', 'Press', 'Contact'].map((item, i) => (
                <li key={i}>
                  <a href="#" className="footer-link" style={{
                    background: 'transparent',
                    color: '#787671',
                    fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif",
                    fontSize: '14px',
                    fontWeight: 400,
                    lineHeight: '1.50',
                    padding: '4px 0',
                    display: 'block',
                    textDecoration: 'none',
                    transition: 'text-decoration 0.15s ease'
                  }}
                  onMouseEnter={(e) => { e.target.style.textDecoration = 'underline' }}
                  onMouseLeave={(e) => { e.target.style.textDecoration = 'none' }}
                  >{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h3 style={{
              fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              lineHeight: '1.40',
              color: '#37352f',
              margin: '0 0 12px 0'
            }}>Legal</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'].map((item, i) => (
                <li key={i}>
                  <a href="#" className="footer-link" style={{
                    background: 'transparent',
                    color: '#787671',
                    fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif",
                    fontSize: '14px',
                    fontWeight: 400,
                    lineHeight: '1.50',
                    padding: '4px 0',
                    display: 'block',
                    textDecoration: 'none',
                    transition: 'text-decoration 0.15s ease'
                  }}
                  onMouseEnter={(e) => { e.target.style.textDecoration = 'underline' }}
                  onMouseLeave={(e) => { e.target.style.textDecoration = 'none' }}
                  >{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Connect */}
          <div>
            <h3 style={{
              fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              lineHeight: '1.40',
              color: '#37352f',
              margin: '0 0 12px 0'
            }}>Connect</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {['GitHub', 'Twitter', 'Discord', 'Slack'].map((item, i) => (
                <li key={i}>
                  <a href="#" className="footer-link" style={{
                    background: 'transparent',
                    color: '#787671',
                    fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif",
                    fontSize: '14px',
                    fontWeight: 400,
                    lineHeight: '1.50',
                    padding: '4px 0',
                    display: 'block',
                    textDecoration: 'none',
                    transition: 'text-decoration 0.15s ease'
                  }}
                  onMouseEnter={(e) => { e.target.style.textDecoration = 'underline' }}
                  onMouseLeave={(e) => { e.target.style.textDecoration = 'none' }}
                  >{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 6: Support */}
          <div>
            <h3 style={{
              fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              lineHeight: '1.40',
              color: '#37352f',
              margin: '0 0 12px 0'
            }}>Support</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {['Help Center', 'FAQ', 'Report Bug', 'Feature Request'].map((item, i) => (
                <li key={i}>
                  <a href="#" className="footer-link" style={{
                    background: 'transparent',
                    color: '#787671',
                    fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif",
                    fontSize: '14px',
                    fontWeight: 400,
                    lineHeight: '1.50',
                    padding: '4px 0',
                    display: 'block',
                    textDecoration: 'none',
                    transition: 'text-decoration 0.15s ease'
                  }}
                  onMouseEnter={(e) => { e.target.style.textDecoration = 'underline' }}
                  onMouseLeave={(e) => { e.target.style.textDecoration = 'none' }}
                  >{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          marginTop: '64px',
          borderTop: '1px solid #e5e3df',
          paddingTop: '20px',
          textAlign: 'center'
        }}>
          <p style={{
            fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif",
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: '1.50',
            color: '#787671',
            margin: 0
          }}>
            URL Shortener © {new Date().getFullYear()} - Built with React + Vite
          </p>
        </div>
      </div>
    </footer>
  );
}
