import { type AdapterType, type Database, type Scheduler } from '../../domain';
import { readMemo, readMemos } from '../memo';

const readDatabase = (
  type: AdapterType,
  name: string,
): Scheduler<Database> | null => {
  return readMemo<Scheduler<Database>>(['database', type, name]);
};

const readDatabases = (type?: AdapterType): Scheduler<Database>[] => {
  if (type) readMemos<Scheduler<Database>>(['database', type]);
  const scheduler = readMemo<Scheduler<Database>>(['database']);
  return scheduler
    ? [scheduler, ...readMemos<Scheduler<Database>>(['database'])]
    : readMemos<Scheduler<Database>>(['database']);
};

export { readDatabase, readDatabases };
