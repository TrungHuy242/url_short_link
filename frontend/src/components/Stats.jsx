import { useState, useEffect } from 'react';

export default function Stats() {
  const [links, setLinks] = useState([]);
  const [searchCode, setSearchCode] = useState('');
  const [selectedLink, setSelectedLink] = useState(null);

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = () => {
    try {
      const stored = localStorage.getItem('url_shortener_links');
      const parsed = stored ? JSON.parse(stored) : [];
      setLinks(parsed);
    } catch {
      setLinks([]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchCode) {
      loadLinks();
      setSelectedLink(null);
      return;
    }

    try {
      const stored = localStorage.getItem('url_shortener_links');
      const parsed = stored ? JSON.parse(stored) : [];
      const found = parsed.find(link => link.shortCode === searchCode);
      if (found) {
        setSelectedLink(found);
      } else {
        setSelectedLink(null);
        alert('Link not found');
      }
    } catch {
      alert('Error reading data');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div style={{ maxWidth: '672px', margin: '0 auto', padding: '0 16px' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{
          fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif",
          fontSize: '36px',
          fontWeight: 600,
          lineHeight: '1.20',
          letterSpacing: '-0.5px',
          color: '#1a1a1a',
          margin: '0 0 16px 0'
        }}>URL Statistics</h1>
        <p style={{
          fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif",
          fontSize: '18px',
          fontWeight: 400,
          lineHeight: '1.50',
          color: '#37352f',
          margin: 0
        }}>View all your shortened URLs and their statistics.</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} style={{ marginBottom: '32px' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          '@media (min-width: 640px)': {
            flexDirection: 'row'
          }
        }}>
          <input
            type="text"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            placeholder="Enter short code to search..."
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
          />
          <button
            type="submit"
            className="btn-primary"
          >
            Search
          </button>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => {
              setSearchCode('');
              loadLinks();
              setSelectedLink(null);
            }}
            style={{ whiteSpace: 'nowrap' }}
          >
            Show All
          </button>
        </div>
      </form>

      {/* Selected Link Details */}
      {selectedLink && (
        <div className="card-base" style={{
          borderRadius: '12px',
          border: '1px solid #e5e3df',
          padding: '32px',
          background: '#ffffff',
          marginBottom: '32px'
        }}>
          <h2 style={{
            fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif",
            fontSize: '36px',
            fontWeight: 600,
            lineHeight: '1.20',
            letterSpacing: '-0.5px',
            color: '#1a1a1a',
            margin: '0 0 24px 0'
          }}>Link Details</h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
            marginBottom: '32px',
            '@media (min-width: 768px)': {
              gridTemplateColumns: 'repeat(4, 1fr)'
            }
          }}>
            {[
              { label: 'Total Clicks', value: selectedLink.clicks || 0 },
              { label: 'Short Code', value: selectedLink.shortCode },
              { label: 'Created', value: new Date(selectedLink.createdAt).toLocaleDateString() },
            ].map((item, i) => (
              <div key={i} style={{
                padding: '16px',
                background: '#f6f5f4',
                borderRadius: '8px'
              }}>
                <div style={{
                  fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif",
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: '1.50',
                  color: '#787671',
                  marginBottom: '4px'
                }}>{item.label}</div>
                <div style={{
                  fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif",
                  fontSize: '36px',
                  fontWeight: 600,
                  lineHeight: '1.20',
                  letterSpacing: '-0.5px',
                  color: '#5645d4'
                }}>{item.value}</div>
              </div>
            ))}
          </div>

          <dl style={{ margin: 0 }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom: '1px solid #ede9e4'
            }}>
              <dt style={{
                fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif",
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: '1.50',
                color: '#787671'
              }}>Short URL</dt>
              <dd style={{
                fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif",
                fontSize: '14px',
                fontWeight: 500,
                lineHeight: '1.50',
                color: '#5645d4',
                margin: 0,
                textAlign: 'right',
                maxWidth: '70%'
              }}>
                <a href={`${window.location.origin}/${selectedLink.shortCode}`} target="_blank" rel="noopener noreferrer" style={{ color: '#5645d4', textDecoration: 'none' }}
                  onMouseEnter={(e) => { e.target.style.textDecoration = 'underline' }}
                  onMouseLeave={(e) => { e.target.style.textDecoration = 'none' }}
                >{`${window.location.origin}/${selectedLink.shortCode}`}</a>
              </dd>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom: '1px solid #ede9e4'
            }}>
              <dt style={{
                fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif",
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: '1.50',
                color: '#787671'
              }}>Original URL</dt>
              <dd style={{
                fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif",
                fontSize: '14px',
                fontWeight: 500,
                lineHeight: '1.50',
                color: '#1a1a1a',
                margin: 0,
                textAlign: 'right',
                maxWidth: '70%'
              }}>{selectedLink.originalUrl}</dd>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom: '1px solid #ede9e4'
            }}>
              <dt style={{
                fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif",
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: '1.50',
                color: '#787671'
              }}>Created At</dt>
              <dd style={{
                fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif",
                fontSize: '14px',
                fontWeight: 500,
                lineHeight: '1.50',
                color: '#1a1a1a',
                margin: 0
              }}>{formatDate(selectedLink.createdAt)}</dd>
            </div>
          </dl>
        </div>
      )}

      {/* All Links List */}
      {!selectedLink && (
        <div className="card-base" style={{
          borderRadius: '12px',
          border: '1px solid #e5e3df',
          padding: '32px',
          background: '#ffffff',
          marginBottom: '32px'
        }}>
          <h2 style={{
            fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif",
            fontSize: '22px',
            fontWeight: 600,
            lineHeight: '1.30',
            color: '#1a1a1a',
            margin: '0 0 16px 0'
          }}>All Links ({links.length})</h2>

          {links.length === 0 ? (
            <p style={{
              fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif",
              fontSize: '14px',
              color: '#787671',
              textAlign: 'center',
              padding: '32px 0'
            }}>No links created yet. Go to Home to create your first short URL!</p>
          ) : (
            <div>
              {links.map((link, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: index < links.length - 1 ? '1px solid #ede9e4' : 'none'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif",
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#5645d4',
                      marginBottom: '4px'
                    }}>{link.shortCode}</div>
                    <div style={{
                      fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif",
                      fontSize: '12px',
                      color: '#787671'
                    }}>{link.originalUrl}</div>
                  </div>
                  <div style={{
                    textAlign: 'right',
                    marginLeft: '16px'
                  }}>
                    <div style={{
                      fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif",
                      fontSize: '18px',
                      fontWeight: 600,
                      color: '#1a1a1a'
                    }}>{link.clicks || 0}</div>
                    <div style={{
                      fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif",
                      fontSize: '12px',
                      color: '#787671'
                    }}>clicks</div>
                  </div>
                  <button
                    onClick={() => setSelectedLink(link)}
                    className="btn-ghost"
                    style={{ marginLeft: '12px', whiteSpace: 'nowrap' }}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
