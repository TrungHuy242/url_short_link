-- URL Shortener Database Schema

CREATE TABLE IF NOT EXISTS urls (
    id SERIAL PRIMARY KEY,
    original_url TEXT NOT NULL,
    short_code VARCHAR(20) UNIQUE NOT NULL,
    clicks INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NULL,
    last_clicked_at TIMESTAMP NULL
);

CREATE INDEX idx_expires_at ON urls(expires_at);

-- Analytics table for detailed tracking
CREATE TABLE IF NOT EXISTS url_analytics (
    id SERIAL PRIMARY KEY,
    short_code VARCHAR(20) NOT NULL,
    accessed_at TIMESTAMP DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    country VARCHAR(100),
    city VARCHAR(100),
    device_type VARCHAR(50),
    browser VARCHAR(100),
    os VARCHAR(100),
    FOREIGN KEY (short_code) REFERENCES urls(short_code) ON DELETE CASCADE
);

CREATE INDEX idx_analytics_short_code ON url_analytics(short_code);
CREATE INDEX idx_analytics_accessed_at ON url_analytics(accessed_at);
