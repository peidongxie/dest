import {
  Database,
  adapterMapper,
  type AdapterType,
  type AdapterTypeAlias,
} from '../../domain';

const service = (
  type: AdapterType | AdapterTypeAlias,
  name: string,
): Database | null => {
  return Database.store[adapterMapper[type]]?.get(name) || null;
};

export default service;
