import Fastify from 'fastify';
import FastifyRedis from 'fastify-redis';

import { getSHA256 } from './utils';
import RedisClient from './redis';

const app = Fastify({ logger: true });
app.register(FastifyRedis, { client: RedisClient });

app.route({
  method: 'GET',
  url: '/',
  schema: {
    querystring: {
      name: { type: 'string' },
      excitement: { type: 'integer' },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          hashedValue: { type: 'string' },
          errorMsg: { type: 'string' },
        },
      },
    },
  },
  handler: (request, reply) => {
    const MAX_HASH_LIMIT = 1e5;
    const { initializationString, hashCount = MAX_HASH_LIMIT } = request.query;
    if (hashCount > MAX_HASH_LIMIT) {
      reply.send({
        errorMsg: 'Limited the Hashing level to 10000',
      });
    }
    app.redis.get(
      `${initializationString}_${hashCount}`,
      async (err, value) => {
        if (err) {
          reply.send({
            errorMsg: err,
          });
        }
        if (value !== null) {
          const cachedHash = JSON.parse(value);
          reply.send(cachedHash);
        } else {
          const hashedValue = await getSHA256(initializationString, hashCount);
          app.redis.setex(
            `${initializationString}_${hashCount}`,
            3600,
            JSON.stringify({ hashedValue }),
          );
          reply.send({ hashedValue });
        }
      },
    );
  },
  preHandler: (request, reply, done) => {
    const { initializationString } = request.query;
    if (initializationString === undefined) {
      reply.send({
        errorMsg: 'Expected initializationString as query parameter',
      });
    }
    done();
  },
});

const start = async () => {
  try {
    await app.listen(3000);
    app.log.info(`server listening on ${app.server.address().port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
