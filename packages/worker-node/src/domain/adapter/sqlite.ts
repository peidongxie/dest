import { readdir, rm } from 'fs/promises';
import { join } from 'path';
import sqlite3 from 'sqlite3';
import { DataSource, EntitySchema } from 'typeorm';
import { type Adapter } from './type';

const dir = `docker/${process.env.DEST_PORT || 'dev'}/sqlite`;

const driver = sqlite3.verbose();
const { Database, OPEN_CREATE, OPEN_READONLY, OPEN_READWRITE } = driver;
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
  public readonly name: string;
  public readonly readable: DataSource | null;
  public readonly writable: DataSource | null;

  constructor(name?: string, entities?: EntitySchema[]) {
    this.name = name || '';
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
        entities: entities || [],
        synchronize: true,
        driver: writeDriver,
      });
    } else {
      this.readable = null;
      this.writable = null;
    }
  }

  public async fetchRows(table: string) {
    if (!this.name) return null;
    return (this.readable as DataSource).query(`SELECT * FROM ${table}`);
  }

  public async fetchTables() {
    if (!this.name) return null;
    const rows: { name: string }[] = await (this.readable as DataSource).query(
      `SELECT name FROM sqlite_master WHERE type = 'table'`,
    );
    return rows
      .filter((row) => !protectedTables.includes(row.name))
      .map((row) => row.name);
  }

  public getReadableDataSource() {
    return this.readable;
  }

  public getWritableDataSource() {
    return this.writable;
  }

  public async postCreate() {
    if (this.name) return;
    for (const file of await readdir(dir)) {
      await rm(join(dir, file), { force: true });
    }
  }

  public async postDestroy() {
    if (!this.name) return;
    const file = this.name + '.sqlite';
    await rm(join(dir, file), { force: true });
  }

  public async preCreate() {
    if (!this.name) return;
    const file = this.name + '.sqlite';
    await rm(join(dir, file), { force: true });
  }

  public async preDestroy() {
    if (this.name) return;
    for (const file of await readdir(dir)) {
      await rm(join(dir, file), { force: true });
    }
  }
}

export { Sqlite };
