import { DataSource, EntitySchema, type EntitySchemaOptions } from 'typeorm';

type DatabaseType = 'mariadb' | 'mysql:8';
type DatabaseTypeAlias = 'mysql';

class Database {
  static store: Record<DatabaseType, Map<string, Database>> = {
    mariadb: new Map(),
    'mysql:8': new Map(),
  };

  static find(
    type: DatabaseType | DatabaseTypeAlias,
    name: string,
  ): Database | null {
    switch (type) {
      case 'mariadb':
        return this.store.mariadb.get(name) || null;
      case 'mysql':
      case 'mysql:8':
        return this.store['mysql:8'].get(name) || null;
      default:
        throw new TypeError('Unsupported type of database');
    }
  }

  connection: DataSource;
  name: string;
  schemas: EntitySchemaOptions<unknown>[];
  type: DatabaseType;

  constructor(
    type: DatabaseType | DatabaseTypeAlias,
    name: string,
    schemas: EntitySchemaOptions<unknown>[],
  ) {
    const options = {
      host: 'localhost',
      username: 'root',
      password: 'dest-toolkit',
      entities: schemas.map((schema) => new EntitySchema(schema)),
      synchronize: true,
    };
    switch (type) {
      case 'mariadb':
        this.connection = new DataSource({
          ...options,
          type: 'mariadb',
          port: 3306,
          database: name,
        });
        this.name = name;
        this.schemas = schemas;
        this.type = 'mariadb';
        break;
      case 'mysql':
      case 'mysql:8':
        this.connection = new DataSource({
          ...options,
          type: 'mysql',
          port: 3307,
          database: name,
        });
        this.name = name;
        this.schemas = schemas;
        this.type = 'mysql:8';
        break;
      default:
        throw new TypeError('Unsupported type of database');
    }
  }

  async create(): Promise<Database> {
    await this.createIfNotExists();
    await this.connection.initialize();
    Database.store[this.type].set(this.name, this);
    return this;
  }

  async destroy(): Promise<void> {
    Database.store[this.type].delete(this.name);
    await this.connection.destroy();
    await this.destroyIfExists();
    return;
  }

  private async createIfNotExists(): Promise<void> {
    if (!this.name) return;
    switch (this.type) {
      case 'mariadb':
      case 'mysql:8': {
        const root = new Database(this.type, '', []);
        await root.create();
        await root.connection.query(
          `CREATE DATABASE IF NOT EXISTS \`${this.name}\``,
        );
        await root.destroy();
        break;
      }
    }
  }

  private async destroyIfExists(): Promise<void> {
    if (!this.name) return;
    switch (this.type) {
      case 'mariadb':
      case 'mysql:8': {
        const root = new Database(this.type, '', []);
        await root.create();
        await root.connection.query(`DROP DATABASE IF EXISTS \`${this.name}\``);
        await root.destroy();
        break;
      }
    }
  }
}

export { Database as default, type DatabaseType, type DatabaseTypeAlias };
