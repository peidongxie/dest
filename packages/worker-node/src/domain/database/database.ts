import { type EntitySchemaOptions } from 'typeorm';
import { createAdapter, type Adapter, type AdapterType } from '../adapter';
import { type DatabaseEventItem, type DatabaseResultItem } from './type';

class Database {
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

  public async create(): Promise<this> {
    await this.adapter.preCreate?.();
    if (this.name) {
      await this.adapter.getWritableDataSource()?.initialize();
      await this.adapter.getReadableDataSource()?.initialize();
    } else {
      await this.adapter.getRootDataSource()?.initialize();
    }
    await this.adapter.postCreate?.();
    return this;
  }

  public async destroy(): Promise<this> {
    await this.adapter.preDestroy?.();
    if (this.name) {
      await this.adapter.getReadableDataSource()?.destroy();
      await this.adapter.getWritableDataSource()?.destroy();
    } else {
      await this.adapter.getRootDataSource()?.destroy();
    }
    await this.adapter.postDestroy?.();
    return this;
  }

  public emit<T>(
    event: DatabaseEventItem<unknown>,
  ): Promise<DatabaseResultItem<T> | null> | null {
    return this[event.action]?.(event.target, event.values) || null;
  }

  public async remove<T>(
    target: string,
    entities: unknown[],
  ): Promise<DatabaseResultItem<T> | null> {
    const dataSource = this.adapter.getWritableDataSource();
    if (!dataSource) return null;
    const start = process.hrtime.bigint();
    await this.adapter.preRemove?.();
    const rows = await dataSource.getRepository(target).remove(entities);
    await this.adapter.postRemove?.();
    const end = process.hrtime.bigint();
    return {
      time: Number(end - start),
      table: '',
      rows: !rows ? [] : !Array.isArray(rows) ? [rows] : rows,
    };
  }

  public async save<T>(
    target: string,
    entities: unknown[],
  ): Promise<DatabaseResultItem<T> | null> {
    const dataSource = this.adapter.getWritableDataSource();
    if (!dataSource) return null;
    const start = process.hrtime.bigint();
    await this.adapter.preSave?.();
    const rows = await dataSource.getRepository(target).save(entities);
    await this.adapter.postSave?.();
    const end = process.hrtime.bigint();
    return {
      time: Number(end - start),
      table: '',
      rows: !rows ? [] : !Array.isArray(rows) ? [rows] : rows,
    };
  }

  public async read<T>(
    query: string,
    values: unknown[],
  ): Promise<DatabaseResultItem<T> | null> {
    const dataSource = this.adapter.getReadableDataSource();
    if (!dataSource) return null;
    const start = process.hrtime.bigint();
    const rows = await dataSource.query(query, values);
    const end = process.hrtime.bigint();
    return {
      time: Number(end - start),
      table: '',
      rows: !rows ? [] : !Array.isArray(rows) ? [rows] : rows,
    };
  }

  public async root<T>(
    query: string,
    values: unknown[],
  ): Promise<DatabaseResultItem<T> | null> {
    const dataSource = this.adapter.getRootDataSource();
    if (!dataSource) return null;
    const start = process.hrtime.bigint();
    const rows = await dataSource.query(query, values);
    const end = process.hrtime.bigint();
    return {
      time: Number(end - start),
      table: '',
      rows: !rows ? [] : !Array.isArray(rows) ? [rows] : rows,
    };
  }

  public async snapshotRows(): Promise<DatabaseResultItem<unknown>[] | null> {
    const tables = await this.adapter.getTables();
    if (!tables) return null;
    const results: DatabaseResultItem<unknown>[] = [];
    for (const table of tables) {
      const start = process.hrtime.bigint();
      const rows = await this.adapter.getRows(table);
      const end = process.hrtime.bigint();
      if (!rows) return null;
      results.push({
        time: Number(end - start),
        table,
        rows,
      });
    }
    return results;
  }

  public async snapshotTables(): Promise<DatabaseResultItem<string> | null> {
    const start = process.hrtime.bigint();
    const tables = await this.adapter.getTables();
    const end = process.hrtime.bigint();
    if (!tables) return null;
    return {
      time: Number(end - start),
      table: this.name,
      rows: tables,
    };
  }

  public async write<T>(
    query: string,
    values: unknown[],
  ): Promise<DatabaseResultItem<T> | null> {
    const dataSource = this.adapter.getWritableDataSource();
    if (!dataSource) return null;
    const start = process.hrtime.bigint();
    const rows = await dataSource.query(query, values);
    const end = process.hrtime.bigint();
    return {
      time: Number(end - start),
      table: '',
      rows: !rows ? [] : !Array.isArray(rows) ? [rows] : rows,
    };
  }
}

export { Database };
