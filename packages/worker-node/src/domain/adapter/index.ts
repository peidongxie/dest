import {
  EntitySchema,
  type DataSource,
  type EntitySchemaOptions,
} from 'typeorm';
import Mariadb from './mariadb';
import Mysql8 from './mysql8';
import Sqlite from './sqlite';

type AdapterType = 'mariadb' | 'mysql:8' | 'sqlite';

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

const createAdapter = (
  type: AdapterType,
  name: string,
  schemas: EntitySchemaOptions<unknown>[],
): Adapter => {
  const entities = (schemas || []).map((schema) => new EntitySchema(schema));
  switch (type) {
    case 'mariadb':
      return new Mariadb(name, entities);
    case 'mysql:8':
      return new Mysql8(name, entities);
    case 'sqlite':
      return new Sqlite(name, entities);
    default:
      throw new TypeError('Invalid adapter type');
  }
};

export {
  createAdapter,
  type Adapter,
  type AdapterResultItem,
  type AdapterType,
};
