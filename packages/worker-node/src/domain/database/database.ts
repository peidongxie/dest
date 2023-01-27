import { type EntitySchemaOptions } from 'typeorm';
import { createAdapter, type Adapter, type AdapterType } from '../adapter';
import { type DatabaseEventItem, type DatabaseResult } from './type';

class Database {
  private adapter: Adapter;
  private name: string;
  private type: AdapterType | '';

  constructor(
    type?: AdapterType,
    name?: string,
    schemas?: EntitySchemaOptions<unknown>[],
  ) {
    this.adapter = createAdapter(type, name, schemas);
    this.name = name || '';
    this.type = type || '';
  }

  public async create(): Promise<this> {
    await this.adapter.preCreate?.();
    if (this.name) {
      await this.adapter.getWritableDataSource()?.initialize();
      await this.adapter.getReadableDataSource()?.initialize();
    } else {
      await this.adapter.getRootDataSource?.()?.initialize();
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
      await this.adapter.getRootDataSource?.()?.destroy();
    }
    await this.adapter.postDestroy?.();
    return this;
  }

  public emit<T>(
    event: DatabaseEventItem<unknown>,
  ): Promise<DatabaseResult<T>> | null {
    return this[event.action]?.(event.target, event.values) || null;
  }

  public introspect<T>(
    level: string,
    tables: unknown[],
  ): Promise<DatabaseResult<T>> | null {
    if (level !== 'table' && level !== 'row') return null;
    if (tables.some((table) => typeof table !== 'string')) return null;
    if (level === 'table') {
      return this.getResult<T>(async () => {
        const rows = (await this.adapter.getTables())?.map((table) => ({
          table,
        }));
        if (!rows) throw 'Unknown error';
        return rows;
      });
    }
    return this.getResult<T>(async () => {
      const rows = await Promise.all(
        tables.map(async (table) => ({
          table,
          rows: await this.adapter.getRows(table as string),
        })),
      );
      if (rows.some((row) => !row.rows)) throw 'Unknown error';
      return rows;
    });
  }

  public read<T>(
    query: string,
    values: unknown[],
  ): Promise<DatabaseResult<T>> | null {
    const dataSource = this.adapter.getReadableDataSource();
    if (!dataSource) return null;
    return this.getResult<T>(() => dataSource.query(query, values));
  }

  public remove<T>(
    target: string,
    entities: unknown[],
  ): Promise<DatabaseResult<T>> | null {
    const dataSource = this.adapter.getWritableDataSource();
    if (!dataSource) return null;
    return this.getResult<T>(async () => {
      await this.adapter.preRemove?.();
      const rows = await dataSource.getRepository(target).remove(entities);
      await this.adapter.postRemove?.();
      return rows;
    });
  }

  public root<T>(
    query: string,
    values: unknown[],
  ): Promise<DatabaseResult<T>> | null {
    const dataSource = this.adapter.getRootDataSource?.();
    if (!dataSource) return null;
    return this.getResult<T>(() => dataSource.query(query, values));
  }

  public save<T>(
    target: string,
    entities: unknown[],
  ): Promise<DatabaseResult<T>> | null {
    const dataSource = this.adapter.getWritableDataSource();
    if (!dataSource) return null;
    return this.getResult<T>(async () => {
      await this.adapter.preSave?.();
      const rows = await dataSource.getRepository(target).save(entities);
      await this.adapter.postSave?.();
      return rows;
    });
  }

  public write<T>(
    query: string,
    values: unknown[],
  ): Promise<DatabaseResult<T>> | null {
    const dataSource = this.adapter.getWritableDataSource();
    if (!dataSource) return null;
    return this.getResult<T>(() => dataSource.query(query, values));
  }

  private async getResult<T>(
    rowsGetter: () => unknown,
  ): Promise<DatabaseResult<T>> {
    const result: DatabaseResult<T> = {
      time: 0,
      error: '',
      rows: [],
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
    return result;
  }
}

export { Database };
