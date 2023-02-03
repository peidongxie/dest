import { type ClientType, type Context, type Scheduler } from '../../domain';
import { readMemo, readMemos } from '../memo';

const readContext = (
  type: ClientType,
  name: string,
): Scheduler<Context> | null => {
  return readMemo<Scheduler<Context>>(['context', type, name]);
};

const readContexts = (): Scheduler<Context>[] => {
  return readMemos<Scheduler<Context>>(['context']);
};

export { readContext, readContexts };
