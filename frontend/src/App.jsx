import { useState, useEffect } from 'react'
import UrlShortener from './components/UrlShortener'
import Stats from './components/Stats'
import Footer from './components/Footer'
import './index.css'

function App() {
  const [page, setPage] = useState('home')
  const [redirectError, setRedirectError] = useState('')

  // Handle client-side routing for /:shortCode
  useEffect(() => {
    const handleRoute = () => {
      const path = window.location.pathname;
      // Match /:shortCode pattern (4-20 alphanumeric chars)
      const match = path.match(/^\/([A-Za-z0-9_-]{4,20})$/);

      if (match) {
        const shortCode = match[1];
        try {
          const stored = localStorage.getItem('url_shortener_links');
          const links = stored ? JSON.parse(stored) : [];
          const found = links.find(link => link.shortCode === shortCode);

          if (found) {
            // Increment clicks in localStorage
            found.clicks = (found.clicks || 0) + 1;
            const updatedLinks = links.map(link =>
              link.shortCode === shortCode ? found : link
            );
            localStorage.setItem('url_shortener_links', JSON.stringify(updatedLinks));

            // Redirect to original URL
            window.location.href = found.originalUrl;
          } else {
            setRedirectError(`Link "${shortCode}" not found`);
            setPage('not-found');
          }
        } catch (err) {
          setRedirectError('Error reading data');
          setPage('not-found');
        }
      } else if (path === '/' || path === '/home' || path === '/stats') {
        // Normal page routing
        if (path === '/stats') {
          setPage('stats');
        } else {
          setPage('home');
        }
        setRedirectError('');
      }
    };

    handleRoute();

    // Listen for popstate (back/forward)
    window.addEventListener('popstate', handleRoute);
    return () => window.removeEventListener('popstate', handleRoute);
  }, []);

  // Navigate and update URL
  const navigate = (newPage) => {
    setPage(newPage);
    const url = newPage === 'home' ? '/' : '/stats';
    window.history.pushState({}, '', url);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', background: '#ffffff' }}>
      {/* Demo Mode Badge - Top Left */}
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        zIndex: 9999,
        background: '#f9e79f',
        color: '#37352f',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: 600,
        padding: '4px 10px',
        fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif",
        boxShadow: 'rgba(15, 15, 15, 0.08) 0px 2px 4px 0px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        🔸 Demo Mode
      </div>

      {/* Navigation - sticky white bar, height 64px, bottom border 1px solid #e5e3df */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        height: '64px',
        borderBottom: '1px solid #e5e3df',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              fontSize: '22px',
              fontWeight: 600,
              lineHeight: '1.30',
              color: '#1a1a1a',
              fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif"
            }}>URL Shortener</span>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => navigate('home')}
              style={{
                background: page === 'home' ? '#000000' : 'transparent',
                color: page === 'home' ? '#ffffff' : '#1a1a1a',
                fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif",
                fontSize: '14px',
                fontWeight: 500,
                lineHeight: '1.30',
                borderRadius: '6px',
                padding: '8px 12px',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={(e) => {
                if (page !== 'home') e.target.style.backgroundColor = '#f6f5f4'
              }}
              onMouseLeave={(e) => {
                if (page !== 'home') e.target.style.backgroundColor = 'transparent'
              }}
            >
              Home
            </button>
            <button
              onClick={() => navigate('stats')}
              style={{
                background: page === 'stats' ? '#000000' : 'transparent',
                color: page === 'stats' ? '#ffffff' : '#1a1a1a',
                fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif",
                fontSize: '14px',
                fontWeight: 500,
                lineHeight: '1.30',
                borderRadius: '6px',
                padding: '8px 12px',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={(e) => {
                if (page !== 'stats') e.target.style.backgroundColor = '#f6f5f4'
              }}
              onMouseLeave={(e) => {
                if (page !== 'stats') e.target.style.backgroundColor = 'transparent'
              }}
            >
              Statistics
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1 }}>
        {page === 'not-found' ? (
          <div style={{
            maxWidth: '672px',
            margin: '0 auto',
            padding: '120px 16px',
            textAlign: 'center'
          }}>
            <h1 style={{
              fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif",
              fontSize: '36px',
              fontWeight: 600,
              lineHeight: '1.20',
              letterSpacing: '-0.5px',
              color: '#1a1a1a',
              margin: '0 0 16px 0'
            }}>Link Not Found</h1>
            <p style={{
              fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif",
              fontSize: '16px',
              fontWeight: 400,
              lineHeight: '1.55',
              color: '#5d5b54',
              margin: '0 0 32px 0'
            }}>{redirectError || 'The short link you are looking for does not exist.'}</p>
            <button
              onClick={() => navigate('home')}
              className="btn-primary"
            >
              Go to Homepage
            </button>
          </div>
        ) : page === 'home' ? <HomePage /> : <StatsPage />}
      </main>

      <Footer />
    </div>
  );
}

