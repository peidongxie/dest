import { readdir, rm } from 'fs/promises';
import { basename, extname, join } from 'path';
import sqlite3 from 'sqlite3';
import { DataSource, EntitySchema } from 'typeorm';
import { type Adapter } from './type';

const driver = sqlite3.verbose();
const { Database, OPEN_CREATE, OPEN_READONLY, OPEN_READWRITE } = driver;
const dir = 'docker/sqlite';

const readDriver = {
  verbose: () => ({
    ...driver,
    Database: class {
      constructor(filename: string, callback?: (err: Error | null) => void) {
        return new Database(filename, OPEN_READONLY, callback);
      }
    },
  }),
};

const writeDriver = {
  verbose: () => ({
    ...driver,
    Database: class {
      constructor(filename: string, callback?: (err: Error | null) => void) {
        return new Database(filename, OPEN_READWRITE | OPEN_CREATE, callback);
      }
    },
  }),
};

const protectedTables = ['sql_master', 'sqlite_sequence'];

class Sqlite implements Adapter {
  name: string;
  readable: DataSource | null;
  writable: DataSource | null;

  constructor(name: string, entities: EntitySchema[]) {
    this.name = name;
    const file = this.name + '.sqlite';
    if (name) {
      this.readable = new DataSource({
        type: 'sqlite',
        database: join(dir, file),
        driver: readDriver,
      });
      this.writable = new DataSource({
        type: 'sqlite',
        database: join(dir, file),
        entities: entities,
        synchronize: true,
        driver: writeDriver,
      });
    } else {
      this.readable = null;
      this.writable = null;
    }
  }

  getReadableDataSource() {
    return this.readable;
  }

  getRootDataSource() {
    return null;
  }

  async getSnapshot() {
    if (this.name) {
      const rows: { name: string }[] = await (
        this.readable as DataSource
      ).query(`SELECT name FROM sqlite_master WHERE type = "table"`);
      const tables = rows
        .filter((row) => {
          return !protectedTables.includes(row.name);
        })
        .map((row) => row.name);
      return Promise.all(
        tables.map(async (table) => {
          const start = process.hrtime.bigint();
          const rows = await (this.readable as DataSource).query(
            `SELECT * FROM ${table}`,
          );
          const end = process.hrtime.bigint();
          return {
            time: Number(end - start),
            table,
            rows,
          };
        }),
      );
    } else {
      const rows = await readdir(dir);
      const tables = rows
        .filter((row) => extname(row) === '.sqlite')
        .map((row) => basename(row, '.sqlite'));
      return Promise.all(
        tables.map(async (table) => {
          return {
            time: 0,
            table,
            rows: [],
          };
        }),
      );
    }
  }

  getWritableDataSource() {
    return this.writable;
  }

  async postDestroy() {
    if (!this.name) return;
    const file = this.name + '.sqlite';
    await rm(join(dir, file), { force: true });
  }

  async preCreate() {
    if (!this.name) return;
    const file = this.name + '.sqlite';
    rm(join(dir, file), { force: true });
  }
}

export default Sqlite;
