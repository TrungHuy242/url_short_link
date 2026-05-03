import pool from '../config/database.js';

export const createShortUrl = async (originalUrl, shortCode, expiresAt = null) => {
  const result = await pool.query(
    `INSERT INTO urls (original_url, short_code, expires_at)
     VALUES ($1, $2, $3)
     RETURNING id, original_url, short_code, created_at, expires_at`,
    [originalUrl, shortCode, expiresAt]
  );
  return result.rows[0];
};

export const findByShortCode = async (shortCode) => {
  const result = await pool.query(
    'SELECT * FROM urls WHERE short_code = $1 AND (expires_at IS NULL OR expires_at > NOW())',
    [shortCode]
  );
  return result.rows[0];
};

export const incrementClicks = async (shortCode) => {
  await pool.query(
    'UPDATE urls SET clicks = clicks + 1, last_clicked_at = NOW() WHERE short_code = $1',
    [shortCode]
  );
};

export const findStatsByShortCode = async (shortCode) => {
  const result = await pool.query(
    'SELECT short_code, original_url, clicks, created_at, expires_at, last_clicked_at FROM urls WHERE short_code = $1',
    [shortCode]
  );
  return result.rows[0];
};

export const insertAnalytics = async (shortCode, ipAddress, userAgent, referrer, country, city, deviceType, browser, os) => {
  const result = await pool.query(
    `INSERT INTO url_analytics (short_code, ip_address, user_agent, referrer, country, city, device_type, browser, os)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING id`,
    [shortCode, ipAddress, userAgent, referrer, country, city, deviceType, browser, os]
  );
  return result.rows[0];
};

export const getEnhancedStats = async (shortCode) => {
  // Total clicks and unique visitors
  const summaryResult = await pool.query(
    `SELECT
        COUNT(*) as total_clicks,
        COUNT(DISTINCT ip_address) as unique_visitors
     FROM url_analytics
     WHERE short_code = $1`,
    [shortCode]
  );

  // Top 5 countries
  const countriesResult = await pool.query(
    `SELECT country, COUNT(*) as count
     FROM url_analytics
     WHERE short_code = $1 AND country IS NOT NULL
     GROUP BY country
     ORDER BY count DESC
     LIMIT 5`,
    [shortCode]
  );

  // Top 5 browsers
  const browsersResult = await pool.query(
    `SELECT browser, COUNT(*) as count
     FROM url_analytics
     WHERE short_code = $1 AND browser IS NOT NULL
     GROUP BY browser
     ORDER BY count DESC
     LIMIT 5`,
    [shortCode]
  );

  // Top 5 devices
  const devicesResult = await pool.query(
    `SELECT device_type, COUNT(*) as count
     FROM url_analytics
     WHERE short_code = $1 AND device_type IS NOT NULL
     GROUP BY device_type
     ORDER BY count DESC
     LIMIT 5`,
    [shortCode]
  );

  // Clicks by day (last 30 days)
  const dailyClicksResult = await pool.query(
    `SELECT DATE(accessed_at) as date, COUNT(*) as count
     FROM url_analytics
     WHERE short_code = $1 AND accessed_at >= NOW() - INTERVAL '30 days'
     GROUP BY DATE(accessed_at)
     ORDER BY date ASC`,
    [shortCode]
  );

  return {
    summary: summaryResult.rows[0],
    topCountries: countriesResult.rows,
    topBrowsers: browsersResult.rows,
    topDevices: devicesResult.rows,
    dailyClicks: dailyClicksResult.rows,
  };
};

export const deleteExpiredUrls = async () => {
  // Get expired short codes first
  const expiredResult = await pool.query(
    `SELECT short_code FROM urls WHERE expires_at IS NOT NULL AND expires_at <= NOW()`
  );
  const expiredCodes = expiredResult.rows.map(row => row.short_code);

  // Delete expired URLs (analytics will be deleted by CASCADE)
  const result = await pool.query(
    'DELETE FROM urls WHERE expires_at IS NOT NULL AND expires_at <= NOW() RETURNING id'
  );

  return { deletedCount: result.rowCount, expiredCodes };
};
