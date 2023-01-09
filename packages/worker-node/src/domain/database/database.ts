import { type EntitySchemaOptions } from 'typeorm';
import { createAdapter, type Adapter, type AdapterType } from '../adapter';
import { type DatabaseAction, type DatabaseResultItem } from './type';

class Database
  implements
    Record<
      DatabaseAction,
      <T>(
        target: string,
        values: unknown[],
      ) => Promise<DatabaseResultItem<T> | null>
    >
{
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

  public async remove<T>(
    target: string,
    entities: unknown[],
  ): Promise<DatabaseResultItem<T> | null> {
    const start = process.hrtime.bigint();
    await this.adapter.preRemove?.();
    const rows = await this.adapter
      .getWritableDataSource()
      ?.getRepository(target)
      .remove(entities);
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
    const start = process.hrtime.bigint();
    await this.adapter.preSave?.();
    const rows = await this.adapter
      .getWritableDataSource()
      ?.getRepository(target)
      .save(entities);
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

  public async snapshot<T>(
    table?: string,
  ): Promise<DatabaseResultItem<T> | null> {
    const start = process.hrtime.bigint();
    const rows = await this.adapter.getSnapshot(table);
    const end = process.hrtime.bigint();
    if (!rows) return null;
    return {
      time: Number(end - start),
      table: table || this.name,
      rows: rows as T[],
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
