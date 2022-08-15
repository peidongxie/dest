import { type EntitySchemaOptions } from 'typeorm';
import { createAdapter, type Adapter, type AdapterType } from '../adapter';

class Database {
  static store: Record<AdapterType, Map<string, Database>> = {
    mariadb: new Map(),
    'mysql:8': new Map(),
  };

  adapter: Adapter;
  name: string;
  schemas: EntitySchemaOptions<unknown>[];
  type: AdapterType;

  constructor(
    type: AdapterType,
    name?: string,
    schemas?: EntitySchemaOptions<unknown>[],
  ) {
    this.type = type;
    this.name = name || '';
    this.schemas = schemas || [];
    this.adapter = createAdapter(this.type, this.name, this.schemas);
  }

  async create(): Promise<Database> {
    await this.adapter.preCreate?.();
    if (this.name) {
      await this.adapter.getReadableDataSource().initialize();
      await this.adapter.getWritableDataSource().initialize();
    } else {
      await this.adapter.getRootDataSource().initialize();
    }
    Database.store[this.type].set(this.name, this);
    await this.adapter.postCreate?.();
    return this;
  }

  async destroy(): Promise<Database> {
    await this.adapter.preDestroy?.();
    Database.store[this.type].delete(this.name);
    if (this.name) {
      await this.adapter.getReadableDataSource().destroy();
      await this.adapter.getWritableDataSource().destroy();
    } else {
      await this.adapter.getRootDataSource().destroy();
    }
    await this.adapter.postDestroy?.();
    return this;
  }

  read<T>(query: string): Promise<T> {
    return this.adapter.getReadableDataSource().query(query);
  }

  root<T>(query: string): Promise<T> {
    return this.adapter.getRootDataSource().query(query);
  }

  write<T>(query: string): Promise<T> {
    return this.adapter.getWritableDataSource().query(query);
  }
}

export { Database };
