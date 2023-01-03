import { type EntitySchemaOptions } from 'typeorm';
import { createAdapter, type Adapter, type AdapterType } from '../adapter';
import { TaskRunner } from '../task-runner';
import { type DatabaseAction, type DatabaseResultItem } from './type';

enum DatabaseState {
  INITIALIZED,
  RUNNING,
  TERMINATED,
}

class Database
  extends TaskRunner
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
    super(DatabaseState.INITIALIZED);
    this.type = type;
    this.name = name || '';
    this.adapter = createAdapter(this.type, this.name, schemas || []);
  }

  async create(): Promise<this> {
    return this.runTask(
      (state) =>
        state === DatabaseState.INITIALIZED ? DatabaseState.RUNNING : null,
      async () => {
        await this.adapter.preCreate?.();
        if (this.name) {
          await this.adapter.getWritableDataSource()?.initialize();
          await this.adapter.getReadableDataSource()?.initialize();
        } else {
          await this.adapter.getRootDataSource()?.initialize();
        }
        await this.adapter.postCreate?.();
        return this;
      },
    );
  }

  async destroy(): Promise<this> {
    return this.runTask(
      (state) =>
        state === DatabaseState.RUNNING ? DatabaseState.TERMINATED : null,
      async () => {
        await this.adapter.preDestroy?.();
        if (this.name) {
          await this.adapter.getReadableDataSource()?.destroy();
          await this.adapter.getWritableDataSource()?.destroy();
        } else {
          await this.adapter.getRootDataSource()?.destroy();
        }
        await this.adapter.postDestroy?.();
        return this;
      },
    );
  }

  async remove<T>(
    target: string,
    entities: unknown[],
  ): Promise<DatabaseResultItem<T> | null> {
    return this.runTask(
      (state) =>
        state === DatabaseState.RUNNING ? DatabaseState.RUNNING : null,
      async () => {
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
      },
    );
  }

  async save<T>(
    target: string,
    entities: unknown[],
  ): Promise<DatabaseResultItem<T> | null> {
    return this.runTask(
      (state) =>
        state === DatabaseState.RUNNING ? DatabaseState.RUNNING : null,
      async () => {
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
      },
    );
  }

  read<T>(
    query: string,
    values: unknown[],
  ): Promise<DatabaseResultItem<T> | null> {
    return this.runTask(
      (state) =>
        state === DatabaseState.RUNNING ? DatabaseState.RUNNING : null,
      async () => {
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
      },
    );
  }

  root<T>(
    query: string,
    values: unknown[],
  ): Promise<DatabaseResultItem<T> | null> {
    return this.runTask(
      (state) =>
        state === DatabaseState.RUNNING ? DatabaseState.RUNNING : null,
      async () => {
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
      },
    );
  }

  snapshot<T>(table?: string): Promise<DatabaseResultItem<T> | null> {
    return this.runTask(
      (state) =>
        state === DatabaseState.RUNNING ? DatabaseState.RUNNING : null,
      async () => {
        const start = process.hrtime.bigint();
        const rows = await this.adapter.getSnapshot(table);
        const end = process.hrtime.bigint();
        if (!rows) return null;
        return {
          time: Number(end - start),
          table: table || this.name,
          rows: rows as T[],
        };
      },
    );
  }

  write<T>(
    query: string,
    values: unknown[],
  ): Promise<DatabaseResultItem<T> | null> {
    return this.runTask(
      (state) =>
        state === DatabaseState.RUNNING ? DatabaseState.RUNNING : null,
      async () => {
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
      },
    );
  }
}

export { Database };
