import { type DataSource } from 'typeorm';

interface Adapter {
  fetchRows: (table: string) => Promise<unknown[] | null>;
  fetchTables: () => Promise<string[] | null>;
  getReadableDataSource: () => DataSource | null;
  getRootDataSource?: () => DataSource | null;
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

type AdapterType = 'mariadb' | 'mssql' | 'mysql57' | 'mysql8' | 'sqlite';

export { type Adapter, type AdapterType };
