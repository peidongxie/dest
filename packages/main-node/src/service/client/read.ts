import { randomInt } from 'crypto';
import { type Client, type Scheduler } from '../../domain';
import { readMemo, readMemos } from '../memo';

const readClient = (token?: string): Scheduler<Client> | null => {
  if (token) return readMemo<Scheduler<Client>>(['client', token]);
  const schedulers = readMemos<Scheduler<Client>>(['client']);
  if (schedulers.length === 0) return null;
  return schedulers[randomInt(schedulers.length)];
};

export { readClient };
