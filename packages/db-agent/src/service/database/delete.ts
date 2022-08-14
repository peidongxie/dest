import {
  Database,
  type AdapterType,
  type AdapterTypeAlias,
} from '../../domain';
import readDatabase from './read';

const service = async (
  type: AdapterType | AdapterTypeAlias,
  name: string,
): Promise<Database | null> => {
  const database = readDatabase(type, name);
  return database ? database.destroy() : null;
};

export default service;
