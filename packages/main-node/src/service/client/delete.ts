import { type Client } from '../../domain';
import { deleteMemo } from '../memo';

const deleteClient = (token: string): Client | null => {
  return deleteMemo<Client>(['client', token]);
};

export { deleteClient };
