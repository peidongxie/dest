import { type EntitySchemaOptions } from 'typeorm';
import { createAdapter, type Adapter, type AdapterType } from '../adapter';
import {
  type DatabaseEventItem,
  type DatabaseHierarchy,
  type DatabaseResult,
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
    return this[event.action]?.(event.target, event.values) || null;
  }

  public async introspect(
    level: 0 | 1 | 2 | 3,
  ): Promise<DatabaseHierarchy | null> {
    // level 0
    const hierarchy: DatabaseHierarchy = {
      type: this.type,
      databases: [],
    };
    if (level === 0) return hierarchy;
    const name = this.name;
    if (!name) return null;
    hierarchy.databases.push({
      name,
      snapshots: [],
    });
    if (level === 1) return hierarchy;
    try {
      const tables = await this.adapter.getTables();
      if (!tables) return null;
      for (const table of tables) {
        hierarchy.databases[0].snapshots.push({
          table,
          rows: [],
        });
      }
    } catch {
      return null;
    }
    if (level === 2) return hierarchy;
    try {
      for (const snapshot of hierarchy.databases[0].snapshots) {
        const rows = await this.adapter.getRows(snapshot.table);
        if (!rows) return null;
        snapshot.rows.push(...rows);
      }
    } catch {
      return null;
    }
    return null;
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
    const dataSource = this.adapter.getRootDataSource();
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
      snapshots: [],
    };
    const start = process.hrtime.bigint();
    try {
      const rows = (await rowsGetter()) as T[];
      result.rows = !rows ? [] : !Array.isArray(rows) ? [rows] : rows;
    } catch (e) {
      result.error = String(e);
    }
    const end = process.hrtime.bigint();
    result.time = Number(end - start);
    return result;
  }
}

export { Database };
