import { Database, type AdapterType } from '../../domain';

const service = (type: AdapterType, name: string): Database | null => {
  return Database.store[type]?.get(name) || null;
};

export default service;
