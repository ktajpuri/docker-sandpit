const Redis = require('ioredis');

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  retryStrategy(times) {
    return Math.min(times * 50, 2000);
  },
});

module.exports = redis;
