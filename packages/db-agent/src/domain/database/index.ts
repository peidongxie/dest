import { type EntitySchemaOptions } from 'typeorm';
import { createAdapter, type Adapter, type AdapterType } from '../adapter';

class Database {
  static store: Record<AdapterType, Map<string, Database>> = {
    mariadb: new Map(),
    'mysql:8': new Map(),
  };

  adapter: Adapter;
  name: string;
  type: AdapterType;

  constructor(
    type: AdapterType,
    name?: string,
    schemas?: EntitySchemaOptions<unknown>[],
  ) {
    this.type = type;
    this.name = name || '';
    this.adapter = createAdapter(this.type, this.name, schemas || []);
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

  async remove(target: string, entities: unknown[]): Promise<Database> {
    await this.adapter.preRemove?.();
    await this.adapter
      .getWritableDataSource()
      .getRepository(target)
      .remove(entities);
    await this.adapter.postRemove?.();
    return this;
  }

  async save(target: string, entities: unknown[]): Promise<Database> {
    await this.adapter.preSave?.();
    await this.adapter
      .getWritableDataSource()
      .getRepository(target)
      .save(entities);
    await this.adapter.postSave?.();
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
