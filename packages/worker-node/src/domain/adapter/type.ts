import { type DataSource } from 'typeorm';

interface Adapter {
  getReadableDataSource: () => DataSource | null;
  getRootDataSource: () => DataSource | null;
  getSnapshot: (table?: string) => Promise<unknown[] | null>;
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

export { type Adapter };
