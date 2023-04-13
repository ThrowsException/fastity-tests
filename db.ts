import { FastifyPluginAsync } from 'fastify';
import { readFileSync } from 'fs';
import path from 'path';
import { DataSource } from 'typeorm';

const p = path.join(__dirname, './filenotexist');
readFileSync(p);

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password',
  synchronize: true,
  entities: ['./entities.ts'],
});

export const db: FastifyPluginAsync = async (server, opts) => {
  console.log(AppDataSource.initialize);
  await AppDataSource.initialize();
  server.decorate('db', AppDataSource);
  server.addHook('onClose', async (instance) => {
    instance.log.info('Shutting down database');
    await AppDataSource.destroy();
  });
};
