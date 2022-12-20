import { type AdapterType, type Database } from '../../domain';
import { readPool } from '../pool';

const readDatabase = (type: AdapterType, name: string): Database | null => {
  return readPool(['database', type, name]);
};

export { readDatabase };
