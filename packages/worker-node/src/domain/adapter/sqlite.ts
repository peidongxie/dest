import { readdir, rm } from 'fs/promises';
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
      const result: { name: string }[] = await (
        this.readable as DataSource
      ).query(
        `SELECT name FROM sqlite_master WHERE type = "table" AND name != "sqlite_sequence"`,
      );
      const entries = await Promise.all(
        result.map(
          async (row): Promise<[string, unknown[]]> => [
            row.name,
            await (this.readable as DataSource).query(
              `SELECT * FROM ${row.name}`,
            ),
          ],
        ),
      );
      return Object.fromEntries(entries);
    } else {
      const files = await readdir(dir);
      const entries = files
        .filter((file) => file.endsWith('.sqlite'))
        .map((file) => [file.replace(/.sqlite$/, ''), []]);
      return Object.fromEntries(entries);
    }
  }

  getWritableDataSource() {
    return this.writable;
  }

  async postCreate() {
    if (this.name) return;
    const files = await readdir(dir);
    await Promise.all(
      files.map((file) => {
        return rm(join(dir, file), { recursive: true, force: true });
      }),
    );
  }

  async postDestroy() {
    if (!this.name) return;
    const file = this.name + '.sqlite';
    await rm(join(dir, file), { force: true });
  }
}

export default Sqlite;
