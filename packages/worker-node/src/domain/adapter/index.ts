import { EntitySchema, type EntitySchemaOptions } from 'typeorm';
import Mariadb from './mariadb';
import Mysql8 from './mysql8';
import Sqlite from './sqlite';
import {
  type Adapter,
  type AdapterResultItem,
  type AdapterType,
  type AdapterTypeAlias,
} from './type';

const adapterMapper: Record<AdapterTypeAlias, AdapterType | null> = {
  0: null,
  2049: 'sqlite',
  3306: 'mariadb',
  3307: 'mysql:8',
  93307: 'mysql:8',
  [-1]: null,
};

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
  adapterMapper,
  createAdapter,
  type Adapter,
  type AdapterResultItem,
  type AdapterType,
  type AdapterTypeAlias,
};
