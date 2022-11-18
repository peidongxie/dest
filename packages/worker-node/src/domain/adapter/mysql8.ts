import { DataSource, EntitySchema } from 'typeorm';
import { type Adapter } from './type';

const protectedDatabases = [
  'information_schema',
  'mysql',
  'performance_schema',
  'sys',
];

const readPrivileges = ['SELECT', 'SHOW DATABASES', 'SHOW VIEW'];

const writePrivileges = [
  'ALTER',
  'CREATE',
  'CREATE TEMPORARY TABLES',
  'CREATE VIEW',
  'DELETE',
  'DROP',
  'INDEX',
  'INSERT',
  'LOCK TABLES',
  'REFERENCES',
  'SELECT',
  'SHOW DATABASES',
  'SHOW VIEW',
  'UPDATE',
];

class Mysql8 implements Adapter {
  static root: DataSource;

  name: string;
  readable: DataSource;
  writable: DataSource;

  constructor(name: string, entities: EntitySchema[]) {
    this.name = name;
    if (name) {
      this.readable = new DataSource({
        type: 'mysql',
        host: 'localhost',
        port: 3307,
        database: name,
        username: 'read',
        password: 'dest-toolkit',
      });
      this.writable = new DataSource({
        type: 'mysql',
        host: 'localhost',
        port: 3307,
        database: name,
        username: 'write',
        password: 'dest-toolkit',
        entities: entities,
        synchronize: true,
      });
    } else {
      Mysql8.root =
        Mysql8.root ||
        new DataSource({
          type: 'mysql',
          host: 'localhost',
          port: 3307,
          username: 'root',
          password: 'dest-toolkit',
        });
      this.readable = Mysql8.root;
      this.writable = Mysql8.root;
    }
  }

  getReadableDataSource() {
    return this.readable;
  }

  getRootDataSource() {
    return Mysql8.root;
  }

  async getSnapshot() {
    if (this.name) {
      const result: { Name: string }[] = await this.readable.query(
        `SHOW TABLE STATUS`,
      );
      const names = result.map((row) => row.Name);
      return Promise.all(
        names.map(async (name) => ({
          name,
          rows: await this.readable.query(`SELECT * FROM ${name}`),
        })),
      );
    } else {
      const result: { Database: string }[] = await Mysql8.root.query(
        `SHOW DATABASES`,
      );
      return result.map((row) => ({ name: row.Database, rows: [] }));
    }
  }

  getWritableDataSource() {
    return this.writable;
  }

  async postCreate() {
    if (this.name) return;
    const result: { Database: string }[] = await Mysql8.root.query(
      `SHOW DATABASES`,
    );
    const names = result
      .filter((row) => {
        return !protectedDatabases.includes(row.Database);
      })
      .map((row) => row.Database);
    for (const name of names) {
      await Mysql8.root.query(`DROP DATABASE IF EXISTS \`${name}\``);
    }
    await Mysql8.root.query(`DROP USER IF EXISTS 'read'@'%'`);
    await Mysql8.root.query(`DROP USER IF EXISTS 'write'@'%'`);
    await Mysql8.root.query(
      `CREATE USER IF NOT EXISTS 'read'@'%' IDENTIFIED BY 'dest-toolkit'`,
    );
    await Mysql8.root.query(
      `CREATE USER IF NOT EXISTS 'write'@'%' IDENTIFIED BY 'dest-toolkit'`,
    );
    await Mysql8.root.query(
      `GRANT ${readPrivileges.join(', ')} ON *.* TO 'read'@'%'`,
    );
    await Mysql8.root.query(
      `GRANT ${writePrivileges.join(', ')} ON *.* TO 'write'@'%'`,
    );
    await Mysql8.root.query(`FLUSH PRIVILEGES`);
  }

  async postDestroy() {
    if (!this.name) return;
    await Mysql8.root.query(`DROP DATABASE \`${this.name}\``);
  }

  async preCreate() {
    if (!this.name) return;
    await Mysql8.root.query(`DROP DATABASE IF EXISTS \`${this.name}\``);
    await Mysql8.root.query(`CREATE DATABASE \`${this.name}\``);
  }
}

export default Mysql8;
