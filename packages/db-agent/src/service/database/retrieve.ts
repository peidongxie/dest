import {
  Database,
  type AdapterType,
  type AdapterTypeAlias,
} from '../../domain';

const service = (
  type: AdapterType | AdapterTypeAlias,
  name: string,
): Database | null => {
  return Database.find(type, name);
};

export default service;
