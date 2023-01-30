import { EntitySchema, type EntitySchemaOptions } from 'typeorm';
import { Mariadb } from './mariadb';
import { Mysql8 } from './mysql8';
import { Default } from './default';
import { Sqlite } from './sqlite';
import { type Adapter, type AdapterType } from './type';

const createAdapter = (
  type?: AdapterType,
  name?: string,
  schemas?: EntitySchemaOptions<unknown>[],
): Adapter => {
  const entities = schemas?.map((schema) => new EntitySchema(schema));
  switch (type) {
    case 'mariadb':
      return new Mariadb(name, entities);
    case 'mysql:8':
      return new Mysql8(name, entities);
    case 'sqlite':
      return new Sqlite(name, entities);
    default:
      return new Default();
  }
};

export { createAdapter };
