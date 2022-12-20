import { type AdapterType, type Database } from '../../domain';
import { readMemo } from '../memo';

const readDatabase = (type: AdapterType, name: string): Database | null => {
  return readMemo(['database', type, name]);
};

export { readDatabase };
