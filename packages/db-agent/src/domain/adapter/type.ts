import { type DataSource } from 'typeorm';

type AdapterType = 'mariadb' | 'mysql:8';
type AdapterTypeAlias = 'mysql';

interface Adapter {
  getReadableDataSource: () => DataSource;
  getRootDataSource: () => DataSource;
  getWritableDataSource: () => DataSource;
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
