import { type AdapterType, type Database, type Scheduler } from '../../domain';
import { readMemo, readMemos } from '../memo';

const readDatabase = (
  type: AdapterType,
  name: string,
): Scheduler<Database> | null => {
  return readMemo<Scheduler<Database>>(['database', type, name]);
};

const readDatabases = (type: AdapterType): Scheduler<Database>[] => {
  return readMemos<Scheduler<Database>>(['database', type]);
};

export { readDatabase, readDatabases };
