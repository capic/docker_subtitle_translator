import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';

export default fp(async function (fastify: FastifyInstance) {
  await fastify.register(cors, {
    origin: true,
  });
});
