import Redis from 'ioredis';

class RedisService {
  private static client: Redis | null = null;

  static getClient(): Redis {
    if (!this.client) {
      const redisHost = process.env.REDIS_HOST || 'redis';
      const redisPort = parseInt(process.env.REDIS_PORT || '6379');
      const redisPassword = process.env.REDIS_PASSWORD || undefined;

      this.client = new Redis({
        host: redisHost,
        port: redisPort,
        password: redisPassword,
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          console.log(`🔄 Redis: попытка переподключения ${times} через ${delay}ms`);
          return delay;
        },
        maxRetriesPerRequest: 3,
      });

      this.client.on('connect', () => {
        console.log('✅ Redis подключен');
      });

      this.client.on('error', (err) => {
        console.error('❌ Redis ошибка:', err.message);
      });
    }
    return this.client;
  }

  static async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    const client = this.getClient();
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    
    if (ttlSeconds) {
      await client.setex(key, ttlSeconds, stringValue);
    } else {
      await client.set(key, stringValue);
    }
  }

  static async get<T = any>(key: string): Promise<T | null> {
    const client = this.getClient();
    const data = await client.get(key);
    
    if (!data) return null;
    
    try {
      return JSON.parse(data) as T;
    } catch {
      return data as T;
    }
  }

  static async del(key: string): Promise<void> {
    const client = this.getClient();
    await client.del(key);
  }

  static async exists(key: string): Promise<boolean> {
    const client = this.getClient();
    const result = await client.exists(key);
    return result === 1;
  }

  static async flushAll(): Promise<void> {
    const client = this.getClient();
    await client.flushall();
  }

  static async close(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.client = null;
    }
  }
}

export default RedisService;
