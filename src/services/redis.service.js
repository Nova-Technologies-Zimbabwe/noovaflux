const Redis = require('ioredis');
const config = require('../config');

class RedisClient {
  constructor() {
    this.client = null;
    this.subscriber = null;
    this.connected = false;
  }

  connect() {
    if (this.connected && this.client) return;
    
    try {
      this.client = new Redis({
        host: config.redis.host,
        port: config.redis.port,
        retryStrategy: (times) => Math.min(times * 50, 2000),
        maxRetriesPerRequest: 3,
        lazy: false,
      });

      this.subscriber = new Redis({
        host: config.redis.host,
        port: config.redis.port,
        retryStrategy: (times) => Math.min(times * 50, 2000),
        maxRetriesPerRequest: 3,
        lazy: false,
      });

      this.client.on('connect', () => { 
        console.log('Redis connected');
        this.connected = true;
      });
      this.client.on('error', (err) => { 
        console.error('Redis error:', err.message);
        this.connected = false;
      });
    } catch (err) {
      console.error('Failed to connect Redis:', err.message);
      this.connected = false;
    }
  }

  async ensureConnection() {
    if (!this.connected || !this.client) {
      this.connect();
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  async get(key) {
    await this.ensureConnection();
    if (!this.client) return null;
    try { return await this.client.get(key); } catch { return null; }
  }

  async set(key, value, ttl = 0) {
    await this.ensureConnection();
    if (!this.client) return null;
    try {
      if (ttl > 0) return await this.client.set(key, value, 'EX', ttl);
      return await this.client.set(key, value);
    } catch { return null; }
  }

  async del(key) {
    await this.ensureConnection();
    if (!this.client) return 0;
    try { return await this.client.del(key); } catch { return 0; }
  }

  async hset(key, field, value) {
    await this.ensureConnection();
    if (!this.client) return 0;
    try { return await this.client.hset(key, field, value); } catch { return 0; }
  }

  async hget(key, field) {
    await this.ensureConnection();
    if (!this.client) return null;
    try { return await this.client.hget(key, field); } catch { return null; }
  }

  async hgetall(key) {
    await this.ensureConnection();
    if (!this.client) return {};
    try { return await this.client.hgetall(key); } catch { return {}; }
  }

  async incr(key) {
    await this.ensureConnection();
    if (!this.client) return 0;
    try { return await this.client.incr(key); } catch { return 0; }
  }

  async publish(channel, message) {
    await this.ensureConnection();
    if (!this.client) return 0;
    try { return await this.client.publish(channel, JSON.stringify(message)); } catch { return 0; }
  }

  async subscribe(channel, callback) {
    await this.ensureConnection();
    if (!this.subscriber) return;
    try {
      await this.subscriber.subscribe(channel);
      this.subscriber.on('message', (ch, message) => {
        if (ch === channel) {
          try { callback(JSON.parse(message)); } catch {}
        }
      });
    } catch (err) {
      console.error('Subscribe error:', err.message);
    }
  }

  async lpush(key, value) {
    await this.ensureConnection();
    if (!this.client) return 0;
    try { return await this.client.lpush(key, value); } catch { return 0; }
  }

  async lrange(key, start, stop) {
    await this.ensureConnection();
    if (!this.client) return [];
    try { return await this.client.lrange(key, start, stop); } catch { return []; }
  }

  async expire(key, seconds) {
    await this.ensureConnection();
    if (!this.client) return 0;
    try { return await this.client.expire(key, seconds); } catch { return 0; }
  }

  async zadd(key, score, member) {
    await this.ensureConnection();
    if (!this.client) return 0;
    try { return await this.client.zadd(key, score, member); } catch { return 0; }
  }

  async zrange(key, start, stop) {
    await this.ensureConnection();
    if (!this.client) return [];
    try { return await this.client.zrange(key, start, stop); } catch { return []; }
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;