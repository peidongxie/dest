import { randomInt } from 'crypto';
import { type Client } from '../../domain';
import { readMemo, readMemos } from '../memo';

const readClient = (token?: string): Client | null => {
  if (token) return readMemo<Client>(['client', token]);
  const clients = readMemos<Client>(['client']);
  if (clients.length === 0) return null;
  return clients[randomInt(clients.length)];
};

export { readClient };
