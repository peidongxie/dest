import { type ProtoDefinition } from '@dest-toolkit/grpc-client';
import { type Route } from '@dest-toolkit/http-client';
import { Client } from '../../domain';
import { createMemo } from '../memo';

const createClient = async <API extends Route[] | ProtoDefinition>(
  api: API,
  port: number,
  hostname: string,
): Promise<Client<API> | null> => {
  const client = createMemo(
    ['client', port, hostname],
    new Client(api, port, hostname),
  );
  return client || null;
};

export { createClient };
