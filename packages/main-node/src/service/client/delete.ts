import { type Client, type Scheduler } from '../../domain';
import { deleteMemo } from '../memo';

const deleteClient = (token: string): Scheduler<Client> | null => {
  return deleteMemo<Scheduler<Client>>(['client', token]);
};

export { deleteClient };
