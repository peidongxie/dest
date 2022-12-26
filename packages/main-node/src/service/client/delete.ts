import { type ProtoDefinition } from '@dest-toolkit/grpc-client';
import { type Route } from '@dest-toolkit/http-client';
import { type Client } from '../../domain';
import { deleteMemo } from '../memo';

const deleteClient = async <API extends Route[] | ProtoDefinition>(
  port: number,
  hostname: string,
): Promise<Client<API> | null> => {
  return deleteMemo<Client<API>>(['client', port, hostname]);
};

export { deleteClient };
