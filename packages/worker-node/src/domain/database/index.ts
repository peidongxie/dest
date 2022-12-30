import { type EntitySchemaOptions } from 'typeorm';
import { createAdapter, type Adapter, type AdapterType } from '../adapter';
import { TaskRunner } from '../task-runner';

enum DatabaseState {
  INITIALIZED,
  RUNNING,
  TERMINATED,
}

class Database extends TaskRunner {
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

  async remove<T>(target: string, entities: unknown[]): Promise<T[] | null> {
    return this.runTask(
      (state) =>
        state === DatabaseState.RUNNING ? DatabaseState.RUNNING : null,
      async () => {
        await this.adapter.preRemove?.();
        const rows = await this.adapter
          .getWritableDataSource()
          ?.getRepository(target)
          .remove(entities);
        await this.adapter.postRemove?.();
        if (!Array.isArray(rows)) return null;
        return rows as T[];
      },
    );
  }

  async save<T>(target: string, entities: unknown[]): Promise<T[] | null> {
    return this.runTask(
      (state) =>
        state === DatabaseState.RUNNING ? DatabaseState.RUNNING : null,
      async () => {
        await this.adapter.preSave?.();
        const rows = await this.adapter
          .getWritableDataSource()
          ?.getRepository(target)
          .save(entities);
        await this.adapter.postSave?.();
        if (!Array.isArray(rows)) return null;
        return rows as T[];
      },
    );
  }

  read<T>(query: string): Promise<T[] | null> {
    return this.runTask(
      (state) =>
        state === DatabaseState.RUNNING ? DatabaseState.RUNNING : null,
      () => {
        return this.adapter.getReadableDataSource()?.query(query) || null;
      },
    );
  }

  root<T>(query: string): Promise<T[] | null> {
    return this.runTask(
      (state) =>
        state === DatabaseState.RUNNING ? DatabaseState.RUNNING : null,
      () => {
        return this.adapter.getRootDataSource()?.query(query) || null;
      },
    );
  }

  snapshot(): Promise<{ name: string; rows: unknown[] }[]> {
    return this.runTask(
      (state) =>
        state === DatabaseState.RUNNING ? DatabaseState.RUNNING : null,
      async () => {
        return this.adapter.getSnapshot();
      },
    );
  }

  write<T>(query: string): Promise<T[] | null> {
    return this.runTask(
      (state) =>
        state === DatabaseState.RUNNING ? DatabaseState.RUNNING : null,
      () => {
        return this.adapter.getWritableDataSource()?.query(query) || null;
      },
    );
  }
}

export { Database };
