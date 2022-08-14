import { EntitySchema, type EntitySchemaOptions } from 'typeorm';
import Mariadb from './mariadb';
import Mysql8 from './mysql8';
import { type Adapter, type AdapterType, type AdapterTypeAlias } from './type';

const adapterMapper: Record<AdapterType | AdapterTypeAlias, AdapterType> = {
  mariadb: 'mariadb',
  mysql: 'mysql:8',
  'mysql:8': 'mysql:8',
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
    default:
      throw new TypeError('Invalid adapter type');
  }
};

export {
  adapterMapper,
  createAdapter,
  type Adapter,
  type AdapterType,
  type AdapterTypeAlias,
};
