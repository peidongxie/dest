import { type DataSource } from 'typeorm';

interface Adapter {
  getReadableDataSource: () => DataSource | null;
  getRootDataSource?: () => DataSource | null;
  getRows: (table: string) => Promise<unknown[] | null>;
  getTables: () => Promise<string[] | null>;
  getWritableDataSource: () => DataSource | null;
  postCreate?: () => Promise<void>;
  postDestroy?: () => Promise<void>;
  postRemove?: () => Promise<void>;
  postSave?: () => Promise<void>;
  preCreate?: () => Promise<void>;
  preDestroy?: () => Promise<void>;
  preRemove?: () => Promise<void>;
  preSave?: () => Promise<void>;
}

type AdapterType = 'mariadb' | 'mysql:8' | 'sqlite';

export { type Adapter, type AdapterType };
