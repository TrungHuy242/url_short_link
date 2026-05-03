import { useState } from 'react';

export default function UrlShortener() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [copyText, setCopyText] = useState('Copy');

  const getStoredLinks = () => {
    try {
      const stored = localStorage.getItem('url_shortener_links');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const saveLink = (link) => {
    const links = getStoredLinks();
    links.unshift(link);
    localStorage.setItem('url_shortener_links', JSON.stringify(links));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Validate URL
      new URL(url);

      // Generate short code using Math.random
      const shortCode = Math.random().toString(36).substring(2, 8);

      // Check if shortCode already exists
      const links = getStoredLinks();
      if (links.some(link => link.shortCode === shortCode)) {
        // Regenerate if collision (rare case)
        setTimeout(() => handleSubmit(e), 100);
        return;
      }

      const newLink = {
        shortCode,
        originalUrl: url,
        clicks: 0,
        createdAt: new Date().toISOString(),
      };

      saveLink(newLink);

      setResult({
        shortCode,
        shortUrl: `${window.location.origin}/${shortCode}`,
        originalUrl: url,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      setError('Vui lòng nhập URL hợp lệ (ví dụ: https://example.com)');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (result?.shortUrl) {
      await navigator.clipboard.writeText(result.shortUrl);
      setCopyText('Copied!');
      setShowToast(true);

      setTimeout(() => {
        setCopyText('Copy');
      }, 2000);

      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
  };

  return (
    <div style={{ maxWidth: '672px', margin: '0 auto', padding: '0 16px' }}>
      {/* Toast Notification */}
      {showToast && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            background: '#1aae39',
            color: '#ffffff',
            borderRadius: '8px',
            padding: '12px 20px',
            boxShadow: 'rgba(15, 15, 15, 0.08) 0px 4px 12px 0px',
            fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif",
            fontSize: '14px',
            fontWeight: 500,
            lineHeight: '1.30',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'slideIn 0.3s ease, fadeOut 0.3s ease 2.7s forwards',
          }}
        >
          ✅ Đã copy link thành công!
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ marginBottom: '32px' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          '@media (min-width: 640px)': {
            flexDirection: 'row'
          }
        }}>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste your long URL here..."
            className="text-input"
            style={{
              flex: 1,
              border: '1px solid #c8c4be',
              borderRadius: '8px',
              padding: '12px 16px',
              height: '44px',
              fontSize: '16px',
              lineHeight: '1.55',
              fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif",
              color: '#1a1a1a',
              background: '#ffffff',
              outline: 'none',
              boxSizing: 'border-box',
              width: '100%',
              '@media (min-width: 640px)': {
                width: 'auto'
              }
            }}
            onFocus={(e) => {
              e.target.style.border = '2px solid #5645d4';
              e.target.style.padding = '11px 15px';
            }}
            onBlur={(e) => {
              e.target.style.border = '1px solid #c8c4be';
              e.target.style.padding = '12px 16px';
            }}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Shortening...' : 'Shorten'}
          </button>
        </div>
      </form>

      {error && (
        <div style={{
          marginBottom: '24px',
          borderRadius: '8px',
          border: '1px solid rgba(224, 49, 49, 0.2)',
          background: '#fef2f2',
          padding: '12px 16px',
          fontSize: '14px',
          color: '#e03131'
        }}>
          {error}
        </div>
      )}

      {result && (
        <div className="card-feature" style={{
          borderRadius: '12px',
          border: '1px solid #e5e3df',
          padding: '32px',
          background: '#ffffff',
          boxShadow: 'rgba(15, 15, 15, 0.08) 0px 4px 12px 0px',
          marginBottom: '32px'
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: 500,
            color: '#787671',
            marginBottom: '8px'
          }}>Your short URL:</div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <a
              href={result.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                wordBreak: 'break-all',
                fontSize: '18px',
                fontWeight: 500,
                color: '#5645d4',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => { e.target.style.textDecoration = 'underline' }}
              onMouseLeave={(e) => { e.target.style.textDecoration = 'none' }}
            >
              {result.shortUrl}
            </a>
            <button
              onClick={copyToClipboard}
              className="btn-dark"
              style={{ minWidth: '100px' }}
            >
              {copyText}
            </button>
          </div>
          {result.originalUrl && (
            <div style={{
              marginTop: '12px',
              fontSize: '14px',
              color: '#787671'
            }}>
              Original: <span style={{ color: '#1a1a1a' }}>{result.originalUrl}</span>
            </div>
          )}
        </div>
      )}

      {/* CSS Animation for Toast */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
            visibility: hidden;
          }
        }
      `}</style>
    </div>
  );
}
