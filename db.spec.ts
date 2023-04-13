import Fasitfy, { FastifyInstance } from 'fastify';
import { DataSource } from 'typeorm';
import * as db from './db';
import path from 'path';

jest.mock('path', () => ({
  join: jest.fn().mockReturnValue(''),
  dirname: jest.fn(),
  resolve: jest.fn().mockReturnValue([]),
}));
jest.mock('fs');

// jest.mock('typeorm', () => {
//   function d() {
//     return {
//       initialize: mockInitialize,
//     };
//   }
//   return {
//     DataSource: d,
//   };
// });

// jest.mock('typeorm', () => {
//   return {
//     DataSource: jest.fn().mockImplementation(() => {
//       return {
//         initialize: jest.fn(),
//       };
//     }),
//   };
// });

jest.mock('typeorm');

const initializeMock = jest.spyOn(DataSource.prototype, 'initialize');

describe('initialize', () => {
  let fastify: FastifyInstance;
  beforeAll(async () => {
    fastify = Fasitfy();
    await fastify.register(db.db);
    fastify.ready();
  });
  afterAll(() => {
    fastify.close();
  });

  test('Calls join', () => {
    expect(path.join).toBeCalled();
  });

  test('Calls initialize', () => {
    expect(initializeMock).toBeCalled();
  });
});
