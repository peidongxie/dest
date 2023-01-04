import { type ProtoDefinition } from '@dest-toolkit/grpc-client';
import { type Route } from '@dest-toolkit/http-client';
import { type HttpClient, type RpcClient } from '../../domain';
import { readMemo } from '../memo';

const readClient = <T extends Route | ProtoDefinition>(
  port: number,
  hostname: string,
): ([T] extends [ProtoDefinition] ? RpcClient<T> : HttpClient) | null => {
  return readMemo<[T] extends [ProtoDefinition] ? RpcClient<T> : HttpClient>([
    'client',
    port,
    hostname,
  ]);
};

export { readClient };
