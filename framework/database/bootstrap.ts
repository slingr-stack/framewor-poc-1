import { MikroORM, EntityManager, Options } from '@mikro-orm/core';
import { SqliteDriver } from '@mikro-orm/sqlite';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path-browserify';
const join = path.join;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// MikroORM config for SQLite (in-memory for dev/testing)
const mikroOrmConfig: Options = {
  entities: [join(__dirname, '/../entities')], // adjust path as needed
  dbName: ':memory:', // or './data/sqlite.db' for persistent
  driver: SqliteDriver,
  debug: false,
  allowGlobalContext: true,
};

export let orm: MikroORM<SqliteDriver>;
export let em: EntityManager;

export async function initializeDataSource(): Promise<void> {
  try {
    orm = await MikroORM.init<SqliteDriver>(mikroOrmConfig);
    em = orm.em;
    console.log('MikroORM Data Source has been initialized.');
  } catch (err) {
    console.error('Error during MikroORM initialization:', err);
    throw err;
  }
}
