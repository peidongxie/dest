import { type EntitySchemaOptions } from 'typeorm';
import { Database, type AdapterType } from '../../domain';
import { createMemo } from '../memo';

const createDatabase = async (
  type: AdapterType,
  name: string,
  schemas: EntitySchemaOptions<unknown>[],
): Promise<Database | null> => {
  const database = createMemo(
    ['database', type, name],
    new Database(type, name, schemas),
  );
  return database?.create() || null;
};

export { createDatabase };