function HomePage() {
  return (
    <>
      {/* Hero Band - brand-navy background, padding hero (120px) */}
      <section style={{
        background: '#0a1530',
        color: '#ffffff',
        padding: '120px 0',
        fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif"
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 16px',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif",
            fontSize: '80px',
            fontWeight: 600,
            lineHeight: '1.05',
            letterSpacing: '-2px',
            color: '#ffffff',
            margin: '0 0 24px 0'
          }}>Shorten your URLs</h1>
          <p style={{
            fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif",
            fontSize: '18px',
            fontWeight: 400,
            lineHeight: '1.50',
            color: 'rgba(255, 255, 255, 0.7)',
            margin: '0 0 32px 0',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>Paste your long link and get a short, shareable URL in seconds.</p>

          {/* Form nhập URL trong hero band */}
          <div style={{
            maxWidth: '672px',
            margin: '0 auto 32px'
          }}>
            <UrlShortener />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <a
              href="#how-it-works"
              style={{
                background: '#5645d4',
                color: '#ffffff',
                fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif",
                fontSize: '14px',
                fontWeight: 500,
                lineHeight: '1.30',
                borderRadius: '8px',
                padding: '10px 18px',
                textDecoration: 'none',
                transition: 'background-color 0.15s ease',
                display: 'inline-block'
              }}
              onMouseEnter={(e) => { e.target.style.backgroundColor = '#4534b3' }}
              onMouseLeave={(e) => { e.target.style.backgroundColor = '#5645d4' }}
            >Get Started</a>
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section id="how-it-works" style={{
        maxWidth: '672px',
        margin: '0 auto',
        padding: '64px 16px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{
            fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif",
            fontSize: '36px',
            fontWeight: 600,
            lineHeight: '1.20',
            letterSpacing: '-0.5px',
            color: '#1a1a1a',
            margin: '0 0 16px 0'
          }}>How it works</h2>
          <p style={{
            fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif",
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: '1.55',
            color: '#5d5b54',
            margin: 0
          }}>Three simple steps to shorten your URLs</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '32px'
        }}>
          {[
            { step: '1', title: 'Paste your URL', desc: 'Enter your long URL in the input field above' },
            { step: '2', title: 'Get short link', desc: 'We generate a unique short code for your URL' },
            { step: '3', title: 'Share & track', desc: 'Share your short URL and track its performance' }
          ].map((item, i) => (
            <div key={i} style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '32px',
              border: '1px solid #e5e3df',
              textAlign: 'center'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#5645d4',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 600,
                margin: '0 auto 16px'
              }}>{item.step}</div>
              <h3 style={{
                fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif",
                fontSize: '22px',
                fontWeight: 600,
                lineHeight: '1.30',
                color: '#1a1a1a',
                margin: '0 0 8px 0'
              }}>{item.title}</h3>
              <p style={{
                fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif",
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: '1.50',
                color: '#5d5b54',
                margin: 0
              }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

function StatsPage() {
  return (
    <div style={{
      maxWidth: '672px',
      margin: '0 auto',
      padding: '64px 16px'
    }}>
      <Stats />
    </div>
  )
}

export default App;
