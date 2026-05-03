import { Router } from 'express';
import { shortenUrl, getUrlStats } from '../controllers/url.controller.js';
import { validateShortenRequest } from '../middleware/validation.middleware.js';

const router = Router();

// Shorten URL
router.post('/shorten', validateShortenRequest, shortenUrl);

// Get URL statistics
router.get('/stats/:shortCode', getUrlStats);

export default router;
