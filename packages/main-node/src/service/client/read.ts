import { type Client } from '../../domain';
import { readMemo, readMemos } from '../memo';

const readClient = (token: string): Client | null => {
  return readMemo<Client>(['client', token]);
};

const readClients = (): Client[] => {
  return readMemos<Client>(['client']);
};

export { readClient, readClients };
