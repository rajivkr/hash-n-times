import redis from 'redis';

// 02rCiBWItasw32MeJChDGz9istMh1p4D
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_HOST = process.env.REDIS_PORT || '127.0.0.1';
const REDIS_PASS =
  process.env.REDIS_PORT ||
  'QPnVuXjVvaKlZ+D8z7z3simO/opiv1wDT9OOorOVG0LPjWB2qjHop1RL2DBIirqUsWPB/XX3rUIAbWeK';

const redisClient = redis.createClient(REDIS_PORT, REDIS_HOST, {
  no_ready_check: true,
});
redisClient.auth(REDIS_PASS);

redisClient.on('connect', () => {});

export default redisClient;
