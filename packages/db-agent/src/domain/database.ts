import { DataSource, EntitySchema, type EntitySchemaOptions } from 'typeorm';
import {
  adapterMapper,
  createAdapter,
  type Adapter,
  type AdapterType,
  type AdapterTypeAlias,
} from './adapter';

class Database {
  static store: Record<AdapterType, Map<string, Database>> = {
    mariadb: new Map(),
    'mysql:8': new Map(),
  };

  static find(
    type: AdapterType | AdapterTypeAlias,
    name: string,
  ): Database | null {
    return this.store[adapterMapper[type]]?.get(name) || null;
  }

  adapter: Adapter;
  name: string;
  schemas: EntitySchemaOptions<unknown>[];
  writableDataSource: DataSource;

  constructor(
    type: AdapterType | AdapterTypeAlias,
    name: string,
    schemas: EntitySchemaOptions<unknown>[],
  ) {
    this.adapter = createAdapter(type);
    this.name = name;
    this.schemas = schemas;
    const entities = schemas.map((schema) => new EntitySchema(schema));
    this.writableDataSource = new DataSource({
      ...this.adapter.getWritableDataSourceOptions(name),
      entities,
    });
  }

  async create(): Promise<Database> {
    await this.createIfNotExists();
    await this.writableDataSource.initialize();
    Database.store[this.adapter.type].set(this.name, this);
    return this;
  }

  async destroy(): Promise<void> {
    Database.store[this.adapter.type].delete(this.name);
    await this.writableDataSource.destroy();
    await this.destroyIfExists();
    return;
  }

  private async createIfNotExists(): Promise<void> {
    if (!this.name) return;
    const query = this.adapter.getCreateQuery(this.name);
    if (!query) return;
    const root = new Database(this.adapter.type, '', []);
    await root.create();
    await root.writableDataSource.query(query);
    await root.destroy();
  }

  private async destroyIfExists(): Promise<void> {
    if (!this.name) return;
    const query = this.adapter.getDestroyQuery(this.name);
    if (!query) return;
    const root = new Database(this.adapter.type, '', []);
    await root.create();
    await root.writableDataSource.query(query);
    await root.destroy();
  }
}

export { Database as default };
