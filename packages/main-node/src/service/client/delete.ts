import { type ProtoDefinition } from '@dest-toolkit/grpc-client';
import { type Route } from '@dest-toolkit/http-client';
import { type HttpClient, type RpcClient } from '../../domain';
import { deleteMemo } from '../memo';

const deleteClient = async <T extends Route | ProtoDefinition>(
  port: number,
  hostname: string,
): Promise<
  ([T] extends [ProtoDefinition] ? RpcClient<T> : HttpClient) | null
> => {
  return deleteMemo<[T] extends [ProtoDefinition] ? RpcClient<T> : HttpClient>([
    'client',
    port,
    hostname,
  ]);
};

export { deleteClient };
