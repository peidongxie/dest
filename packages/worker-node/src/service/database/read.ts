import { type AdapterType, type Database } from '../../domain';
import { readPool } from '../pool';

const service = (type: AdapterType, name: string): Database | null => {
  return readPool(['database', type, name]);
};

export default service;
