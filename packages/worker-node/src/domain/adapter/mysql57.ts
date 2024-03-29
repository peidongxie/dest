import { DataSource, EntitySchema } from 'typeorm';
import { type Adapter } from './type';

const isProd = process.env.NODE_ENV === 'production';
const host = isProd ? 'mysql57' : 'localhost';
const password = `dest_${Number(process.env.APP_PORT)}_mysql57`;

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
  'REFERENCES',
  'SELECT',
  'SHOW DATABASES',
  'SHOW VIEW',
  'UPDATE',
];

const protectedDatabases = [
  'information_schema',
  'mysql',
  'performance_schema',
  'sys',
];

class Mysql57 implements Adapter {
  public static root: DataSource;

  public readonly name: string;
  public readonly readable: DataSource;
  public readonly writable: DataSource;

  constructor(name?: string, entities?: EntitySchema[]) {
    this.name = name || '';
    if (name) {
      this.readable = new DataSource({
        type: 'mysql',
        host,
        port: 3307,
        database: name,
        username: 'read',
        password,
      });
      this.writable = new DataSource({
        type: 'mysql',
        host,
        port: 3307,
        database: name,
        username: 'write',
        password,
        entities: entities || [],
        synchronize: true,
      });
    } else {
      Mysql57.root =
        Mysql57.root ||
        new DataSource({
          type: 'mysql',
          host,
          port: 3307,
          username: 'root',
          password,
        });
      this.readable = Mysql57.root;
      this.writable = Mysql57.root;
    }
  }

  public async fetchRows(table: string) {
    if (!this.name) return null;
    return this.readable.query(`SELECT * FROM \`${table}\``);
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
    return Mysql57.root;
  }

  public getWritableDataSource() {
    return this.writable;
  }

  public async postCreate() {
    if (this.name) return;
    const rows: { Database: string }[] = await Mysql57.root.query(
      `SHOW DATABASES`,
    );
    const names = rows
      .filter((row) => {
        return !protectedDatabases.includes(row.Database);
      })
      .map((row) => row.Database);
    for (const name of names) {
      await Mysql57.root.query(`DROP DATABASE IF EXISTS \`${name}\``);
    }
    await Mysql57.root.query(`DROP USER IF EXISTS \`read\``);
    await Mysql57.root.query(`DROP USER IF EXISTS \`write\``);
    await Mysql57.root.query(
      `CREATE USER \`read\` IDENTIFIED BY '${password}'`,
    );
    await Mysql57.root.query(
      `CREATE USER \`write\` IDENTIFIED BY '${password}'`,
    );
    await Mysql57.root.query(
      `GRANT ${readPrivileges.join(', ')} ON *.* TO \`read\``,
    );
    await Mysql57.root.query(
      `GRANT ${writePrivileges.join(', ')} ON *.* TO \`write\``,
    );
    await Mysql57.root.query(`FLUSH PRIVILEGES`);
  }

  public async postDestroy() {
    if (!this.name) return;
    await Mysql57.root.query(`DROP DATABASE \`${this.name}\``);
  }

  public async preCreate() {
    if (!this.name) return;
    await Mysql57.root.query(`DROP DATABASE IF EXISTS \`${this.name}\``);
    await Mysql57.root.query(`CREATE DATABASE \`${this.name}\``);
  }

  public async preDestroy() {
    if (this.name) return;
    const rows: { Database: string }[] = await Mysql57.root.query(
      `SHOW DATABASES`,
    );
    const names = rows
      .filter((row) => {
        return !protectedDatabases.includes(row.Database);
      })
      .map((row) => row.Database);
    for (const name of names) {
      await Mysql57.root.query(`DROP DATABASE IF EXISTS \`${name}\``);
    }
  }
}

export { Mysql57 };
