import { Database, type AdapterType } from '../../domain';
import readDatabase from './read';

const service = async (
  type: AdapterType,
  name: string,
): Promise<Database | null> => {
  const database = readDatabase(type, name);
  return database ? database.destroy() : null;
};

export default service;
