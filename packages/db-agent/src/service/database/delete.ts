import {
  Database,
  type AdapterType,
  type AdapterTypeAlias,
} from '../../domain';
import retrieveDatabase from './retrieve';

const service = async (
  type: AdapterType | AdapterTypeAlias,
  name: string,
): Promise<Database | null> => {
  const database = retrieveDatabase(type, name);
  return database ? database.destroy() : null;
};

export default service;
