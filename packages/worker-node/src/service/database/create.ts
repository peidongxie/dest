import { type EntitySchemaOptions } from 'typeorm';
import { Database, type AdapterType } from '../../domain';
import { createPool } from '../pool';

const service = async (
  type: AdapterType,
  name: string,
  schemas: EntitySchemaOptions<unknown>[],
): Promise<Database | null> => {
  const database = createPool(
    ['database', type, name],
    new Database(type, name, schemas),
  );
  return database?.create() || null;
};

export default service;
