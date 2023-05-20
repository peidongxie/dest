import { DataSource, EntitySchema } from 'typeorm';
import { type Adapter } from './type';

const isProd = process.env.NODE_ENV === 'production';
const host = isProd ? 'mssql' : 'localhost';
const password = `dest_${Number(process.env.APP_PORT)}_mssql`;

const readPrivileges = ['SELECT', 'VIEW DEFINITION'];
const writePrivileges = [
  'ALTER',
  'CONTROL',
  'DELETE',
  'EXECUTE',
  'INSERT',
  'REFERENCES',
  'SELECT',
  'UPDATE',
  'VIEW DEFINITION',
];

const protectedDatabases = ['master', 'model', 'msdb', 'tempdb'];

class Mssql implements Adapter {
  public static root: DataSource;

  public readonly name: string;
  public readonly readable: DataSource;
  public readonly writable: DataSource;

  constructor(name?: string, entities?: EntitySchema[]) {
    this.name = name || '';
    if (name) {
      this.readable = new DataSource({
        type: 'mssql',
        host,
        port: 1433,
        database: name,
        username: 'read',
        password,
        options: {
          trustServerCertificate: true,
        },
      });
      this.writable = new DataSource({
        type: 'mssql',
        host,
        port: 1433,
        database: name,
        username: 'write',
        password,
        entities: entities || [],
        synchronize: true,
        options: {
          trustServerCertificate: true,
        },
      });
    } else {
      Mssql.root =
        Mssql.root ||
        new DataSource({
          type: 'mssql',
          host,
          port: 1433,
          username: 'sa',
          password,
          options: {
            trustServerCertificate: true,
          },
        });
      this.readable = Mssql.root;
      this.writable = Mssql.root;
    }
  }

  public async fetchRows(table: string) {
    if (!this.name) return null;
    return this.readable.query(`SELECT * FROM [${table}]`);
  }

  public async fetchTables() {
    if (!this.name) return null;
    const rows: { TABLE_NAME: string }[] = await this.readable.query(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES`,
    );
    return rows.map((row) => row.TABLE_NAME);
  }

  public getReadableDataSource() {
    return this.readable;
  }

  public getRootDataSource() {
    return Mssql.root;
  }

  public getWritableDataSource() {
    return this.writable;
  }

  public async postCreate() {
    if (this.name) return;
    const rows: { name: string }[] = await Mssql.root.query(
      `SELECT name FROM sys.databases`,
    );
    const names = rows
      .filter((row) => {
        return !protectedDatabases.includes(row.name);
      })
      .map((row) => row.name);
    for (const name of names) {
      await Mssql.root.query(`DROP DATABASE IF EXISTS [${name}]`);
    }
    await Mssql.root.query(
      `IF EXISTS (SELECT 1 FROM sys.server_principals WHERE name = 'read') DROP LOGIN [read];`,
    );
    await Mssql.root.query(
      `IF EXISTS (SELECT 1 FROM sys.server_principals WHERE name = 'write') DROP LOGIN [write];`,
    );
    await Mssql.root.query(`CREATE LOGIN [read] WITH PASSWORD = '${password}'`);
    await Mssql.root.query(
      `CREATE LOGIN [write] WITH PASSWORD = '${password}'`,
    );
  }

  public async postDestroy() {
    if (!this.name) return;
    await Mssql.root.query(`DROP DATABASE [${this.name}]`);
  }

  public async preCreate() {
    if (!this.name) return;
    await Mssql.root.query(`DROP DATABASE IF EXISTS [${this.name}]`);
    await Mssql.root.query(`CREATE DATABASE [${this.name}]`);
    await Mssql.root.query(`USE [${this.name}]`);
    await Mssql.root.query(`CREATE USER [read] FOR LOGIN [read]`);
    await Mssql.root.query(`CREATE USER [write] FOR LOGIN [write]`);
    await Mssql.root.query(
      `GRANT ${readPrivileges.join(', ')} ON DATABASE::[${
        this.name
      }] TO [read]`,
    );
    await Mssql.root.query(
      `GRANT ${writePrivileges.join(', ')} ON DATABASE::[${
        this.name
      }] TO [write]`,
    );
    await Mssql.root.query(`USE [master]`);
  }

  public async preDestroy() {
    if (this.name) return;
    const rows: { name: string }[] = await Mssql.root.query(
      `SELECT name FROM sys.databases`,
    );
    const names = rows
      .filter((row) => {
        return !protectedDatabases.includes(row.name);
      })
      .map((row) => row.name);
    for (const name of names) {
      await Mssql.root.query(`DROP DATABASE IF EXISTS [${name}]`);
    }
  }
}

export { Mssql };
