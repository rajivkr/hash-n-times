import redis from 'redis';
import Url from 'url';

const REDISTOGO_URL = process.env.REDISTOGO_URL || undefined;
let REDIS_PORT = 6379;
let REDIS_HOST = '127.0.0.1';
let REDIS_PASS =
  'QPnVuXjVvaKlZ+D8z7z3simO/opiv1wDT9OOorOVG0LPjWB2qjHop1RL2DBIirqUsWPB/XX3rUIAbWeK';
if (REDISTOGO_URL) {
  const reduxUrl = Url.parse(process.env.REDISTOGO_URL);
  REDIS_PORT = reduxUrl.port;
  REDIS_HOST = reduxUrl.hostname;
  // eslint-disable-next-line prefer-destructuring
  REDIS_PASS = reduxUrl.auth.split(':')[1];
}

const redisClient = redis.createClient(REDIS_PORT, REDIS_HOST, {
  no_ready_check: true,
});
redisClient.auth(REDIS_PASS);
redisClient.on('connect', () => {});

export default redisClient;
