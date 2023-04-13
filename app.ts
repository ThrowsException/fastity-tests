import Fastify from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import { db } from './db';

const fastify = Fastify({ logger: true });

// fastify.withTypeProvider<TypeBoxTypeProvider>();

const Person = Type.Object({
  firstName: Type.String(),
  lastName: Type.String(),
  middleName: Type.Optional(Type.String()),
  phone: Type.String(),
  address: Type.String(),
});

console.log(Person);

fastify.register(db);
fastify.register(async (server) => {
  server.get('/', async (request, reply) => {
    return {
      firstName: 'Alex',
      lastName: 'Ovechkin',
      middleName: 'Russia',
      phone: '8888888888',
      address: '1 Capital Way',
    };
  });

  server.get(
    '/typebox',
    { schema: { response: { 200: Person } } },
    async (request, reply) => {
      return {
        firstName: 'Alex',
        lastName: 'Ovechkin',
        middleName: 'Russia',
        phone: '8888888888',
        address: '1 Capital Way',
      };
    }
  );

  server.get(
    '/plain',
    {
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              firstName: { type: 'string' },
              lastName: { type: 'string' },
              middleName: { type: 'string' },
              phone: { type: 'string' },
              address: { type: 'string' },
            },
            required: ['firstName', 'lastName', 'phone', 'address'],
          },
        },
      },
    },
    async (request, reply) => {
      return {
        firstName: 'Alex',
        lastName: 'Ovechkin',
        middleName: 'Russia',
        phone: '8888888888',
        address: '1 Capital Way',
      };
    }
  );
});

fastify.setErrorHandler(async (error, req, rep) => {
  fastify.log.error(error);
  return rep.status(409).send({ ok: false });
});

fastify.listen({ port: 3000, host: '0.0.0.0' });
