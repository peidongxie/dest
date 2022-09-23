import { Database, type AdapterType } from '../../domain';
import readDatabase from './read';

const service = async (
  type: AdapterType,
  name: string,
): Promise<Database | null> => {
  const database = readDatabase(type, name);
  if (!database) return null;
  return database.destroy();
};

export default service;
