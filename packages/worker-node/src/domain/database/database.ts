import { type EntitySchemaOptions } from 'typeorm';
import { createAdapter, type Adapter, type AdapterType } from '../adapter';
import {
  type DatabaseEventItem,
  type DatabaseHierarchy,
  type DatabaseResult,
  type DatabaseSnapshotItem,
} from './type';

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
  ): Promise<DatabaseResult<T>> | null {
    return (
      this[event.action]?.(event.target, event.values, event.tables) || null
    );
  }

  public async introspect(
    withRows: string[] | boolean,
  ): Promise<DatabaseHierarchy | null> {
    const tables = Array.isArray(withRows)
      ? withRows
      : await this.adapter.getTables();
    if (!tables) return null;
    if (!withRows) {
      return {
        type: this.type,
        name: this.name,
        snapshots: tables.map((table) => ({ table, rows: [] })),
      };
    }
    const snapshots = await Promise.all(
      tables.map(async (table) => ({
        table,
        rows: await this.adapter.getRows(table),
      })),
    );
    if (snapshots.some((snapshot) => !snapshot.rows)) return null;
    return {
      type: this.type,
      name: this.name,
      snapshots: snapshots as DatabaseSnapshotItem<unknown>[],
    };
  }

  public read<T>(
    query: string,
    values: unknown[],
    tables: string[],
  ): Promise<DatabaseResult<T>> | null {
    const dataSource = this.adapter.getReadableDataSource();
    if (!dataSource) return null;
    return this.getResult<T>(() => dataSource.query(query, values), tables);
  }

  public remove<T>(
    target: string,
    entities: unknown[],
    tables: string[],
  ): Promise<DatabaseResult<T>> | null {
    const dataSource = this.adapter.getWritableDataSource();
    if (!dataSource) return null;
    return this.getResult<T>(async () => {
      await this.adapter.preRemove?.();
      const rows = await dataSource.getRepository(target).remove(entities);
      await this.adapter.postRemove?.();
      return rows;
    }, tables);
  }

  public root<T>(
    query: string,
    values: unknown[],
    tables: string[],
  ): Promise<DatabaseResult<T>> | null {
    const dataSource = this.adapter.getRootDataSource();
    if (!dataSource) return null;
    return this.getResult<T>(() => dataSource.query(query, values), tables);
  }

  public save<T>(
    target: string,
    entities: unknown[],
    tables: string[],
  ): Promise<DatabaseResult<T>> | null {
    const dataSource = this.adapter.getWritableDataSource();
    if (!dataSource) return null;
    return this.getResult<T>(async () => {
      await this.adapter.preSave?.();
      const rows = await dataSource.getRepository(target).save(entities);
      await this.adapter.postSave?.();
      return rows;
    }, tables);
  }

  public write<T>(
    query: string,
    values: unknown[],
    tables: string[],
  ): Promise<DatabaseResult<T>> | null {
    const dataSource = this.adapter.getWritableDataSource();
    if (!dataSource) return null;
    return this.getResult<T>(() => dataSource.query(query, values), tables);
  }

  private async getResult<T>(
    rowsGetter: () => unknown,
    tables: string[],
  ): Promise<DatabaseResult<T>> {
    const result: DatabaseResult<T> = {
      time: 0,
      error: '',
      rows: [],
      snapshots: [],
    };
    const start = process.hrtime.bigint();
    try {
      const rows = (await rowsGetter()) as T[];
      result.rows = !rows ? [] : !Array.isArray(rows) ? [rows] : rows;
    } catch (e) {
      result.error = String(e) || 'Unknown error';
    }
    const end = process.hrtime.bigint();
    result.time = Number(end - start);
    if (result.error) return result;
    try {
      const hierarchy = await this.introspect(tables);
      result.snapshots = hierarchy?.snapshots || [];
    } catch (e) {
      result.error = String(e) || 'Unknown error';
    }
    return result;
  }
}

export { Database };
