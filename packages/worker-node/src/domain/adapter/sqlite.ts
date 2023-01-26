import { rm } from 'fs/promises';
import { join } from 'path';
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

  public getReadableDataSource() {
    return this.readable;
  }

  public async getRows(table: string) {
    if (!this.name) return null;
    return (this.readable as DataSource).query(`SELECT * FROM ${table}`);
  }

  public async getTables() {
    if (!this.name) return null;
    const rows: { name: string }[] = await (this.readable as DataSource).query(
      `SELECT name FROM sqlite_master WHERE type = 'table'`,
    );
    return rows
      .filter((row) => !protectedTables.includes(row.name))
      .map((row) => row.name);
  }

  public getWritableDataSource() {
    return this.writable;
  }

  public async postDestroy() {
    if (!this.name) return;
    const file = this.name + '.sqlite';
    await rm(join(dir, file), { force: true });
  }

  public async preCreate() {
    if (!this.name) return;
    const file = this.name + '.sqlite';
    rm(join(dir, file), { force: true });
  }
}

export default Sqlite;
