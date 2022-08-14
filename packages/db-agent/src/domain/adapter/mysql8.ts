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
        username: 'root',
        password: 'dest-toolkit',
      });
      this.writable = new DataSource({
        type: 'mysql',
        host: 'localhost',
        port: 3307,
        database: name,
        username: 'root',
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

  getWritableDataSource() {
    return this.writable;
  }

  async postDestroy() {
    if (this.name) {
      await Mysql8.root.query(`DROP DATABASE IF EXISTS \`${this.name}\``);
    }
  }

  async preCreate() {
    if (this.name) {
      await Mysql8.root.query(`CREATE DATABASE IF NOT EXISTS \`${this.name}\``);
    }
  }

  async postCreate() {
    if (!this.name) {
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
  }
}

export default Mysql8;
