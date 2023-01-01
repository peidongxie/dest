import { type DataSource } from 'typeorm';

type AdapterType = 'mariadb' | 'mysql:8' | 'sqlite';
type AdapterTypeAlias = 0 | 2049 | 3306 | 3307 | 93307 | -1;

interface AdapterResultItem<T> {
  time: number;
  table: string;
  rows: T[];
}

interface Adapter {
  getReadableDataSource: () => DataSource | null;
  getRootDataSource: () => DataSource | null;
  getSnapshot: () => Promise<AdapterResultItem<unknown>[]>;
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

export {
  type Adapter,
  type AdapterResultItem,
  type AdapterType,
  type AdapterTypeAlias,
};
