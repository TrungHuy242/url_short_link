import * as urlModel from '../models/url.model.js';
import { getRedisClient } from '../config/redis.js';

const CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour

let cleanupTimer = null;

export const startCleanupJob = () => {
  console.log('Starting expired URL cleanup job (runs every 1 hour)...');

  const runCleanup = async () => {
    try {
      console.log('Running expired URL cleanup...');
      const result = await urlModel.deleteExpiredUrls();

      if (result.deletedCount > 0) {
        console.log(`Deleted ${result.deletedCount} expired URLs`);

        // Clear Redis cache for expired short codes
        const redis = getRedisClient();
        if (redis && result.expiredCodes.length > 0) {
          for (const code of result.expiredCodes) {
            await redis.del(`url:${code}`).catch(() => {});
          }
          console.log(`Cleared Redis cache for ${result.expiredCodes.length} expired URLs`);
        }
      } else {
        console.log('No expired URLs to clean up');
      }
    } catch (error) {
      console.error('Cleanup job error:', error);
    }
  };

  // Run immediately on start
  runCleanup();

  // Then run every hour
  cleanupTimer = setInterval(runCleanup, CLEANUP_INTERVAL);
};

export const stopCleanupJob = () => {
  if (cleanupTimer) {
    clearInterval(cleanupTimer);
    cleanupTimer = null;
    console.log('Stopped expired URL cleanup job');
  }
};
