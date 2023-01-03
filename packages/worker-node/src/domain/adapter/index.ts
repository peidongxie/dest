import { EntitySchema, type EntitySchemaOptions } from 'typeorm';
import Mariadb from './mariadb';
import Mysql8 from './mysql8';
import Sqlite from './sqlite';
import { type Adapter } from './type';

type AdapterType = 'mariadb' | 'mysql:8' | 'sqlite';

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

export { createAdapter, type Adapter, type AdapterType };
