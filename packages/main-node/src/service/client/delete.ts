import { type ProtoDefinition } from '@dest-toolkit/grpc-client';
import { type HttpClient, type RpcClient } from '../../domain';
import { deleteMemo } from '../memo';

const deleteHttpClient = async (
  port: number,
  hostname: string,
): Promise<HttpClient | null> => {
  return deleteMemo<HttpClient>(['http-client', port, hostname]);
};

const deleteRpcClient = async <T extends ProtoDefinition>(
  port: number,
  hostname: string,
): Promise<RpcClient<T> | null> => {
  return deleteMemo<RpcClient<T>>(['client', port, hostname]);
};

export { deleteHttpClient, deleteRpcClient };
