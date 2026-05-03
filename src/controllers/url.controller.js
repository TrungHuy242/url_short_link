import * as urlService from '../services/url.service.js';
import { UAParser } from 'ua-parser-js';
import geoip from 'geoip-lite';

export const shortenUrl = async (req, res, next) => {
  try {
    const { url, customAlias, expiresIn } = req.body;

    const result = await urlService.shortenUrl(url, customAlias, expiresIn);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error.message === 'Custom alias already in use') {
      return res.status(409).json({ error: error.message });
    }
    next(error);
  }
};

export const redirectUrl = async (req, res, next) => {
  try {
    const shortCode = req.params[0] || req.params.shortCode;

    // Prepare analytics data
    const ipAddress = req.ip || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';
    const referrer = req.headers['referer'] || '';
    const parser = new UAParser();
    const uaResult = parser.setUA(userAgent).getResult();
    const deviceType = uaResult.device?.type || 'desktop';
    const browser = uaResult.browser?.name || 'unknown';
    const os = uaResult.os?.name || 'unknown';

    // Get geo info
    const geo = geoip.lookup(ipAddress) || {};
    const country = geo.country || null;
    const city = geo.city || null;

    const analyticsData = {
      ipAddress,
      userAgent,
      referrer,
      country,
      city,
      deviceType,
      browser,
      os,
    };

    const originalUrl = await urlService.getOriginalUrl(shortCode, analyticsData);
    if (!originalUrl) {
      return res.status(404).json({ error: 'Short URL not found or expired' });
    }

    res.redirect(301, originalUrl);
  } catch (error) {
    next(error);
  }
};

export const getUrlStats = async (req, res, next) => {
  try {
    const { shortCode } = req.params;

    const stats = await urlService.getStats(shortCode);
    if (!stats) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
