import { type EntitySchemaOptions } from 'typeorm';
import { Database, type AdapterType } from '../../domain';
import readDatabase from './read';

const service = async (
  type: AdapterType,
  name: string,
  schemas: EntitySchemaOptions<unknown>[],
): Promise<Database | null> => {
  const database = readDatabase(type, name);
  if (database) return null;
  return new Database(type, name, schemas).create();
};

export default service;
