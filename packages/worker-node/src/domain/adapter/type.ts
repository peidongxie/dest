import { type DataSource } from 'typeorm';

type AdapterType = 'mariadb' | 'mysql:8' | 'sqlite';
type AdapterTypeAlias = 2049 | 3306 | 3307 | 93307;

interface Adapter {
  getReadableDataSource: () => DataSource | null;
  getRootDataSource: () => DataSource | null;
  getSnapshot: () => Promise<{ name: string; rows: unknown[] }[]>;
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

export { type Adapter, type AdapterType, type AdapterTypeAlias };
