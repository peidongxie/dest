import { type ProtoDefinition } from '@dest-toolkit/grpc-client';
import { type Route } from '@dest-toolkit/http-client';
import { type Client } from '../../domain';
import { readMemo } from '../memo';

const readClient = <API extends Route[] | ProtoDefinition>(
  port: number,
  hostname: string,
): Client<API> | null => {
  return readMemo<Client<API>>(['client', port, hostname]);
};

export { readClient };
