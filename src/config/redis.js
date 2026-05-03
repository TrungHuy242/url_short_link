import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

let redisClient = null;
let isRedisConnected = false;

const initRedis = async () => {
  try {
    redisClient = createClient({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        reconnectStrategy: false, // Disable auto-reconnect
      },
      password: process.env.REDIS_PASSWORD || undefined,
      database: parseInt(process.env.REDIS_DB || '0'),
    });

    redisClient.on('error', (err) => {
      console.log('Redis Client Error (non-critical):', err.message);
    });

    redisClient.on('connect', () => {
      console.log('Redis connected');
      isRedisConnected = true;
    });

    redisClient.on('disconnect', () => {
      isRedisConnected = false;
    });

    await redisClient.connect();
  } catch (err) {
    console.log('Redis not available, running without cache:', err.message);
    redisClient = null;
    isRedisConnected = false;
  }
};

// Initialize on import
initRedis().catch(() => {});

export const getRedisClient = () => (isRedisConnected ? redisClient : null);
export const isRedisAvailable = () => isRedisConnected;
export default redisClient;
