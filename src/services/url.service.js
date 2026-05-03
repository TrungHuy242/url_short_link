import { nanoid } from 'nanoid';
import { getRedisClient, isRedisAvailable } from '../config/redis.js';
import * as urlModel from '../models/url.model.js';
import dotenv from 'dotenv';

dotenv.config();

const SHORT_CODE_LENGTH = parseInt(process.env.SHORT_CODE_LENGTH || '6');
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const URL_CACHE_TTL = 3600; // 1 hour

export const shortenUrl = async (originalUrl, customAlias = null, expiresInDays = null) => {
  let shortCode = customAlias;

  if (!shortCode) {
    shortCode = nanoid(SHORT_CODE_LENGTH);
    // Ensure uniqueness
    while (await urlModel.findByShortCode(shortCode)) {
      shortCode = nanoid(SHORT_CODE_LENGTH);
    }
  } else {
    // Check if custom alias already exists
    const existing = await urlModel.findByShortCode(shortCode);
    if (existing) {
      throw new Error('Custom alias already in use');
    }
  }

  const expiresAt = expiresInDays
    ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
    : null;

  const url = await urlModel.createShortUrl(originalUrl, shortCode, expiresAt);

  // Cache the mapping if Redis is available
  const redis = getRedisClient();
  if (redis) {
    await redis.setEx(`url:${shortCode}`, URL_CACHE_TTL, originalUrl).catch(() => {});
  }

  return {
    shortCode: url.short_code,
    shortUrl: `${BASE_URL}/${url.short_code}`,
    originalUrl: url.original_url,
    expiresAt: url.expires_at,
  };
};

export const getOriginalUrl = async (shortCode, analyticsData = null) => {
  // Try cache first if Redis is available
  const redis = getRedisClient();
  if (redis) {
    const cached = await redis.get(`url:${shortCode}`).catch(() => null);
    if (cached) {
      // Increment clicks asynchronously
      urlModel.incrementClicks(shortCode).catch(console.error);
      // Track analytics asynchronously
      if (analyticsData) {
        urlModel.insertAnalytics(
          shortCode,
          analyticsData.ipAddress,
          analyticsData.userAgent,
          analyticsData.referrer,
          analyticsData.country,
          analyticsData.city,
          analyticsData.deviceType,
          analyticsData.browser,
          analyticsData.os
        ).catch(console.error);
      }
      return cached;
    }
  }

  const url = await urlModel.findByShortCode(shortCode);
  if (!url) return null;

  // Cache for next time if Redis is available
  if (redis) {
    await redis.setEx(`url:${shortCode}`, URL_CACHE_TTL, url.original_url).catch(() => {});
  }

  // Increment clicks
  urlModel.incrementClicks(shortCode).catch(console.error);

  // Track analytics
  if (analyticsData) {
    urlModel.insertAnalytics(
      shortCode,
      analyticsData.ipAddress,
      analyticsData.userAgent,
      analyticsData.referrer,
      analyticsData.country,
      analyticsData.city,
      analyticsData.deviceType,
      analyticsData.browser,
      analyticsData.os
    ).catch(console.error);
  }

  return url.original_url;
};

export const getStats = async (shortCode) => {
  const stats = await urlModel.findStatsByShortCode(shortCode);
  if (!stats) return null;

  // Get enhanced stats
  const enhancedStats = await urlModel.getEnhancedStats(shortCode);
  return {
    ...stats,
    ...enhancedStats,
  };
};
