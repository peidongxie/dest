import { type EntitySchemaOptions } from 'typeorm';
import {
  Database,
  type AdapterType,
  type AdapterTypeAlias,
} from '../../domain';
import retrieveDatabase from './retrieve';

const service = async (
  type: AdapterType | AdapterTypeAlias,
  name: string,
  schemas: EntitySchemaOptions<unknown>[],
): Promise<Database | null> => {
  const database = retrieveDatabase(type, name);
  return database ? null : new Database(type, name, schemas).create();
};

export default service;
