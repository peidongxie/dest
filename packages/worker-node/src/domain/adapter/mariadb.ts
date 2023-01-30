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

class Mariadb implements Adapter {
  public static root: DataSource;

  public name: string;
  public readable: DataSource;
  public writable: DataSource;

  constructor(name?: string, entities?: EntitySchema[]) {
    this.name = name || '';
    if (name) {
      this.readable = new DataSource({
        type: 'mariadb',
        host: 'localhost',
        port: 3306,
        database: name,
        username: 'read',
        password: 'dest-toolkit',
      });
      this.writable = new DataSource({
        type: 'mariadb',
        host: 'localhost',
        port: 3306,
        database: name,
        username: 'write',
        password: 'dest-toolkit',
        entities: entities || [],
        synchronize: true,
      });
    } else {
      Mariadb.root =
        Mariadb.root ||
        new DataSource({
          type: 'mariadb',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: 'dest-toolkit',
        });
      this.readable = Mariadb.root;
      this.writable = Mariadb.root;
    }
  }

  public async fetchRows(table: string) {
    if (!this.name) return null;
    return this.readable.query(`SELECT * FROM ${table}`);
  }

  public async fetchTables() {
    if (!this.name) return null;
    const rows: { Name: string }[] = await this.readable.query(
      `SHOW TABLE STATUS`,
    );
    return rows.map((row) => row.Name);
  }

  public getReadableDataSource() {
    return this.readable;
  }

  public getRootDataSource() {
    return Mariadb.root;
  }

  public getWritableDataSource() {
    return this.writable;
  }

  public async postCreate() {
    if (this.name) return;
    const rows: { Database: string }[] = await Mariadb.root.query(
      `SHOW DATABASES`,
    );
    const names = rows
      .filter((row) => {
        return !protectedDatabases.includes(row.Database);
      })
      .map((row) => row.Database);
    for (const name of names) {
      await Mariadb.root.query(`DROP DATABASE IF EXISTS \`${name}\``);
    }
    await Mariadb.root.query(`DROP USER IF EXISTS 'read'@'%'`);
    await Mariadb.root.query(`DROP USER IF EXISTS 'write'@'%'`);
    await Mariadb.root.query(
      `CREATE USER IF NOT EXISTS 'read'@'%' IDENTIFIED BY 'dest-toolkit'`,
    );
    await Mariadb.root.query(
      `CREATE USER IF NOT EXISTS 'write'@'%' IDENTIFIED BY 'dest-toolkit'`,
    );
    await Mariadb.root.query(
      `GRANT ${readPrivileges.join(', ')} ON *.* TO 'read'@'%'`,
    );
    await Mariadb.root.query(
      `GRANT ${writePrivileges.join(', ')} ON *.* TO 'write'@'%'`,
    );
    await Mariadb.root.query(`FLUSH PRIVILEGES`);
  }

  public async postDestroy() {
    if (!this.name) return;
    await Mariadb.root.query(`DROP DATABASE \`${this.name}\``);
  }

  public async preCreate() {
    if (!this.name) return;
    await Mariadb.root.query(`DROP DATABASE IF EXISTS \`${this.name}\``);
    await Mariadb.root.query(`CREATE DATABASE \`${this.name}\``);
  }

  public async preDestroy() {
    if (this.name) return;
    const rows: { Database: string }[] = await Mariadb.root.query(
      `SHOW DATABASES`,
    );
    const names = rows
      .filter((row) => {
        return !protectedDatabases.includes(row.Database);
      })
      .map((row) => row.Database);
    for (const name of names) {
      await Mariadb.root.query(`DROP DATABASE IF EXISTS \`${name}\``);
    }
  }
}

export default Mariadb;
