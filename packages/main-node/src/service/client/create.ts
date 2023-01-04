import { type ProtoDefinition } from '@dest-toolkit/grpc-client';
import { type Route } from '@dest-toolkit/http-client';
import { HttpClient, RpcClient } from '../../domain';
import { createMemo } from '../memo';

const createClient = async <T extends Route | ProtoDefinition>(
  api: T[],
  port: number,
  hostname: string,
): Promise<
  ([T] extends [ProtoDefinition] ? RpcClient<T> : HttpClient) | null
> => {
  if (
    api.every(
      (definition) =>
        Reflect.has(definition, 'name') &&
        Reflect.has(definition, 'fullName') &&
        Reflect.has(definition, 'methods'),
    )
  ) {
    const client = createMemo(
      ['rpc-client', port, hostname],
      new RpcClient(
        api as [T] extends [ProtoDefinition] ? T[] : never,
        port,
        hostname,
      ) as [T] extends [ProtoDefinition] ? RpcClient<T> : never,
    );
    return client || null;
  } else {
    const client = createMemo(
      ['http-client', port, hostname],
      new HttpClient(
        api as [T] extends [ProtoDefinition] ? never : T[],
        port,
        hostname,
      ) as [T] extends [ProtoDefinition] ? never : HttpClient,
    );
    return client || null;
  }
};

export { createClient };
